package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.DirectChatMessage;
import com.myclass.chat_app.dto.GroupChatMessage;
import com.myclass.chat_app.entity.Message;
import com.myclass.chat_app.entity.MessageType;
import com.myclass.chat_app.repository.MessageRepository;
import com.myclass.chat_app.support.UserIdentitySupport;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class MessageService {

    private static final int HISTORY_LIMIT = 100;
    private static final int MAX_ATTACHMENT_BYTES = 15 * 1024 * 1024;

    private final MessageRepository messageRepository;
    private final SupabaseStorageService storageService;
    private final AtomicLong transientMessageIds = new AtomicLong(50_000);
    private final List<Message> transientLobbyMessages = new CopyOnWriteArrayList<>();
    private final Map<Long, List<GroupChatMessage>> transientGroupMessages = new ConcurrentHashMap<>();
    private final Map<String, List<DirectChatMessage>> transientDirectMessages = new ConcurrentHashMap<>();

    public MessageService(MessageRepository messageRepository, SupabaseStorageService storageService) {
        this.messageRepository = messageRepository;
        this.storageService = storageService;
    }

    public Message saveLobbyMessage(Message incoming) {
        if (incoming == null) {
            return null;
        }
        String room = UserIdentitySupport.trimToNull(incoming.getRoom());
        Message message = new Message();
        message.setSender(UserIdentitySupport.trimToNull(incoming.getSender()));
        message.setSenderEmail(UserIdentitySupport.normalizeEmail(incoming.getSenderEmail()));
        message.setContent(UserIdentitySupport.trimToNull(incoming.getContent()));
        message.setRoom(room != null ? room : "lobby");
        message.setType(MessageType.LOBBY);
        if (message.getSender() == null || message.getContent() == null) {
            return null;
        }
        try {
            return messageRepository.save(message);
        } catch (RuntimeException exception) {
            return storeTransientLobbyMessage(message);
        }
    }

    public GroupChatMessage saveGroupMessage(Long groupId, GroupChatMessage incoming) {
        if (groupId == null || incoming == null) {
            return null;
        }
        String senderEmail = UserIdentitySupport.normalizeEmail(incoming.senderEmail());
        String senderName = UserIdentitySupport.trimToNull(incoming.senderName());
        String content = UserIdentitySupport.trimToNull(incoming.content());
        if (senderEmail == null || content == null) {
            return null;
        }

        Message message = new Message();
        message.setSender(senderName != null ? senderName : UserIdentitySupport.defaultDisplayName(senderEmail));
        message.setSenderEmail(senderEmail);
        message.setGroupId(groupId);
        message.setRoom("group:" + groupId);
        message.setContent(content);
        message.setType(MessageType.GROUP);

        try {
            Message saved = messageRepository.save(message);
            return new GroupChatMessage(
                    groupId,
                    senderEmail,
                    saved.getSender(),
                    saved.getContent(),
                    saved.getTimestamp()
            );
        } catch (RuntimeException exception) {
            GroupChatMessage stored = new GroupChatMessage(
                    groupId,
                    senderEmail,
                    message.getSender(),
                    content,
                    Instant.now()
            );
            storeTransientGroupMessage(groupId, stored);
            return stored;
        }
    }

    public DirectChatMessage saveDirectMessage(String conversationKey, DirectChatMessage incoming) {
        if (conversationKey == null || incoming == null) {
            return null;
        }
        String senderEmail = UserIdentitySupport.normalizeEmail(incoming.senderEmail());
        String recipientEmail = UserIdentitySupport.normalizeEmail(incoming.recipientEmail());
        String senderName = UserIdentitySupport.trimToNull(incoming.senderName());
        String content = UserIdentitySupport.trimToNull(incoming.content());
        if (senderEmail == null || recipientEmail == null || content == null) {
            return null;
        }

        String canonicalKey = buildConversationKey(senderEmail, recipientEmail);
        if (!canonicalKey.equals(conversationKey)) {
            return null;
        }

        Message message = new Message();
        message.setSender(senderName != null ? senderName : UserIdentitySupport.defaultDisplayName(senderEmail));
        message.setSenderEmail(senderEmail);
        message.setRecipientEmail(recipientEmail);
        message.setRoom("direct:" + canonicalKey);
        message.setContent(content);
        message.setType(MessageType.DIRECT);

        try {
            Message saved = messageRepository.save(message);
            return toDirectChatMessage(canonicalKey, saved);
        } catch (RuntimeException exception) {
            DirectChatMessage stored = new DirectChatMessage(
                    canonicalKey,
                    senderEmail,
                    message.getSender(),
                    recipientEmail,
                    content,
                    null,
                    null,
                    null,
                    null,
                    null,
                    Instant.now()
            );
            storeTransientDirectMessage(canonicalKey, stored);
            return stored;
        }
    }

    public DirectChatMessage saveDirectAttachment(
            String senderEmail,
            String senderName,
            String recipientEmail,
            String caption,
            String attachmentName,
            String attachmentContentType,
            byte[] attachmentBytes
    ) {
        String normalizedSender = UserIdentitySupport.normalizeEmail(senderEmail);
        String normalizedRecipient = UserIdentitySupport.normalizeEmail(recipientEmail);
        String trimmedSenderName = UserIdentitySupport.trimToNull(senderName);
        String trimmedCaption = UserIdentitySupport.trimToNull(caption);
        String trimmedAttachmentName = UserIdentitySupport.trimToNull(attachmentName);
        String trimmedContentType = UserIdentitySupport.trimToNull(attachmentContentType);
        if (normalizedSender == null || normalizedRecipient == null) {
            throw new IllegalArgumentException("Both emails are required");
        }
        if (attachmentBytes == null || attachmentBytes.length == 0) {
            throw new IllegalArgumentException("Choose a file before sending.");
        }
        if (attachmentBytes.length > MAX_ATTACHMENT_BYTES) {
            throw new IllegalArgumentException("File size must be 15MB or smaller.");
        }

        String conversationKey = buildConversationKey(normalizedSender, normalizedRecipient);
        String storagePath;
        try {
            storagePath = storageService.uploadDirectAttachment(
                    conversationKey,
                    trimmedAttachmentName != null ? trimmedAttachmentName : "attachment",
                    attachmentBytes,
                    trimmedContentType
            );
        } catch (IllegalStateException exception) {
            throw exception;
        } catch (RuntimeException exception) {
            throw new IllegalStateException("Could not upload the attachment to Supabase Storage.", exception);
        }
        Message message = new Message();
        message.setSender(trimmedSenderName != null ? trimmedSenderName : UserIdentitySupport.defaultDisplayName(normalizedSender));
        message.setSenderEmail(normalizedSender);
        message.setRecipientEmail(normalizedRecipient);
        message.setRoom("direct:" + conversationKey);
        message.setContent(trimmedCaption != null ? trimmedCaption : "");
        message.setAttachmentName(trimmedAttachmentName != null ? trimmedAttachmentName : "attachment");
        message.setAttachmentContentType(trimmedContentType != null ? trimmedContentType : "application/octet-stream");
        message.setAttachmentStoragePath(storagePath);
        message.setAttachmentSize((long) attachmentBytes.length);
        message.setType(MessageType.DIRECT);

        try {
            return toDirectChatMessage(conversationKey, messageRepository.save(message));
        } catch (RuntimeException exception) {
            DirectChatMessage stored = toDirectChatMessage(
                    conversationKey,
                    copyMessage(message)
            );
            storeTransientDirectMessage(conversationKey, stored);
            return stored;
        }
    }

    public List<Message> getLobbyMessages() {
        try {
            return reverseChronological(messageRepository.findTop100ByTypeAndRoomOrderByTimestampDesc(MessageType.LOBBY, "lobby"));
        } catch (RuntimeException exception) {
            return latestTransientLobbyMessages();
        }
    }

    public List<GroupChatMessage> getGroupMessages(Long groupId) {
        try {
            return reverseChronological(messageRepository.findTop100ByTypeAndGroupIdOrderByTimestampDesc(MessageType.GROUP, groupId)).stream()
                    .map(message -> new GroupChatMessage(
                            message.getGroupId(),
                            message.getSenderEmail(),
                            message.getSender(),
                            message.getContent(),
                            message.getTimestamp()
                    ))
                    .toList();
        } catch (RuntimeException exception) {
            return latestTransientGroupMessages(groupId);
        }
    }

    public List<DirectChatMessage> getDirectMessages(String currentUserEmail, String otherEmail) {
        String first = UserIdentitySupport.normalizeEmail(currentUserEmail);
        String second = UserIdentitySupport.normalizeEmail(otherEmail);
        if (first == null || second == null) {
            return List.of();
        }

        String conversationKey = buildConversationKey(first, second);
        try {
            return reverseChronological(
                    messageRepository.findDirectConversation(
                            MessageType.DIRECT,
                            first,
                            second,
                            PageRequest.of(0, HISTORY_LIMIT)
                    )
            ).stream().map(message -> toDirectChatMessage(conversationKey, message)).toList();
        } catch (RuntimeException exception) {
            return latestTransientDirectMessages(conversationKey);
        }
    }

    public String buildConversationKey(String firstEmail, String secondEmail) {
        String first = UserIdentitySupport.normalizeEmail(firstEmail);
        String second = UserIdentitySupport.normalizeEmail(secondEmail);
        if (first == null || second == null) {
            throw new IllegalArgumentException("Both emails are required");
        }
        String pair = List.of(first, second).stream()
                .sorted(Comparator.naturalOrder())
                .reduce((left, right) -> left + "::" + right)
                .orElseThrow();
        return Base64.getUrlEncoder().withoutPadding().encodeToString(pair.getBytes(StandardCharsets.UTF_8));
    }

    private List<Message> reverseChronological(List<Message> messages) {
        List<Message> ordered = new ArrayList<>(messages);
        java.util.Collections.reverse(ordered);
        return ordered;
    }

    private Message storeTransientLobbyMessage(Message source) {
        Message stored = copyMessage(source);
        transientLobbyMessages.add(stored);
        trimChatHistory(transientLobbyMessages);
        return stored;
    }

    private void storeTransientGroupMessage(Long groupId, GroupChatMessage message) {
        List<GroupChatMessage> history = transientGroupMessages.computeIfAbsent(groupId, ignored -> new CopyOnWriteArrayList<>());
        history.add(message);
        trimChatHistory(history);
    }

    private void storeTransientDirectMessage(String conversationKey, DirectChatMessage message) {
        List<DirectChatMessage> history = transientDirectMessages.computeIfAbsent(conversationKey, ignored -> new CopyOnWriteArrayList<>());
        history.add(message);
        trimChatHistory(history);
    }

    private List<Message> latestTransientLobbyMessages() {
        int fromIndex = Math.max(0, transientLobbyMessages.size() - HISTORY_LIMIT);
        return List.copyOf(transientLobbyMessages.subList(fromIndex, transientLobbyMessages.size()));
    }

    private List<GroupChatMessage> latestTransientGroupMessages(Long groupId) {
        List<GroupChatMessage> history = transientGroupMessages.getOrDefault(groupId, List.of());
        int fromIndex = Math.max(0, history.size() - HISTORY_LIMIT);
        return List.copyOf(history.subList(fromIndex, history.size()));
    }

    private List<DirectChatMessage> latestTransientDirectMessages(String conversationKey) {
        List<DirectChatMessage> history = transientDirectMessages.getOrDefault(conversationKey, List.of());
        int fromIndex = Math.max(0, history.size() - HISTORY_LIMIT);
        return List.copyOf(history.subList(fromIndex, history.size()));
    }

    private Message copyMessage(Message source) {
        Message stored = new Message();
        stored.setId(transientMessageIds.incrementAndGet());
        stored.setSender(source.getSender());
        stored.setSenderEmail(source.getSenderEmail());
        stored.setRecipientEmail(source.getRecipientEmail());
        stored.setGroupId(source.getGroupId());
        stored.setContent(source.getContent());
        stored.setAttachmentName(source.getAttachmentName());
        stored.setAttachmentContentType(source.getAttachmentContentType());
        stored.setAttachmentBase64(source.getAttachmentBase64());
        stored.setAttachmentStoragePath(source.getAttachmentStoragePath());
        stored.setAttachmentSize(source.getAttachmentSize());
        stored.setTimestamp(source.getTimestamp() != null ? source.getTimestamp() : Instant.now());
        stored.setRoom(source.getRoom());
        stored.setType(source.getType());
        return stored;
    }

    private DirectChatMessage toDirectChatMessage(String conversationKey, Message message) {
        String attachmentUrl = null;
        String attachmentStoragePath = message.getAttachmentStoragePath();
        if (attachmentStoragePath != null && !attachmentStoragePath.isBlank() && storageService.isConfigured()) {
            try {
                attachmentUrl = storageService.createSignedDownloadUrl(attachmentStoragePath);
            } catch (RuntimeException ignored) {
                attachmentUrl = null;
            }
        }
        return new DirectChatMessage(
                conversationKey,
                message.getSenderEmail(),
                message.getSender(),
                message.getRecipientEmail(),
                message.getContent(),
                message.getAttachmentName(),
                message.getAttachmentContentType(),
                message.getAttachmentBase64(),
                attachmentUrl,
                message.getAttachmentSize(),
                message.getTimestamp()
        );
    }

    private <T> void trimChatHistory(List<T> history) {
        while (history.size() > HISTORY_LIMIT) {
            history.remove(0);
        }
    }
}

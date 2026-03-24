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
import java.util.NoSuchElementException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.UnaryOperator;

@Service
public class MessageService {

    private static final int HISTORY_LIMIT = 100;
    private static final int PIN_LIMIT = 25;
    private static final int MAX_ATTACHMENT_BYTES = 30 * 1024 * 1024;

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
            return toGroupChatMessage(saved);
        } catch (RuntimeException exception) {
            GroupChatMessage stored = toGroupChatMessage(copyMessage(message));
            storeTransientGroupMessage(groupId, stored);
            return stored;
        }
    }

    public GroupChatMessage saveGroupAttachment(
            Long groupId,
            String senderEmail,
            String senderName,
            String caption,
            String attachmentName,
            String attachmentContentType,
            byte[] attachmentBytes
    ) {
        String normalizedSender = UserIdentitySupport.normalizeEmail(senderEmail);
        String trimmedSenderName = UserIdentitySupport.trimToNull(senderName);
        String trimmedCaption = UserIdentitySupport.trimToNull(caption);
        String trimmedAttachmentName = UserIdentitySupport.trimToNull(attachmentName);
        String trimmedContentType = UserIdentitySupport.trimToNull(attachmentContentType);
        if (groupId == null || normalizedSender == null) {
            throw new IllegalArgumentException("Group and sender are required.");
        }
        if (attachmentBytes == null || attachmentBytes.length == 0) {
            throw new IllegalArgumentException("Choose a file before sending.");
        }
        if (attachmentBytes.length > MAX_ATTACHMENT_BYTES) {
            throw new IllegalArgumentException("File size must be 30MB or smaller.");
        }

        String storagePath;
        try {
            storagePath = storageService.uploadGroupAttachment(
                    groupId,
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
        message.setGroupId(groupId);
        message.setRoom("group:" + groupId);
        message.setContent(trimmedCaption != null ? trimmedCaption : "");
        message.setAttachmentName(trimmedAttachmentName != null ? trimmedAttachmentName : "attachment");
        message.setAttachmentContentType(trimmedContentType != null ? trimmedContentType : "application/octet-stream");
        message.setAttachmentStoragePath(storagePath);
        message.setAttachmentSize((long) attachmentBytes.length);
        message.setType(MessageType.GROUP);

        try {
            return toGroupChatMessage(messageRepository.save(message));
        } catch (RuntimeException exception) {
            GroupChatMessage stored = toGroupChatMessage(copyMessage(message));
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
            DirectChatMessage stored = toDirectChatMessage(canonicalKey, copyMessage(message));
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
            throw new IllegalArgumentException("File size must be 30MB or smaller.");
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
                    .map(this::toGroupChatMessage)
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

    public List<GroupChatMessage> getPinnedGroupMessages(Long groupId) {
        if (groupId == null) {
            return List.of();
        }
        try {
            return messageRepository.findByTypeAndGroupIdAndPinnedTrueOrderByPinnedAtDescTimestampDesc(
                            MessageType.GROUP,
                            groupId,
                            PageRequest.of(0, PIN_LIMIT)
                    ).stream()
                    .map(this::toGroupChatMessage)
                    .toList();
        } catch (RuntimeException exception) {
            return latestTransientPinnedGroupMessages(groupId);
        }
    }

    public List<DirectChatMessage> getPinnedDirectMessages(String currentUserEmail, String otherEmail) {
        String first = UserIdentitySupport.normalizeEmail(currentUserEmail);
        String second = UserIdentitySupport.normalizeEmail(otherEmail);
        if (first == null || second == null) {
            return List.of();
        }

        String conversationKey = buildConversationKey(first, second);
        try {
            return messageRepository.findPinnedDirectConversation(
                            MessageType.DIRECT,
                            first,
                            second,
                            PageRequest.of(0, PIN_LIMIT)
                    ).stream()
                    .map(message -> toDirectChatMessage(conversationKey, message))
                    .toList();
        } catch (RuntimeException exception) {
            return latestTransientPinnedDirectMessages(conversationKey);
        }
    }

    public GroupChatMessage recallGroupMessage(Long groupId, String requesterEmail, Long messageId) {
        String normalizedRequester = UserIdentitySupport.normalizeEmail(requesterEmail);
        if (groupId == null || normalizedRequester == null || messageId == null) {
            throw new IllegalArgumentException("Group, requester and message are required.");
        }
        try {
            Message message = messageRepository.findById(messageId)
                    .orElseThrow(() -> new NoSuchElementException("Message not found."));
            validateGroupMessage(message, groupId);
            validateRecallPermission(message, normalizedRequester);
            applyRecall(message);
            return toGroupChatMessage(messageRepository.save(message));
        } catch (NoSuchElementException | SecurityException | IllegalStateException exception) {
            throw exception;
        } catch (RuntimeException exception) {
            GroupChatMessage updated = updateTransientGroupMessage(groupId, messageId, existing -> {
                validateGroupMessage(existing, groupId);
                validateRecallPermission(existing.senderEmail(), normalizedRequester);
                return recall(existing);
            });
            if (updated != null) {
                return updated;
            }
            throw new NoSuchElementException("Message not found.");
        }
    }

    public DirectChatMessage recallDirectMessage(String requesterEmail, String otherEmail, Long messageId) {
        String normalizedRequester = UserIdentitySupport.normalizeEmail(requesterEmail);
        String normalizedOther = UserIdentitySupport.normalizeEmail(otherEmail);
        if (normalizedRequester == null || normalizedOther == null || messageId == null) {
            throw new IllegalArgumentException("Both emails and the message are required.");
        }
        String conversationKey = buildConversationKey(normalizedRequester, normalizedOther);
        try {
            Message message = messageRepository.findById(messageId)
                    .orElseThrow(() -> new NoSuchElementException("Message not found."));
            validateDirectMessage(message, conversationKey);
            validateRecallPermission(message, normalizedRequester);
            applyRecall(message);
            return toDirectChatMessage(conversationKey, messageRepository.save(message));
        } catch (NoSuchElementException | SecurityException | IllegalStateException exception) {
            throw exception;
        } catch (RuntimeException exception) {
            DirectChatMessage updated = updateTransientDirectMessage(conversationKey, messageId, existing -> {
                validateDirectMessage(existing, conversationKey);
                validateRecallPermission(existing.senderEmail(), normalizedRequester);
                return recall(existing);
            });
            if (updated != null) {
                return updated;
            }
            throw new NoSuchElementException("Message not found.");
        }
    }

    public GroupChatMessage setGroupMessagePinned(Long groupId, Long messageId, boolean pinned) {
        if (groupId == null || messageId == null) {
            throw new IllegalArgumentException("Group and message are required.");
        }
        try {
            Message message = messageRepository.findById(messageId)
                    .orElseThrow(() -> new NoSuchElementException("Message not found."));
            validateGroupMessage(message, groupId);
            applyPinnedState(message, pinned);
            return toGroupChatMessage(messageRepository.save(message));
        } catch (NoSuchElementException | IllegalStateException exception) {
            throw exception;
        } catch (RuntimeException exception) {
            GroupChatMessage updated = updateTransientGroupMessage(groupId, messageId, existing -> {
                validateGroupMessage(existing, groupId);
                return setPinned(existing, pinned);
            });
            if (updated != null) {
                return updated;
            }
            throw new NoSuchElementException("Message not found.");
        }
    }

    public DirectChatMessage setDirectMessagePinned(String requesterEmail, String otherEmail, Long messageId, boolean pinned) {
        String normalizedRequester = UserIdentitySupport.normalizeEmail(requesterEmail);
        String normalizedOther = UserIdentitySupport.normalizeEmail(otherEmail);
        if (normalizedRequester == null || normalizedOther == null || messageId == null) {
            throw new IllegalArgumentException("Both emails and the message are required.");
        }
        String conversationKey = buildConversationKey(normalizedRequester, normalizedOther);
        try {
            Message message = messageRepository.findById(messageId)
                    .orElseThrow(() -> new NoSuchElementException("Message not found."));
            validateDirectMessage(message, conversationKey);
            applyPinnedState(message, pinned);
            return toDirectChatMessage(conversationKey, messageRepository.save(message));
        } catch (NoSuchElementException | IllegalStateException exception) {
            throw exception;
        } catch (RuntimeException exception) {
            DirectChatMessage updated = updateTransientDirectMessage(conversationKey, messageId, existing -> {
                validateDirectMessage(existing, conversationKey);
                return setPinned(existing, pinned);
            });
            if (updated != null) {
                return updated;
            }
            throw new NoSuchElementException("Message not found.");
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

    private List<GroupChatMessage> latestTransientPinnedGroupMessages(Long groupId) {
        return transientGroupMessages.getOrDefault(groupId, List.of()).stream()
                .filter(GroupChatMessage::pinned)
                .sorted(Comparator.comparing(GroupChatMessage::pinnedAt, Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(GroupChatMessage::timestamp, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(PIN_LIMIT)
                .toList();
    }

    private List<DirectChatMessage> latestTransientPinnedDirectMessages(String conversationKey) {
        return transientDirectMessages.getOrDefault(conversationKey, List.of()).stream()
                .filter(DirectChatMessage::pinned)
                .sorted(Comparator.comparing(DirectChatMessage::pinnedAt, Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(DirectChatMessage::timestamp, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(PIN_LIMIT)
                .toList();
    }

    private GroupChatMessage updateTransientGroupMessage(Long groupId, Long messageId, UnaryOperator<GroupChatMessage> updater) {
        List<GroupChatMessage> history = transientGroupMessages.get(groupId);
        if (history == null || updater == null) {
            return null;
        }
        for (int index = 0; index < history.size(); index += 1) {
            GroupChatMessage current = history.get(index);
            if (current == null || !messageId.equals(current.id())) {
                continue;
            }
            GroupChatMessage updated = updater.apply(current);
            history.set(index, updated);
            return updated;
        }
        return null;
    }

    private DirectChatMessage updateTransientDirectMessage(String conversationKey, Long messageId, UnaryOperator<DirectChatMessage> updater) {
        List<DirectChatMessage> history = transientDirectMessages.get(conversationKey);
        if (history == null || updater == null) {
            return null;
        }
        for (int index = 0; index < history.size(); index += 1) {
            DirectChatMessage current = history.get(index);
            if (current == null || !messageId.equals(current.id())) {
                continue;
            }
            DirectChatMessage updated = updater.apply(current);
            history.set(index, updated);
            return updated;
        }
        return null;
    }

    private void validateGroupMessage(Message message, Long groupId) {
        if (message == null || message.getType() != MessageType.GROUP || !groupId.equals(message.getGroupId())) {
            throw new NoSuchElementException("Message not found.");
        }
    }

    private void validateGroupMessage(GroupChatMessage message, Long groupId) {
        if (message == null || !groupId.equals(message.groupId())) {
            throw new NoSuchElementException("Message not found.");
        }
    }

    private void validateDirectMessage(Message message, String conversationKey) {
        if (message == null || message.getType() != MessageType.DIRECT) {
            throw new NoSuchElementException("Message not found.");
        }
        String sender = UserIdentitySupport.normalizeEmail(message.getSenderEmail());
        String recipient = UserIdentitySupport.normalizeEmail(message.getRecipientEmail());
        if (sender == null || recipient == null || !conversationKey.equals(buildConversationKey(sender, recipient))) {
            throw new NoSuchElementException("Message not found.");
        }
    }

    private void validateDirectMessage(DirectChatMessage message, String conversationKey) {
        if (message == null || !conversationKey.equals(message.conversationKey())) {
            throw new NoSuchElementException("Message not found.");
        }
    }

    private void validateRecallPermission(Message message, String requesterEmail) {
        validateRecallPermission(message == null ? null : message.getSenderEmail(), requesterEmail);
    }

    private void validateRecallPermission(String senderEmail, String requesterEmail) {
        if (!UserIdentitySupport.normalizeEmail(requesterEmail).equals(UserIdentitySupport.normalizeEmail(senderEmail))) {
            throw new SecurityException("You can only recall your own messages.");
        }
    }

    private void applyRecall(Message message) {
        if (message == null) {
            throw new NoSuchElementException("Message not found.");
        }
        message.setRecalled(true);
        message.setRecalledAt(Instant.now());
        message.setPinned(false);
        message.setPinnedAt(null);
        message.setContent("");
        message.setAttachmentName(null);
        message.setAttachmentContentType(null);
        message.setAttachmentBase64(null);
        message.setAttachmentStoragePath(null);
        message.setAttachmentSize(null);
    }

    private GroupChatMessage recall(GroupChatMessage message) {
        return new GroupChatMessage(
                message.id(),
                message.groupId(),
                message.senderEmail(),
                message.senderName(),
                "",
                null,
                null,
                null,
                null,
                null,
                message.timestamp(),
                true,
                false,
                null
        );
    }

    private DirectChatMessage recall(DirectChatMessage message) {
        return new DirectChatMessage(
                message.id(),
                message.conversationKey(),
                message.senderEmail(),
                message.senderName(),
                message.recipientEmail(),
                "",
                null,
                null,
                null,
                null,
                null,
                message.timestamp(),
                true,
                false,
                null
        );
    }

    private void applyPinnedState(Message message, boolean pinned) {
        if (message == null) {
            throw new NoSuchElementException("Message not found.");
        }
        if (pinned && message.isRecalled()) {
            throw new IllegalStateException("Cannot pin a recalled message.");
        }
        message.setPinned(pinned);
        message.setPinnedAt(pinned ? Instant.now() : null);
    }

    private GroupChatMessage setPinned(GroupChatMessage message, boolean pinned) {
        if (pinned && message.recalled()) {
            throw new IllegalStateException("Cannot pin a recalled message.");
        }
        return new GroupChatMessage(
                message.id(),
                message.groupId(),
                message.senderEmail(),
                message.senderName(),
                message.content(),
                message.attachmentName(),
                message.attachmentContentType(),
                message.attachmentBase64(),
                message.attachmentUrl(),
                message.attachmentSize(),
                message.timestamp(),
                message.recalled(),
                pinned,
                pinned ? Instant.now() : null
        );
    }

    private DirectChatMessage setPinned(DirectChatMessage message, boolean pinned) {
        if (pinned && message.recalled()) {
            throw new IllegalStateException("Cannot pin a recalled message.");
        }
        return new DirectChatMessage(
                message.id(),
                message.conversationKey(),
                message.senderEmail(),
                message.senderName(),
                message.recipientEmail(),
                message.content(),
                message.attachmentName(),
                message.attachmentContentType(),
                message.attachmentBase64(),
                message.attachmentUrl(),
                message.attachmentSize(),
                message.timestamp(),
                message.recalled(),
                pinned,
                pinned ? Instant.now() : null
        );
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
        stored.setRecalled(source.isRecalled());
        stored.setRecalledAt(source.getRecalledAt());
        stored.setPinned(source.isPinned());
        stored.setPinnedAt(source.getPinnedAt());
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
                message.getId(),
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
                message.getTimestamp(),
                message.isRecalled(),
                message.isPinned(),
                message.getPinnedAt()
        );
    }

    private GroupChatMessage toGroupChatMessage(Message message) {
        String attachmentUrl = null;
        String attachmentStoragePath = message.getAttachmentStoragePath();
        if (attachmentStoragePath != null && !attachmentStoragePath.isBlank() && storageService.isConfigured()) {
            try {
                attachmentUrl = storageService.createSignedDownloadUrl(attachmentStoragePath);
            } catch (RuntimeException ignored) {
                attachmentUrl = null;
            }
        }
        return new GroupChatMessage(
                message.getId(),
                message.getGroupId(),
                message.getSenderEmail(),
                message.getSender(),
                message.getContent(),
                message.getAttachmentName(),
                message.getAttachmentContentType(),
                message.getAttachmentBase64(),
                attachmentUrl,
                message.getAttachmentSize(),
                message.getTimestamp(),
                message.isRecalled(),
                message.isPinned(),
                message.getPinnedAt()
        );
    }

    private <T> void trimChatHistory(List<T> history) {
        while (history.size() > HISTORY_LIMIT) {
            history.remove(0);
        }
    }
}

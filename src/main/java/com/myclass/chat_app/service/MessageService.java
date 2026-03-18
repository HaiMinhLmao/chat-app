package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.DirectChatMessage;
import com.myclass.chat_app.dto.GroupChatMessage;
import com.myclass.chat_app.entity.Message;
import com.myclass.chat_app.entity.MessageType;
import com.myclass.chat_app.repository.MessageRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Message saveLobbyMessage(Message incoming) {
        if (incoming == null) {
            return null;
        }
        Message message = new Message();
        message.setSender(trimToNull(incoming.getSender()));
        message.setSenderEmail(normalizeEmail(incoming.getSenderEmail()));
        message.setContent(trimToNull(incoming.getContent()));
        message.setRoom(trimToNull(incoming.getRoom()) != null ? incoming.getRoom().trim() : "lobby");
        message.setType(MessageType.LOBBY);
        if (message.getSender() == null || message.getContent() == null) {
            return null;
        }
        return messageRepository.save(message);
    }

    public GroupChatMessage saveGroupMessage(Long groupId, GroupChatMessage incoming) {
        if (groupId == null || incoming == null) {
            return null;
        }
        String senderEmail = normalizeEmail(incoming.senderEmail());
        String senderName = trimToNull(incoming.senderName());
        String content = trimToNull(incoming.content());
        if (senderEmail == null || content == null) {
            return null;
        }

        Message message = new Message();
        message.setSender(senderName != null ? senderName : defaultDisplayName(senderEmail));
        message.setSenderEmail(senderEmail);
        message.setGroupId(groupId);
        message.setRoom("group:" + groupId);
        message.setContent(content);
        message.setType(MessageType.GROUP);

        Message saved = messageRepository.save(message);
        return new GroupChatMessage(
                groupId,
                senderEmail,
                saved.getSender(),
                saved.getContent(),
                saved.getTimestamp()
        );
    }

    public DirectChatMessage saveDirectMessage(String conversationKey, DirectChatMessage incoming) {
        if (conversationKey == null || incoming == null) {
            return null;
        }
        String senderEmail = normalizeEmail(incoming.senderEmail());
        String recipientEmail = normalizeEmail(incoming.recipientEmail());
        String content = trimToNull(incoming.content());
        if (senderEmail == null || recipientEmail == null || content == null) {
            return null;
        }

        String canonicalKey = buildConversationKey(senderEmail, recipientEmail);
        if (!canonicalKey.equals(conversationKey)) {
            return null;
        }

        Message message = new Message();
        message.setSender(trimToNull(incoming.senderName()) != null ? incoming.senderName().trim() : defaultDisplayName(senderEmail));
        message.setSenderEmail(senderEmail);
        message.setRecipientEmail(recipientEmail);
        message.setRoom("direct:" + canonicalKey);
        message.setContent(content);
        message.setType(MessageType.DIRECT);

        Message saved = messageRepository.save(message);
        return new DirectChatMessage(
                canonicalKey,
                senderEmail,
                saved.getSender(),
                recipientEmail,
                saved.getContent(),
                saved.getTimestamp()
        );
    }

    public List<Message> getLobbyMessages() {
        return reverseChronological(messageRepository.findTop100ByTypeAndRoomOrderByTimestampDesc(MessageType.LOBBY, "lobby"));
    }

    public List<GroupChatMessage> getGroupMessages(Long groupId) {
        return reverseChronological(messageRepository.findTop100ByTypeAndGroupIdOrderByTimestampDesc(MessageType.GROUP, groupId)).stream()
                .map(message -> new GroupChatMessage(
                        message.getGroupId(),
                        message.getSenderEmail(),
                        message.getSender(),
                        message.getContent(),
                        message.getTimestamp()
                ))
                .toList();
    }

    public List<DirectChatMessage> getDirectMessages(String currentUserEmail, String otherEmail) {
        String first = normalizeEmail(currentUserEmail);
        String second = normalizeEmail(otherEmail);
        if (first == null || second == null) {
            return List.of();
        }

        String conversationKey = buildConversationKey(first, second);
        return reverseChronological(
                messageRepository.findDirectConversation(
                        MessageType.DIRECT,
                        first,
                        second,
                        PageRequest.of(0, 100)
                )
        ).stream()
                .map(message -> new DirectChatMessage(
                        conversationKey,
                        message.getSenderEmail(),
                        message.getSender(),
                        message.getRecipientEmail(),
                        message.getContent(),
                        message.getTimestamp()
                ))
                .toList();
    }

    public String buildConversationKey(String firstEmail, String secondEmail) {
        String first = normalizeEmail(firstEmail);
        String second = normalizeEmail(secondEmail);
        if (first == null || second == null) {
            throw new IllegalArgumentException("Both emails are required");
        }
        String pair = List.of(first, second).stream()
                .sorted(Comparator.naturalOrder())
                .reduce((left, right) -> left + "::" + right)
                .orElseThrow();
        return Base64.getUrlEncoder().withoutPadding().encodeToString(pair.getBytes(StandardCharsets.UTF_8));
    }

    private static String normalizeEmail(String email) {
        if (email == null) {
            return null;
        }
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        return normalized.isBlank() ? null : normalized;
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static String defaultDisplayName(String email) {
        int index = email.indexOf('@');
        return index > 0 ? email.substring(0, index) : email;
    }

    private List<Message> reverseChronological(List<Message> messages) {
        List<Message> ordered = new ArrayList<>(messages);
        java.util.Collections.reverse(ordered);
        return ordered;
    }
}

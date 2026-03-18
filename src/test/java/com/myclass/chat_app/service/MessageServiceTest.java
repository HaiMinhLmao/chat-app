package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.DirectChatMessage;
import com.myclass.chat_app.dto.GroupChatMessage;
import com.myclass.chat_app.entity.Message;
import com.myclass.chat_app.entity.MessageType;
import com.myclass.chat_app.repository.MessageRepository;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class MessageServiceTest {

    @Test
    void getLobbyMessagesReturnsChronologicalHistory() {
        MessageRepository repository = mock(MessageRepository.class);
        Message newest = message("new", "alice@example.com", "Alice", Instant.parse("2026-03-19T10:05:00Z"));
        Message oldest = message("old", "bob@example.com", "Bob", Instant.parse("2026-03-19T10:00:00Z"));
        when(repository.findTop100ByTypeAndRoomOrderByTimestampDesc(MessageType.LOBBY, "lobby"))
                .thenReturn(List.of(newest, oldest));

        MessageService service = new MessageService(repository);

        List<Message> history = service.getLobbyMessages();

        assertThat(history)
                .extracting(Message::getContent)
                .containsExactly("old", "new");
    }

    @Test
    void getDirectMessagesUsesLatestHundredAndReturnsChronologicalHistory() {
        MessageRepository repository = mock(MessageRepository.class);
        Message newest = message("later", "alice@example.com", "Alice", Instant.parse("2026-03-19T10:05:00Z"));
        newest.setRecipientEmail("bob@example.com");
        newest.setType(MessageType.DIRECT);
        Message oldest = message("earlier", "bob@example.com", "Bob", Instant.parse("2026-03-19T10:00:00Z"));
        oldest.setRecipientEmail("alice@example.com");
        oldest.setType(MessageType.DIRECT);

        when(repository.findDirectConversation(eq(MessageType.DIRECT), eq("alice@example.com"), eq("bob@example.com"), any(Pageable.class)))
                .thenReturn(List.of(newest, oldest));

        MessageService service = new MessageService(repository);

        List<DirectChatMessage> history = service.getDirectMessages("alice@example.com", "bob@example.com");

        assertThat(history)
                .extracting(DirectChatMessage::content)
                .containsExactly("earlier", "later");
        verify(repository).findDirectConversation(eq(MessageType.DIRECT), eq("alice@example.com"), eq("bob@example.com"), any(Pageable.class));
    }

    @Test
    void saveGroupMessageFallsBackToEmailPrefixWhenNameMissing() {
        MessageRepository repository = mock(MessageRepository.class);
        when(repository.save(any(Message.class))).thenAnswer(invocation -> {
            Message saved = invocation.getArgument(0);
            saved.setId(1L);
            saved.setTimestamp(Instant.parse("2026-03-19T10:00:00Z"));
            return saved;
        });

        MessageService service = new MessageService(repository);

        GroupChatMessage saved = service.saveGroupMessage(
                12L,
                new GroupChatMessage(12L, "alice@example.com", " ", "hello group", null)
        );

        assertThat(saved.senderName()).isEqualTo("alice");
        assertThat(saved.content()).isEqualTo("hello group");
    }

    private static Message message(String content, String senderEmail, String sender, Instant timestamp) {
        Message message = new Message();
        message.setContent(content);
        message.setSenderEmail(senderEmail);
        message.setSender(sender);
        message.setTimestamp(timestamp);
        message.setType(MessageType.LOBBY);
        message.setRoom("lobby");
        return message;
    }
}

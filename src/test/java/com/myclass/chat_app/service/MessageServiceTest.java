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
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class MessageServiceTest {

    @Test
    void getLobbyMessagesReturnsChronologicalHistory() {
        MessageRepository repository = mock(MessageRepository.class);
        SupabaseStorageService storageService = storageService(false);
        Message newest = message("new", "alice@example.com", "Alice", Instant.parse("2026-03-19T10:05:00Z"));
        Message oldest = message("old", "bob@example.com", "Bob", Instant.parse("2026-03-19T10:00:00Z"));
        when(repository.findTop100ByTypeAndRoomOrderByTimestampDesc(MessageType.LOBBY, "lobby"))
                .thenReturn(List.of(newest, oldest));

        MessageService service = new MessageService(repository, storageService);

        List<Message> history = service.getLobbyMessages();

        assertThat(history)
                .extracting(Message::getContent)
                .containsExactly("old", "new");
    }

    @Test
    void getDirectMessagesUsesLatestHundredAndReturnsChronologicalHistory() {
        MessageRepository repository = mock(MessageRepository.class);
        SupabaseStorageService storageService = storageService(false);
        Message newest = message("later", "alice@example.com", "Alice", Instant.parse("2026-03-19T10:05:00Z"));
        newest.setRecipientEmail("bob@example.com");
        newest.setType(MessageType.DIRECT);
        Message oldest = message("earlier", "bob@example.com", "Bob", Instant.parse("2026-03-19T10:00:00Z"));
        oldest.setRecipientEmail("alice@example.com");
        oldest.setType(MessageType.DIRECT);

        when(repository.findDirectConversation(eq(MessageType.DIRECT), eq("alice@example.com"), eq("bob@example.com"), any(Pageable.class)))
                .thenReturn(List.of(newest, oldest));

        MessageService service = new MessageService(repository, storageService);

        List<DirectChatMessage> history = service.getDirectMessages("alice@example.com", "bob@example.com");

        assertThat(history)
                .extracting(DirectChatMessage::content)
                .containsExactly("earlier", "later");
        verify(repository).findDirectConversation(eq(MessageType.DIRECT), eq("alice@example.com"), eq("bob@example.com"), any(Pageable.class));
    }

    @Test
    void saveGroupMessageFallsBackToEmailPrefixWhenNameMissing() {
        MessageRepository repository = mock(MessageRepository.class);
        SupabaseStorageService storageService = storageService(false);
        when(repository.save(any(Message.class))).thenAnswer(invocation -> {
            Message saved = invocation.getArgument(0, Message.class);
            saved.setId(1L);
            saved.setTimestamp(Instant.parse("2026-03-19T10:00:00Z"));
            return saved;
        });

        MessageService service = new MessageService(repository, storageService);

        GroupChatMessage saved = service.saveGroupMessage(
                12L,
                new GroupChatMessage(
                        null,
                        12L,
                        "alice@example.com",
                        " ",
                        "hello group",
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        false,
                        false,
                        null
                )
        );

        assertThat(saved.senderName()).isEqualTo("alice");
        assertThat(saved.content()).isEqualTo("hello group");
    }

    @Test
    void getDirectMessagesKeepsHistoryWhenSignedUrlGenerationFails() {
        MessageRepository repository = mock(MessageRepository.class);
        SupabaseStorageService storageService = storageService(true);
        Message stored = message("Watch this", "alice@example.com", "Alice", Instant.parse("2026-03-21T08:30:00Z"));
        stored.setRecipientEmail("bob@example.com");
        stored.setType(MessageType.DIRECT);
        stored.setAttachmentName("clip.mp4");
        stored.setAttachmentContentType("video/mp4");
        stored.setAttachmentStoragePath("direct/chat/clip.mp4");
        stored.setAttachmentSize(11L);
        when(repository.findDirectConversation(eq(MessageType.DIRECT), eq("alice@example.com"), eq("bob@example.com"), any(Pageable.class)))
                .thenReturn(List.of(stored));
        when(storageService.createSignedDownloadUrl("direct/chat/clip.mp4"))
                .thenThrow(new RuntimeException("boom"));

        MessageService service = new MessageService(repository, storageService);

        List<DirectChatMessage> history = service.getDirectMessages("alice@example.com", "bob@example.com");

        assertThat(history).hasSize(1);
        assertThat(history.get(0).attachmentUrl()).isNull();
        assertThat(history.get(0).attachmentName()).isEqualTo("clip.mp4");
    }

    @Test
    void saveDirectAttachmentStoresSupabasePathAndSignedUrlForReloadedHistory() {
        MessageRepository repository = mock(MessageRepository.class);
        SupabaseStorageService storageService = storageService(true);
        when(repository.save(any(Message.class))).thenAnswer(invocation -> {
            Message saved = invocation.getArgument(0, Message.class);
            saved.setId(7L);
            saved.setTimestamp(Instant.parse("2026-03-21T08:30:00Z"));
            return saved;
        });
        when(storageService.uploadDirectAttachment(
                eq("YWxpY2VAZXhhbXBsZS5jb206OmJvYkBleGFtcGxlLmNvbQ"),
                eq("clip.mp4"),
                any(byte[].class),
                eq("video/mp4")
        )).thenReturn("direct/YWxpY2VAZXhhbXBsZS5jb206OmJvYkBleGFtcGxlLmNvbQ/clip.mp4");
        when(storageService.createSignedDownloadUrl("direct/YWxpY2VAZXhhbXBsZS5jb206OmJvYkBleGFtcGxlLmNvbQ/clip.mp4"))
                .thenReturn("https://signed.example/clip.mp4");

        MessageService service = new MessageService(repository, storageService);

        DirectChatMessage saved = service.saveDirectAttachment(
                "alice@example.com",
                "Alice",
                "bob@example.com",
                "Watch this",
                "clip.mp4",
                "video/mp4",
                "video-bytes".getBytes()
        );

        assertThat(saved.senderEmail()).isEqualTo("alice@example.com");
        assertThat(saved.recipientEmail()).isEqualTo("bob@example.com");
        assertThat(saved.content()).isEqualTo("Watch this");
        assertThat(saved.attachmentName()).isEqualTo("clip.mp4");
        assertThat(saved.attachmentContentType()).isEqualTo("video/mp4");
        assertThat(saved.attachmentBase64()).isNull();
        assertThat(saved.attachmentUrl()).isEqualTo("https://signed.example/clip.mp4");
        assertThat(saved.attachmentSize()).isEqualTo(11L);
    }

    @Test
    void getDirectMessagesDoesNotRequestSignedUrlWhenStorageIsDisabled() {
        MessageRepository repository = mock(MessageRepository.class);
        SupabaseStorageService storageService = storageService(false);
        Message stored = message("legacy attachment", "alice@example.com", "Alice", Instant.parse("2026-03-21T08:30:00Z"));
        stored.setRecipientEmail("bob@example.com");
        stored.setType(MessageType.DIRECT);
        stored.setAttachmentName("clip.mp4");
        stored.setAttachmentContentType("video/mp4");
        stored.setAttachmentStoragePath("direct/chat/clip.mp4");
        when(repository.findDirectConversation(eq(MessageType.DIRECT), eq("alice@example.com"), eq("bob@example.com"), any(Pageable.class)))
                .thenReturn(List.of(stored));

        MessageService service = new MessageService(repository, storageService);

        List<DirectChatMessage> history = service.getDirectMessages("alice@example.com", "bob@example.com");

        assertThat(history).hasSize(1);
        assertThat(history.get(0).attachmentUrl()).isNull();
        verify(storageService, never()).createSignedDownloadUrl(any(String.class));
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

    private static SupabaseStorageService storageService(boolean configured) {
        SupabaseStorageService storageService = mock(SupabaseStorageService.class);
        when(storageService.isConfigured()).thenReturn(configured);
        return storageService;
    }
}

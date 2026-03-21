package com.myclass.chat_app.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
import java.util.List;

@Configuration
public class DatabaseSchemaInitializer {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSchemaInitializer.class);

    @Bean
    public ApplicationRunner collaborationSchemaRunner(DataSource dataSource) {
        return args -> {
            List<String> statements = List.of(
                    """
                            create table if not exists users (
                                id bigserial primary key,
                                email varchar(320) not null unique,
                                full_name varchar(200),
                                created_at timestamptz not null default now()
                            )
                            """,
                    """
                            create table if not exists chat_groups (
                                id bigserial primary key,
                                name varchar(200) not null,
                                description text,
                                category varchar(50),
                                created_by_user_id bigint not null references users(id) on delete cascade,
                                created_at timestamptz not null default now()
                            )
                            """,
                    """
                            create table if not exists group_members (
                                id bigserial primary key,
                                group_id bigint not null references chat_groups(id) on delete cascade,
                                user_id bigint not null references users(id) on delete cascade,
                                role varchar(20) not null,
                                constraint uq_group_members_group_user unique (group_id, user_id)
                            )
                            """,
                    """
                            create table if not exists friend_requests (
                                id bigserial primary key,
                                requester_user_id bigint not null references users(id) on delete cascade,
                                recipient_user_id bigint not null references users(id) on delete cascade,
                                status varchar(20) not null default 'PENDING',
                                created_at timestamptz not null default now(),
                                responded_at timestamptz
                            )
                            """,
                    """
                            create table if not exists group_invitations (
                                id bigserial primary key,
                                group_id bigint not null references chat_groups(id) on delete cascade,
                                invited_by_user_id bigint not null references users(id) on delete cascade,
                                invited_user_id bigint not null references users(id) on delete cascade,
                                status varchar(20) not null default 'PENDING',
                                created_at timestamptz not null default now(),
                                responded_at timestamptz
                            )
                            """,
                    """
                            create table if not exists messages (
                                id bigserial primary key,
                                sender varchar(200) not null,
                                sender_email varchar(320),
                                recipient_email varchar(320),
                                group_id bigint,
                                content text not null,
                                attachment_name varchar(255),
                                attachment_content_type varchar(120),
                                attachment_base64 text,
                                attachment_storage_path varchar(1024),
                                attachment_size bigint,
                                timestamp timestamptz not null default now(),
                                room varchar(512),
                                type varchar(20) not null default 'LOBBY'
                            )
                            """,
                    """
                            create table if not exists local_credentials (
                                id bigserial primary key,
                                user_id bigint not null unique references users(id) on delete cascade,
                                password_hash varchar(200) not null,
                                created_at timestamptz not null default now()
                            )
                            """,
                    "alter table messages add column if not exists sender_email varchar(320)",
                    "alter table messages add column if not exists recipient_email varchar(320)",
                    "alter table messages add column if not exists group_id bigint",
                    "alter table messages add column if not exists attachment_name varchar(255)",
                    "alter table messages add column if not exists attachment_content_type varchar(120)",
                    "alter table messages add column if not exists attachment_base64 text",
                    "alter table messages add column if not exists attachment_storage_path varchar(1024)",
                    "alter table messages add column if not exists attachment_size bigint",
                    "alter table messages add column if not exists room varchar(512)",
                    "alter table messages add column if not exists type varchar(20) not null default 'LOBBY'",
                    "alter table messages alter column room type varchar(512)",
                    "create index if not exists idx_chat_groups_created_by on chat_groups(created_by_user_id)",
                    "create index if not exists idx_friend_requests_recipient_status on friend_requests(recipient_user_id, status, created_at)",
                    "create index if not exists idx_friend_requests_requester_status on friend_requests(requester_user_id, status, created_at)",
                    "create index if not exists idx_group_invitations_group_id on group_invitations(group_id)",
                    "create index if not exists idx_group_invitations_user_status on group_invitations(invited_user_id, status, created_at)",
                    "create index if not exists idx_group_members_group_id on group_members(group_id)",
                    "create index if not exists idx_group_members_user_id on group_members(user_id)",
                    "create index if not exists idx_messages_type_room_time on messages(type, room, timestamp)",
                    "create index if not exists idx_messages_type_group_time on messages(type, group_id, timestamp)",
                    "create index if not exists idx_messages_sender_recipient_time on messages(sender_email, recipient_email, timestamp)",
                    """
                            create unique index if not exists uq_friend_requests_pending_pair
                            on friend_requests (
                                least(requester_user_id, recipient_user_id),
                                greatest(requester_user_id, recipient_user_id)
                            )
                            where status = 'PENDING'
                            """,
                    """
                            create unique index if not exists uq_group_invitations_pending_group_user
                            on group_invitations (group_id, invited_user_id)
                            where status = 'PENDING'
                            """
            );

            try (Connection connection = dataSource.getConnection();
                 Statement statement = connection.createStatement()) {
                for (String sql : statements) {
                    try {
                        statement.execute(sql);
                    } catch (Exception statementException) {
                        log.warn(
                                "Skipping schema statement because it failed: {} | sql={}",
                                statementException.getMessage(),
                                previewSql(sql)
                        );
                    }
                }
            } catch (Exception exception) {
                log.warn(
                        "Skipping database schema initialization because the datasource is unavailable: {}",
                        exception.getMessage()
                );
            }
        };
    }

    private String previewSql(String sql) {
        String normalized = sql.replaceAll("\\s+", " ").trim();
        return normalized.length() > 140 ? normalized.substring(0, 140) + "..." : normalized;
    }
}

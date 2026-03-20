-- MyClassRoom chat-app schema
-- Paste this file into the Supabase SQL Editor and run it once.

begin;

create table if not exists users (
    id bigserial primary key,
    email varchar(320) not null unique,
    full_name varchar(200),
    created_at timestamptz not null default now()
);

create table if not exists chat_groups (
    id bigserial primary key,
    name varchar(200) not null,
    description text,
    category varchar(50),
    created_by_user_id bigint not null references users(id) on delete cascade,
    created_at timestamptz not null default now()
);

create table if not exists group_members (
    id bigserial primary key,
    group_id bigint not null references chat_groups(id) on delete cascade,
    user_id bigint not null references users(id) on delete cascade,
    role varchar(20) not null,
    constraint uq_group_members_group_user unique (group_id, user_id),
    constraint chk_group_members_role check (role in ('ADMIN', 'MEMBER'))
);

create table if not exists friend_requests (
    id bigserial primary key,
    requester_user_id bigint not null references users(id) on delete cascade,
    recipient_user_id bigint not null references users(id) on delete cascade,
    status varchar(20) not null default 'PENDING',
    created_at timestamptz not null default now(),
    responded_at timestamptz,
    constraint chk_friend_requests_status check (status in ('PENDING', 'ACCEPTED', 'DECLINED'))
);

create table if not exists group_invitations (
    id bigserial primary key,
    group_id bigint not null references chat_groups(id) on delete cascade,
    invited_by_user_id bigint not null references users(id) on delete cascade,
    invited_user_id bigint not null references users(id) on delete cascade,
    status varchar(20) not null default 'PENDING',
    created_at timestamptz not null default now(),
    responded_at timestamptz,
    constraint chk_group_invitations_status check (status in ('PENDING', 'ACCEPTED', 'DECLINED'))
);

create table if not exists messages (
    id bigserial primary key,
    sender varchar(200) not null,
    sender_email varchar(320),
    recipient_email varchar(320),
    group_id bigint,
    content text not null,
    "timestamp" timestamptz not null default now(),
    room varchar(512),
    type varchar(20) not null default 'LOBBY',
    constraint chk_messages_type check (type in ('LOBBY', 'DIRECT', 'GROUP', 'SYSTEM'))
);

alter table messages add column if not exists sender_email varchar(320);
alter table messages add column if not exists recipient_email varchar(320);
alter table messages add column if not exists group_id bigint;
alter table messages add column if not exists room varchar(512);
alter table messages add column if not exists type varchar(20) not null default 'LOBBY';
alter table messages alter column room type varchar(512);

create index if not exists idx_chat_groups_created_by on chat_groups(created_by_user_id);
create index if not exists idx_group_members_user_id on group_members(user_id);
create index if not exists idx_friend_requests_recipient_status on friend_requests(recipient_user_id, status, created_at);
create index if not exists idx_friend_requests_requester_status on friend_requests(requester_user_id, status, created_at);
create index if not exists idx_group_invitations_user_status on group_invitations(invited_user_id, status, created_at);
create index if not exists idx_group_invitations_group_id on group_invitations(group_id);
create index if not exists idx_messages_type_room_time on messages(type, room, "timestamp");
create index if not exists idx_messages_type_group_time on messages(type, group_id, "timestamp");
create index if not exists idx_messages_sender_recipient_time on messages(sender_email, recipient_email, "timestamp");

commit;

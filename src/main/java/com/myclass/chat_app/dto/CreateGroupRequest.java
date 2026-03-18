package com.myclass.chat_app.dto;

import java.util.List;

public record CreateGroupRequest(
        String groupName,
        String description,
        String category,
        List<String> members
) {
}


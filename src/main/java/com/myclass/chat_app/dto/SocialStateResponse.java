package com.myclass.chat_app.dto;

import java.util.List;

public record SocialStateResponse(
        List<UserResponse> friends,
        List<FriendRequestResponse> incomingFriendRequests,
        List<FriendRequestResponse> outgoingFriendRequests,
        List<GroupInvitationResponse> groupInvitations
) {
}

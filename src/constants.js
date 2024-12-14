const DEFAULT_USERPROFILE_IMAGE = "https://res.cloudinary.com/domlldpib/image/upload/v1727176756/chat-app-m/ggaqjqfhcnmz6nhnexrm.png";
const DEFAULT_GROUPPROFILE_IMAGE = "https://res.cloudinary.com/domlldpib/image/upload/v1727176778/chat-app-m/ploxjqwlnefsbwyptzou.jpg";

const ChatEventEnum = {
    ACTIVE_FLAG: 'send-active-flag',
    INACTIVE_FLAG: 'send-inactive-flag',
    TYPING_FLAG: 'send-typing-flag',
    STOP_TYPING_FLAG: 'send-typing-stop-flag',
    JOIN_ROOM: 'join_room',
    SEND_MESSAGE: 'send_message',
    RECEIVE_MESSAGE: 'receive_message',
};

module.exports = {
    DEFAULT_USERPROFILE_IMAGE,
    DEFAULT_GROUPPROFILE_IMAGE,
    ChatEventEnum
}
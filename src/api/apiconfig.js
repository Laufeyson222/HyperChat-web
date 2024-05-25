
const SERVER_IP = 'app.vietkieumytho.xyz'; //192.168.2.40

const SERVER_PORT = '5000';
const SOCKET_PORT = '3000';
const API_BASE_URL = `http://localhost:${SERVER_PORT}/api/`;

//const SOCKET_URL = `http://localhost:${SOCKET_PORT}`;
// const SOCKET_URL = `http://3.107.1.0:3000`;
const SOCKET_URL = `http://${SERVER_IP}:3000`;
const API_CONFIG = {
  baseURL: API_BASE_URL,
  socket: SOCKET_URL,
  endpoints: {

    allUsers: 'user',
    login: 'user/login',
    getUser: 'user/id', 
    info: 'user/phone',
    register: 'user/register/send-otp',
    verify: 'user/register/verifyOTP',
    update: 'user/update',
    listchats: 'user/getListChats/',
    sendOTPForgotPwd: 'user/sendOTPForgotPassword',
    verifyOTP:'user/register/verifyOTP',
    verifyOTPForgotPwd: 'user/verifyOTPForgotPassword',
    changePassword: 'user/changePassword',
    getRequests: 'friends/getAllSendFriendRequest',
    deleteMessage: 'message/deleteMessage',
    getListFriends:'user/listFriends',
    outchatgroup:'chat/outChatGroup',
    deleteChatGroup:'chat/deleteChatGroup/',
    sendMessagetoServer:'message/sendMessage',
    getAllMessagesByChatId:'message/getAllMessagesByChatId/',
    retrieveMessages:'message/retrieveMessages',
    getAllChatGroupByUserId:'chat/getAllChatGroupByUserId/',
    addMembersToChatGroup:'chat/addMembersToChatGroup/',
    addAdminToChatGroup:'chat/addAdminToChatGroup/',
    deleteMembersChatGroup:'chat/deleteMembersChatGroup/',
    sendFriendRequest:'friends/sendFriendRequest',
    createChatGroup:'chat/createChatGroup',
    update:'user/update/',
    acceptFriendRequest:'friends/acceptFriendRequest',
    deleteFriendRequest:'friends/deleteFriendRequest',
    createChatPrivate:'chat/createChatPrivate',
    changePassword:'user/changePassword',
    notificationMessage: 'message/notificationMessage',
    forwardMessage:'message/forwadMessages',
    unFriend:'friends/unFriend'
  },
};

export default API_CONFIG;

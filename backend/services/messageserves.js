// Example if you use MongoDB
const Message = require('../modals/Message');

const saveMessage = async ({ user, room, message }) => {
  const newMsg = new Message({ user, room, message });
  await newMsg.save();
};

module.exports = { saveMessage };

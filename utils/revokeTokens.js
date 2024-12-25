const User = require('../models/User');  // Assuming you have a User model

const revokeAllTokens = async () => {
  try {
    // Update all users, setting revoked to true for all tokens
    await User.updateMany({}, { $set: { 'tokens.$[].revoked': true } });
    console.log("All tokens have been revoked successfully.");
  } catch (error) {
    console.error("Error revoking tokens:", error);
  }
};

module.exports = { revokeAllTokens };

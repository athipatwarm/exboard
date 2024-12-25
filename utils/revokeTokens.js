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

const revokeUserTokens = async (userId) => {
    try {
      // Clear all tokens for the given user (force logout from all devices)
      await User.updateOne({ _id: userId }, { $set: { tokens: [] } });
    } catch (error) {
      console.error('Error revoking user tokens:', error);
    }
  };
  

module.exports = { revokeAllTokens };

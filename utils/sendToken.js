
const sendToken = (user, statusCode, res) => {
    try {
        const token = user.getJWTToken();  // Ensure getJWTToken() is defined in the User model

        res.status(statusCode).json({
            success: true,
            message: "OTP verified successfully",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.log("❌ Error in sendToken:", error);
        res.status(500).json({ success: false, message: "Token generation failed" });
    }
};

module.exports = sendToken;

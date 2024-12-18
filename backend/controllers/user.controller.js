import User from '../models/user.model.js';

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        return res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

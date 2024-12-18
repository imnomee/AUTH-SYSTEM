import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: { type: String, required: true, unique: true },
        password: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return value.length >= 8; // Custom validation for password length
                },
                message: 'Password must be at least 8 characters long.', // Custom error message
            },
        },
        otp: { type: String, default: '' },
        otpExpiry: { type: Number, default: 0 },
        isVerified: { type: Boolean, default: false },
        resetOTP: { type: String, default: '' },
        resetExpiry: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default User = mongoose.model('User', userSchema);

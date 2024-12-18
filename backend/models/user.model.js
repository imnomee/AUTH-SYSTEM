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
                // Custom validation for password length
                validator: function (value) {
                    return value.length >= 8;
                },
                // Custom error message
                message: 'Password must be at least 8 characters long.',
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

export default mongoose.model('User', userSchema);

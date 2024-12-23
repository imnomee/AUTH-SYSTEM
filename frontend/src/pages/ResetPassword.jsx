import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ResetPassword = () => {
    const { backendUrl } = useContext(AppContext);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [isEmailSent, setIsEmailSent] = useState('');
    const [otp, setOtp] = useState(0);
    const [isOtpSubmitted, setIsOtpSubmitted] = useState('');

    axios.defaults.withCredentials = true;

    const inputHandler = (e, i) => {
        if (e.target.value.length > 0 && i < inputRefs.current.length - 1) {
            inputRefs.current[i + 1].focus();
        }
    };

    const handleKeyDown = (e, i) => {
        if (e.key === 'Backspace' && e.target.value === '' && i > 0) {
            inputRefs.current[i - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text').match(/\d+/g).join('');
        const pasteArray = paste.split('');
        pasteArray.forEach((char, i) => {
            if (inputRefs.current[i]) {
                inputRefs.current[i].value = char;
            }
        });
    };

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                backendUrl + '/api/auth/reset-otp',
                { email }
            );
            data.success
                ? toast.success(data.message)
                : toast.error(data.message);

            data.success && setIsEmailSent(true);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const onOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            const otpArray = inputRefs.current.map((e) => e.value);
            setOtp(otpArray.join(''));
            setIsOtpSubmitted(true);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const onSubmitNewPassword = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post(
                backendUrl + '/api/auth/reset-pass',
                { email, newPassword, otp }
            );

            data.success
                ? toast.success(data.message)
                : toast.error(data.message);
            data.success && navigate('/login');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 bg-purple-100">
            <img
                onClick={() => navigate('/')}
                src={assets.logo}
                alt=""
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
            />

            {!isEmailSent && (
                <form
                    onSubmit={onSubmitEmail}
                    className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                    <h1 className="text-white text-2xl font-semibold text-center mb-4">
                        Reset Password
                    </h1>
                    <p className="text-center mb-6 text-indigo-300">
                        Enter your registered Email Id.
                    </p>
                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
                        <input
                            type="email"
                            className="w-full bg-transparent outline-none text-white"
                            placeholder="Email id"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
                        Submit
                    </button>
                </form>
            )}

            {!isOtpSubmitted && isEmailSent && (
                <form
                    onSubmit={onOtpSubmit}
                    className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                    <h1 className="text-white text-2xl font-semibold text-center mb-4">
                        Reset Password OTP
                    </h1>
                    <p className="text-center mb-6 text-indigo-300">
                        Enter the 6-digit code sent to your email.
                    </p>
                    <div
                        className="flex justify-between mb-8"
                        onPaste={(e) => handlePaste(e)}>
                        {Array(6)
                            .fill(0)
                            .map((_, i) => {
                                return (
                                    <input
                                        type="text"
                                        maxLength="1"
                                        key={i}
                                        required
                                        className="w-12 h-12 bg-[#333a5c] text-white text-center text-xl rounded"
                                        ref={(e) => (inputRefs.current[i] = e)}
                                        onInput={(e) => inputHandler(e, i)}
                                        onKeyDown={(e) => handleKeyDown(e, i)}
                                    />
                                );
                            })}
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
                        Submit
                    </button>
                </form>
            )}

            {isOtpSubmitted && isEmailSent && (
                <form
                    onSubmit={onSubmitNewPassword}
                    className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                    <h1 className="text-white text-2xl font-semibold text-center mb-4">
                        New Password
                    </h1>
                    <p className="text-center mb-6 text-indigo-300">
                        Enter the new password
                    </p>
                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
                        <input
                            type="password"
                            className="w-full bg-transparent outline-none text-white"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
};

export default ResetPassword;

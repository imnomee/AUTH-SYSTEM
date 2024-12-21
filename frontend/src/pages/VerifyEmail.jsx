import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useRef } from 'react';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const inputRefs = useRef([]);

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

    return (
        <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 bg-purple-100">
            <img
                onClick={() => navigate('/')}
                src={assets.logo}
                alt=""
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
            />
            <form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                <h1 className="text-white text-2xl font-semibold text-center mb-4">
                    Email Verify OTP
                </h1>
                <p className="text-center mb-6 text-indigo-300">
                    Enter the 6-digit code sent to your email.
                </p>
                <div className="flex justify-between mb-8">
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
                    Verify Email
                </button>
            </form>
        </div>
    );
};

export default VerifyEmail;

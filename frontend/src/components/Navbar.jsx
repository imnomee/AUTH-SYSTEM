import { useContext, useEffect } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const { userData, backendUrl, setUserData, setIsLoggedIn } =
        useContext(AppContext);

    const logoutHandler = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + '/api/auth/logout');
            if (data.success) {
                setIsLoggedIn(false);
                setUserData(false);
                navigate('/');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const verifyAccountHandler = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(
                backendUrl + '/api/auth/send-otp'
            );
            if (data.success) {
                navigate('/email-verify');
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
            <img src={assets.logo} alt="logo" className="w-48 sm:w-32" />
            {userData ? (
                <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group ">
                    {userData.name[0].toUpperCase()}

                    <div className=" absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
                        <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                            {!userData.isVerified && (
                                <li
                                    onClick={verifyAccountHandler}
                                    className="py-1 px-2 hover:bg-gray-200  cursor-pointer">
                                    Verify Email
                                </li>
                            )}
                            <li
                                onClick={logoutHandler}
                                className="py-1 px-2 hover:bg-gray-200  cursor-pointer pr-10">
                                Logout
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all">
                    Login
                </button>
            )}
        </div>
    );
};

export default Navbar;
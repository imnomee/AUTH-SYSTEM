import { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Header = () => {
    const { userData } = useContext(AppContext);
    return (
        <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
            <img
                src={assets.header}
                alt="header img"
                className="w-36 h-36 rounded-full mb-6"
            />
            <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
                Hey {userData ? userData.name : 'Developer'}!
            </h1>
            <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
                Welcome to MERN Auth
            </h2>
            <p className="mb-8 max-w-md">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
                ad, maiores blanditiis eaque minima, unde, iusto dolorum
                voluptate consectetur tenetur omnis expedita ducimus saepe
                dignissimos nemo eum accusantium repellat debitis.
            </p>
            <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all">
                Get Started
            </button>
        </div>
    );
};

export default Header;
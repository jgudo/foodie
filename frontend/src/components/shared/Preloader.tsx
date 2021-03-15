import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';
import logo from '~/images/logo.svg';

const Preloader = () => (
    <div className="w-full h-screen z-9999 flex flex-col justify-center items-center animate-fade">
        <img src={logo} alt="Foodie Logo" className="w-48" />
        <p className="text-sm mt-4 text-gray-600">Nothing brings people together like good food.</p>
        <LoadingOutlined className="text-xl mt-4" />
    </div>
);

export default Preloader;

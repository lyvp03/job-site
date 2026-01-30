import React from 'react';

const Loading=()=>{
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
        {/* Logo loading */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse">
            <img src="./image/logo-white.png" ></img>
          </div>
        </div>
        

        <div className="text-center">
          <div className="relative">

            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4 mx-auto"></div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          </h3>
          <p className="text-gray-500">
            Vui lòng đợi trong giây lát
          </p>
          
        </div>
      </div>
};

export default Loading;
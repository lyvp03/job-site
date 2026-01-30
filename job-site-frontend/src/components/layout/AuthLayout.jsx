import React from 'react';
import {Outlet, Link} from 'react-router-dom';
import Header from './Header';

const AuthLayout=()=>{
  return(
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(119deg,rgba(101, 69, 151, 1) 33%, rgba(48, 57, 129, 1) 71%, rgba(152, 104, 168, 1) 91%)'
      }}>

        {/*Header*/}
        <Header />

        {/*Main content */}
        <main className="flex-grow flex items-center justify-center p-20">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg h-sm">
            {/*Card contains form */}
            <Outlet /> {/**Login /Register form */}
          </div>
        </main>

        {/**Footer */}
        <footer className="py-6 text-center text-white/80 text-sm">
          <div className="container mx-auto px-4 ">
            <p>© {new Date().getFullYear()} 5JOBS - JOB MATCHING 5.0</p>
          </div>
        </footer>
      </div>
  );
};
export default AuthLayout;
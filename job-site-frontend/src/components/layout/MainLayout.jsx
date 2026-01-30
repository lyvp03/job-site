import React from 'react';
import {Outlet} from 'react-router-dom';
import MainHeader from './MainHeader';
import Footer from './Footer'

const MainLayout=()=>{
    return(
        <div className="min-h-screen flex flex-col">
            {/**Header */}
            <MainHeader />

            {/**Main content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />        
        </div>

    );
};

export default MainLayout;
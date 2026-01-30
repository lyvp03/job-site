import React from 'react';
import {Outlet} from 'react-router-dom';
import CandidateHeader from './CandidateHeader';
import Footer from './Footer'

const CommonLayout=()=>{
    return(
        <div className="min-h-screen flex flex-col">
            {/**Header */}
            <CandidateHeader />

            {/**Main content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />        
        </div>

    );
};

export default CommonLayout;
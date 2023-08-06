import React from 'react';
import NavTop from '../components/NavTop';
import Footer from '../components/Footer';
import './NotFound.scss';



const NotFound = () => {
    return (
        <div className='notfound'>
            <NavTop/>
            <div class="error-page">
            <h1 data-h1="404">404</h1>
            </div>

        </div>
    )
}

export default NotFound;

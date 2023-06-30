import React from 'react';
import Button from 'react-bootstrap/Button';

export default function Header(props) {
    const resetApp = () => {
        localStorage.clear();
        //window.location.pathname = '/yelp-for-couples/';
        localStorage.setItem('pathname', '/');
        props.handlePageChange('Home');
    }
    return (
        <div className="d-flex justify-content-between p-4" id="pageHead">
            <h1>Yelp For Couples</h1>
            <Button id="pageButton" onClick={resetApp} className="d-flex align-self-center m-2">Start Over</Button>
        </div>
    );
}
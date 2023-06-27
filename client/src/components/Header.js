import React from 'react';
import Button from 'react-bootstrap/Button';

export default function Header() {
    const resetApp = () => {
        localStorage.clear();
        window.location.pathname = '/';
    }
    return (
        <div className="d-flex justify-content-between p-3" style={{'backgroundColor': 'lightBlue'}}>
            <h1>Yelp For Couples</h1>
            <Button onClick={resetApp} className="d-flex align-self-center">Start Over</Button>
        </div>
    );
}
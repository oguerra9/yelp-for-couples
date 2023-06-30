import React from 'react';
import Button from 'react-bootstrap/Button';

export default function RestaurantDisplayLine(props) {
    let option = props.restaurantData;

    const goToWebsite = (event) => {
        window.open(event.target.value);
    }

    return (
        <div id="restaurantDisplayLine" className="d-flex flex-column col-11 p-2">
            <div className="d-flex justify-content-between">
                <h5>{option.name}</h5>
                <p>| {option.rating} ⭐ | {option.price_level} | {option.distance_string} | {option.open_now_text}</p>
            </div>
            <div className="d-flex justify-content-start">
                
                {/* <p>{option.distance_string}</p>
                <p>{option.open_now_text}</p> */}
                {option.hasOwnProperty('website') ? (
                    <Button id="contactButton" onClick={goToWebsite} value={option.website}>🌐</Button>
                ) : (<></>)}
                {/* <p className="mb-0">  | {option.phone}</p> */}
            </div>
            
        </div>
    )
}


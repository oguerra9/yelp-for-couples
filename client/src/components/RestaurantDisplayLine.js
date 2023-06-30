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

// <div key={option.location_id} className="d-flex mb-2">
// <Button id="pageButton" className="m-1" name={index} onClick={props.handleButtonClick}>{props.buttonIcon}</Button>
// <div className="d-flex justify-content-between">
//     <div className="d-flex flex-column">
//         <h3 className="m-1">{option.name}</h3> 
//         <div className="d-flex">
//             <p>{option.phone}</p>
            // {option.hasOwnProperty('website') ? (
            //     <Button id="contactButton" onClick={goToWebsite} value={option.website}>🌐</Button>
            // ) : (<></>)}
            
//         </div>
//     </div>
//     {/* <p>{option.location_string}</p> 
//     <p>{option.rating}⭐</p>
//     <p>{option.distance_string}</p> */}
//     <div className="d-flex flex-column">
//         <p>{option.price_level}</p>
//         <p>{option.open_now_text}</p>
//     </div>
    
// </div>
                          
// </div>
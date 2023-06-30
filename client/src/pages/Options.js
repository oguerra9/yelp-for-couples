import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import RestaurantDisplayLine from '../components/RestaurantDisplayLine';

import { getRestaurantOptions, getCustomFilterOptions, getNearbyRestaurants } from '../services/APIService';

export default function Options() {

    const [optionList, setOptionList] = useState([]);
    const [unfilteredList, setUnfilteredList] = useState([]);
    const [selectedList, setSelectedList] = useState([]);

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => setShowAlert(true);
    const handleHideAlert = () => setShowAlert(false);

    const [elementType, setElementType] = useState(window.location.pathname.split('/')[3]);

    const [locationCoords, setLocationCoords] = useState(localStorage.getItem('locationCoords').split(','));

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        console.log(priceOptions);
    }
    const [filterOptions, setFilterOptions] = useState([]);

    const [priceOptions, setPriceOptions] = useState([]);

    const [filterData, setFilterData] = useState({minDistance: '', maxDistance:'', minPrice:'', maxPrice:''});

    useEffect(async () => {
    
        console.log(`retrieving options for ${elementType}`);
        getOptions(elementType);
        setSelectedList([]);
        
    }, []);



    const getOptions = async (elementType) => {
        
        if (elementType === 'cuisine') {
            let nearbyRestaurants = await getNearbyRestaurants(locationCoords);
            console.log(nearbyRestaurants);
            let cuisineOptions = getCustomFilterOptions(nearbyRestaurants, 'cuisine');
            console.log(cuisineOptions);
            setOptionList(cuisineOptions);
            
        } else if (elementType === 'restaurant') {
            let cuisineType = JSON.parse(localStorage.getItem('cuisineType'));
            let restaurantOptions = await getRestaurantOptions(locationCoords, cuisineType.key);
            setOptionList(restaurantOptions);
            setUnfilteredList(restaurantOptions);
            let priceLevels = getCustomFilterOptions(restaurantOptions, 'price_level');
            setPriceOptions(priceLevels);
            console.log('priceLevels');
            console.log(priceLevels);
        }
    };

    const saveFilters = () => {
        console.log(filterData);

        console.log(optionList);
        

        let filteredOptions = [];
        let minDist = parseFloat(filterData['minDistance']);
        let maxDist = parseFloat(filterData['maxDistance']);

        unfilteredList.forEach((option) => {
            let dist = parseFloat(option.distance);
            if ((dist > minDist) && (dist < maxDist) && !selectedList.includes(option)) {
                filteredOptions.push(option);
            }
        });

        console.log(`filtered options`);
        console.log(filteredOptions);

        setOptionList(filteredOptions);
        handleClose();
    }

    const handleAddOption = (event) => {
        let addedIndex = event.target.name;
        let currOptions = optionList;
        setSelectedList([...selectedList, currOptions[addedIndex]]);
        currOptions.splice(addedIndex, 1);

        setOptionList(currOptions);
    };

    const handleRemoveSelected = (event) => {
        let removedIndex = event.target.name;
        let currSelected = selectedList;
        setOptionList([...optionList, currSelected[removedIndex]]);
        currSelected.splice(removedIndex, 1);

        setSelectedList(currSelected);
    };

    const submitSelected = (event) => {
        if (selectedList.length === 0) {
            //display warning
            handleShowAlert();
        } else if (selectedList.length === 1) {
            localStorage.setItem(`${elementType}Type`, JSON.stringify(selectedList));
            window.location.pathname = `yelp-for-couples/vote/${elementType}`;
        } else {
            console.log(JSON.stringify(selectedList));
            localStorage.setItem(`${elementType}Selected`, JSON.stringify(selectedList));

            window.location.pathname = `/yelp-for-couples/vote/${elementType}`;
        }
        
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFilterData({ ...filterData, [name]: value });
    };

    return (
        <>
        <div id="optionScreenCon" className="col-9">
            <h4>Get started by adding all the options you want to vote on later</h4>
            {showAlert ? (
                <Alert>Please add some options to your list.</Alert>
            ) : (
                <></>
            )}
            <div className="d-flex justify-content-around">
                
                <div id="optionListCon">
                    {(elementType === 'cuisine') ? (
                        <h2>Cuisine Options</h2>
                    ) : (
                        <div className='d-flex justify-content-between'>
                            <h2>Restaurant Options</h2>
                            <Button id="pageButton" onClick={handleShow}>Filter</Button>
                        </div>
                    )}
                    
                    <ElementList 
                        displayList={optionList}
                        handleButtonClick={handleAddOption}
                        buttonIcon={'➕'}
                        elementType={elementType}
                    />
                </div>
                <div id="optionListCon">
                    <h4>Selected {elementType} Options</h4>
                    <ElementList 
                        displayList={selectedList}
                        handleButtonClick={handleRemoveSelected}
                        buttonIcon={'➖'}
                        elementType={elementType}
                    />
                    <Button id="pageButton" onClick={submitSelected}>Let's Vote</Button>
                </div>
            </div>
        </div>
        

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Filter Restaurants</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="minDistance">
                        <div className="d-flex justify-content-between">
                            <Form.Label className="m-2 pt-2">Distance</Form.Label>
                            <div className="d-flex">
                                <Form.Control id="filterTextBox" className="m-2" type="text" name="minDistance" onChange={handleChange} value={filterData.minDistance} placeholder="min" />
                                <p className="align-self-center pt-3">-</p>
                                <Form.Control id="filterTextBox" className="m-2" type="text" name="maxDistance" onChange={handleChange} value={filterData.maxDistance} placeholder="max" />
                            </div>
                        </div>
                    </Form.Group>
                    {/* <Form.Group className="mb-3" controlId="maxDistance">
                        <Form.Label>Maximum Distance</Form.Label>
                    </Form.Group> */}
                    {/* <Form.Group className="mb-3" controlId="minPrice">
                        <Form.Label>Price Options</Form.Label>
                    </Form.Group> */}
                    {/* <Form.Group className="mb-3" controlId="minPrice">
                        <Form.Label>Minimum Price</Form.Label>
                        <Form.Control type="text" name="minPrice" onChange={handleChange} value={filterData.minPrice} placeholder="Minimum Price" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="maxPrice">
                        <Form.Label>Maximum Price</Form.Label>
                        <Form.Control type="text" name="maxPrice" onChange={handleChange} value={filterData.maxPrice} placeholder="Maximum Price" />
                    </Form.Group> */}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button id="pageButton" onClick={handleClose}>
                    Close
                </Button>
                <Button id="pageButton" onClick={saveFilters}>
                    Apply Filters
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
    
}


function ElementList(props) {
    // props = {displayList, handleButtonClick, buttonIcon, elementType}
    // if restaurant options have additional fields, conditional can be added to display restaurant options/selected differently

    const goToWebsite = (event) => {
        window.open(event.target.value);
    };

    if (props.elementType === 'cuisine') {
        return (
            <Container className="mb-2">
                {(props.displayList).map((option, index) => (
                    <div key={option.key} className="d-flex mb-2">
                        <Button id="optionButton" name={index} onClick={props.handleButtonClick}>{props.buttonIcon}</Button>
                        <h5 className="m-1">{option.name}</h5>                            
                    </div>
                ))}
            </Container>
        );
    } else if (props.elementType === 'restaurant') {
        return (
            <div className="m-0">
                {(props.displayList).map((option, index) => (
                    <div key={option.location_id} className="d-flex mb-2">
                        <Button id="pageButton" className="m-1" name={index} onClick={props.handleButtonClick}>{props.buttonIcon}</Button>
                        <RestaurantDisplayLine restaurantData={option} />
                        {/* <div className="d-flex justify-content-between">
                            <div className="d-flex flex-column">
                                <h3 className="m-1">{option.name}</h3> 
                                <div className="d-flex">
                                    <p>{option.phone}</p>
                                    {option.hasOwnProperty('website') ? (
                                        <Button id="contactButton" onClick={goToWebsite} value={option.website}>🌐</Button>
                                    ) : (<></>)}
                                    
                                </div>
                            </div>
                            <p>{option.location_string}</p> 
                            <p>{option.rating}⭐</p>
                            <p>{option.distance_string}</p> 
                            <div className="d-flex flex-column">
                                <p>{option.price_level}</p>
                                <p>{option.open_now_text}</p>
                            </div>
                            
                        </div> */}
                                                  
                    </div>
                ))}
            </div>
        );
    }
    
}

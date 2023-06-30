import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import { getFilterOptions, getRestaurantOptions, findFilterOptions, getCustomFilterOptions, getNearbyRestaurants } from '../services/APIService';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

export default function Options() {

    const [optionList, setOptionList] = useState([]);
    const [unfilteredList, setUnfilteredList] = useState([]);
    const [selectedList, setSelectedList] = useState([]);

    const [elementType, setElementType] = useState(window.location.pathname.split('/')[2]);

    const [locationId, setLocationId] = useState(localStorage.getItem('locationId'));
    const [locationCoords, setLocationCoords] = useState(localStorage.getItem('locationCoords').split(','));

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const [filterOptions, setFilterOptions] = useState([]);

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
            let restaurantOptions = await getRestaurantOptions(locationCoords, cuisineType.value);
            setOptionList(restaurantOptions);
            setUnfilteredList(restaurantOptions);
            let priceOptions = getCustomFilterOptions(restaurantOptions, 'price_level');
            console.log('priceOptions');
            console.log(priceOptions);
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
            if ((dist > minDist) && (dist < maxDist)) {
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
        console.log(JSON.stringify(selectedList));
        localStorage.setItem(`${elementType}Selected`, JSON.stringify(selectedList));

        window.location.pathname = `/vote/${elementType}`;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFilterData({ ...filterData, [name]: value });
    };

    return (
        <>
        <div className="d-flex justify-content-around">
            <div id="optionDisplay" className="col-lg-5">
                {(elementType === 'cuisine') ? (
                    <h4>Cuisine Options</h4>
                ) : (
                    <div className='d-flex justify-content-between'>
                        <h4>Restaurant Options</h4>
                        <Button onClick={handleShow}>Filter</Button>
                    </div>
                )}
                
                <ElementList 
                    displayList={optionList}
                    handleButtonClick={handleAddOption}
                    buttonIcon={'➕'}
                    elementType={elementType}
                />
            </div>
            <div id="selectedDisplay" className="col-lg-5">
                <h4>Selected {elementType} Options</h4>
                <ElementList 
                    displayList={selectedList}
                    handleButtonClick={handleRemoveSelected}
                    buttonIcon={'➖'}
                    elementType={elementType}
                />
                <Button onClick={submitSelected}>Let's Vote</Button>
            </div>
        </div>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Filter Restaurants</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="minDistance">
                        <Form.Label>Minimum Distance</Form.Label>
                        <Form.Control type="text" name="minDistance" onChange={handleChange} value={filterData.minDistance} placeholder="Minimum Distance" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="maxDistance">
                        <Form.Label>Maximum Distance</Form.Label>
                        <Form.Control type="text" name="maxDistance" onChange={handleChange} value={filterData.maxDistance} placeholder="Maximum Distance" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="minPrice">
                        <Form.Label>Minimum Price</Form.Label>
                        <Form.Control type="text" name="minPrice" onChange={handleChange} value={filterData.minPrice} placeholder="Minimum Price" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="maxPrice">
                        <Form.Label>Maximum Price</Form.Label>
                        <Form.Control type="text" name="maxPrice" onChange={handleChange} value={filterData.maxPrice} placeholder="Maximum Price" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={saveFilters}>
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
                        <Button className="m-1" name={index} onClick={props.handleButtonClick}>{props.buttonIcon}</Button>
                        <div className="d-flex justify-content-between">
                            <div className="d-flex flex-column">
                                <h3 className="m-1">{option.name}</h3> 
                                <div className="d-flex">
                                    <p>{option.phone}</p>
                                    <Button id="contactButton" onClick={goToWebsite} value={option.website}>🌐</Button>
                                </div>
                            </div>
                            {/* <p>{option.location_string}</p> 
                            <p>{option.rating}⭐</p>
                            <p>{option.distance_string}</p> */}
                            <div className="d-flex flex-column">
                                <p>{option.price_level}</p>
                                <p>{option.open_now_text}</p>
                            </div>
                            
                        </div>
                                                  
                    </div>
                ))}
            </div>
        );
    }
    
}

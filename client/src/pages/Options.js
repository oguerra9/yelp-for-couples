import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { getFilterOptions, getRestaurantOptions } from '../services/APIService';

export default function Options() {

    const [optionList, setOptionList] = useState([]);
    const [selectedList, setSelectedList] = useState([]);

    const [elementType, setElementType] = useState(window.location.pathname.split('/')[2]);

    const [locationId, setLocationId] = useState(localStorage.getItem('locationId'));

    useEffect(() => {
    
        console.log(`retrieving options for ${elementType}`);
        getOptions(elementType);
        setSelectedList([]);
    }, []);

    const getOptions = async (elementType) => {
        if (elementType === 'cuisine') {
            // will add more to this list or get list of options from api if possible
            let cuisineOptions = await getFilterOptions(locationId, 'cuisine');
            console.log(`cuisine options: ${cuisineOptions}`);
            setOptionList(cuisineOptions);
            
        } else if (elementType === 'restaurant') {
            // winning cuisine type will be decided first and stored in local storage
            let cuisineType = JSON.parse(localStorage.getItem('cuisineType'));
            console.log(`cuisine type`);
            console.log(cuisineType);
            let restaurantOptions = await getRestaurantOptions(locationId, cuisineType.value);
            setOptionList(restaurantOptions);
            // cuisine type to be retrieved from local storage and used in api call
        }
    };

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

    
    return (
        <Container className="d-flex justify-content-center">
            <Col id="optionDisplay" className="col-lg-5">
                <h4>{elementType} Options</h4>
                <ElementList 
                    displayList={optionList}
                    handleButtonClick={handleAddOption}
                    buttonIcon={'➕'}
                />
            </Col>
            <Col id="selectedDisplay" className="col-lg-5">
                <h4>Selected {elementType} Options</h4>
                <ElementList 
                    displayList={selectedList}
                    handleButtonClick={handleRemoveSelected}
                    buttonIcon={'➖'}
                />
                <Button onClick={submitSelected}>Let's Vote</Button>
            </Col>
        </Container>
    );
}

function ElementList(props) {
    // props = {displayList, handleButtonClick, buttonIcon}
    // if restaurant options have additional fields, conditional can be added to display restaurant options/selected differently

    return (
        <Container className="mb-2">
            {(props.displayList).map((option, index) => (
                <div key={option.value} className="d-flex mb-2">
                    <Button id="optionButton" name={index} onClick={props.handleButtonClick}>{props.buttonIcon}</Button>
                    <h5 className="m-1">{option.name}</h5>                            
                </div>
            ))}
        </Container>
    );
}
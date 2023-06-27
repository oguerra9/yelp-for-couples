import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

export default function Options() {
    const [optionList, setOptionList] = useState([]);
    const [selectedList, setSelectedList] = useState([]);

    const [elementType, setElementType] = useState(window.location.pathname.split('/')[2]);

    useEffect(() => {
    
        console.log(`retrieving options for ${elementType}`);
        getOptions(elementType);
    }, [])

    const getOptions = (elementType) => {
        if (elementType === 'cuisine') {
            // will add more to this list or get list of options from api if possible
            setOptionList(['Thai', 'Italian', 'Mexican', 'American', 'Chinese']);
        } else if (elementType === 'restaurant') {
            // winning cuisine type will be decided first and stored in local storage
            let cuisineType = localStorage.getItem('cuisineType');
            // cuisine type to be retrieved from local storage and used in api call
            setOptionList([`${cuisineType} Restaurant #1`, `${cuisineType} Restaurant #2`, `${cuisineType} Restaurant #3`, `${cuisineType} Restaurant #4`]);
        }
    };

    const handleAddOption = (event) => {
        let addedOption = event.target.name;
        let currOptions = optionList;
        let addedIndex = currOptions.indexOf(addedOption);
        currOptions.splice(addedIndex, 1);

        setOptionList(currOptions);

        setSelectedList([...selectedList, addedOption]);
    };

    const handleRemoveSelected = (event) => {
        let removedSelected = event.target.name;
        let currSelected = selectedList;
        let removedIndex = currSelected.indexOf(removedSelected);
        currSelected.splice(removedIndex, 1);

        setSelectedList(currSelected);

        setOptionList([...optionList, removedSelected]);
    };

    const submitSelected = (event) => {
        localStorage.setItem(`${elementType}Selected`, selectedList);

        window.location.pathname = `/vote/${elementType}`;
    }

    
    return (
        <Container className="d-flex justify-content-center">
            <Col id="optionDisplay" className="col-lg-5">
                <h4>{elementType} Options</h4>
                <Container className="mb-2">
                    {optionList.map(option => (
                        <div key={option} className="d-flex mb-2">
                            <Button id='optionButton' name={option} onClick={handleAddOption}>➕</Button>
                            <h5 className="m-1">{option}</h5>                            
                        </div>
                    ))}
                </Container>
            </Col>
            <Col id="selectedDisplay" className="col-lg-5">
                <h4>Selected {elementType} Options</h4>
                <Container className="mb-2">
                    {selectedList.map(selected => (
                        <div key={selected} className="d-flex mb-2">
                            <Button id="optionButton" name={selected} onClick={handleRemoveSelected}>➖</Button>
                            <h5 className="m-1">{selected}</h5>
                        </div>
                    ))}
                </Container>
                <Button onClick={submitSelected}>Let's Vote</Button>
            </Col>
        </Container>
    );
}
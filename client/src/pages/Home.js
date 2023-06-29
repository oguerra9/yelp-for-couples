import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { getLocationCoords } from '../services/APIService';

export default function Home() {
    const [userNames, setUserNames] = useState(['user0', 'user1']);
    const [groupMembers, setGroupMembers] = useState({});
    const [groupMemberData, setGroupMemberData] = useState({});
    const [location, setLocation] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setGroupMemberData({ ...groupMemberData, [name]: value });
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const addFormLine = (event) => {
        event.preventDefault();

        setUserNames([...userNames, `user${userNames.length}`]);   
    };

    const submitSetUp = (event) => {
        let groupNames = [];
        userNames.forEach(user => groupNames.push(groupMemberData[user]));

        localStorage.setItem('groupNames', groupNames);

        console.log(`custom location name = ${location}`);
        if (location != '') {
            saveCustomLocation(location);
        }

        window.location.pathname = '/options/cuisine';
    };

    const setCurrLocation = (event) => {
        saveCurrentLocation();
    };

    // const setCustomLocation = (event) => {
    //     console.log(`custom location name = ${location}`);
    //     if (location != '') {
    //         saveCustomLocation(location);
    //     }
    // };

    return (
        <div>
            <h3>Welcome to Yelp for Couples</h3>
            <div className="d-flex justify-content-between">
                <Col className="col-lg-5">
                    <div>
                        <h5>Enter your group members below to get started</h5>
                    </div>
                    <div>
                        <Form>
                            <Container className="d-flex flex-wrap mb-2">
                                {userNames.map(user => (
                                    <div className="col-lg-3" key={user}>
                                        <Form.Control type="text" name={user} onChange={handleChange} value={groupMembers.user} placeholder="name" />
                                    </div>
                                ))}
                                <Button onClick={addFormLine}>+</Button>
                            </Container>
                        </Form>
                    </div>
                </Col>
                <Col className="col-lg-5">
                    <div>
                        <h5>Set your location</h5>
                    </div>
                    <div>
                        <Button onClick={setCurrLocation}>Use my current location</Button>
                        <Form className="d-flex">
                            <div className="col-lg-4">
                                <Form.Control type="text" name="locationForm" onChange={handleLocationChange} value={location} placeholder="location" />
                            </div>
                            {/* <Button onClick={setCustomLocation}>Set Location</Button> */}
                        </Form>
                    </div>
                </Col>
            </div>
            <Button onClick={submitSetUp}>All Set!</Button>
        </div>
    );
}


function saveCurrentLocation() {

    const successCallback = (position) => {
        console.log(`position data: ${position}`);
        let userCoords = [position.coords.latitude, position.coords.longitude];
    
        console.log(`position: <lat: ${userCoords[0]}, lon: ${userCoords[1]}>`);
        localStorage.setItem('locationCoords', userCoords);
    };

    const errorCallback = (error) => {
        console.log(`error: ${error}`);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

async function saveCustomLocation(locationName) {
    console.log(`saving custom location: ${locationName}`);
    let customCoords = await getLocationCoords(locationName).then((response) => console.log(response));
    localStorage.setItem('locationCoords', customCoords);
}
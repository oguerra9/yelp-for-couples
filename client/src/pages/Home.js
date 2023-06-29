import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { getGeoId } from '../services/APIService';

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

    const submitSetUp = async (event) => {
        let groupNames = [];
        userNames.forEach(user => groupNames.push(groupMemberData[user]));

        localStorage.setItem('groupNames', groupNames);

        
        if (location != '📍Current Location') {
            console.log(`saving custom location name = ${location}`);
            // await saveCustomLocation(location).then((response) => {
            //     localStorage.setItem('locationId', response);
            //     window.location.pathname = '/options/cuisine';
            // });
            saveCustomLocation(location);
        }

        
    };

    const setCurrLocation = (event) => {
        console.log('saving current location');
        setLocation('📍Current Location');
        saveCurrentLocation();
    };



    return (
        <div>
            <h2 className="mb-4">Welcome to Yelp for Couples</h2>
            <div className="d-flex justify-content-between">
                <Col className="col-lg-5 p-2">
                    <div>
                        <h5>Enter your group members below</h5>
                    </div>
                    <div>
                        <Form>
                            <Container className="d-flex flex-wrap mb-2">
                                {userNames.map(user => (
                                    <div className="col-lg-3 p-1" key={user}>
                                        <Form.Control type="text" id="formTextLine" name={user} onChange={handleChange} value={groupMembers.user} placeholder="name" />
                                    </div>
                                ))}
                                <div className="p-1 align-self-center">
                                    <Button onClick={addFormLine}>+</Button>
                                </div>
                                
                            </Container>
                        </Form>
                    </div>
                </Col>
                <Col className="col-lg-5 p-2">
                    <div>
                        <h5>Set your location</h5>
                    </div>
                    <div>
                        {/* <Button onClick={setCurrLocation}>Use my current location</Button> */}
                        <Form className="d-flex">
                            <div className="col-lg-4">
                                <Form.Control type="text" id="formTextLine" name="locationForm" onChange={handleLocationChange} value={location} placeholder="location" />
                            </div>
                        </Form>
                    </div>
                </Col>
            </div>
            <div className="d-flex justify-content-center">
                <Button onClick={submitSetUp} className="col-lg-4 d-flex justify-content-center mt-4">All Set!</Button>
            </div>
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
    await getGeoId(locationName).then((response) => {
        localStorage.setItem('locationId', response);
        window.location.pathname = '/options/cuisine';
        //return response;
    });
    //let customCoords = await getLocationCoords(locationName).then((response) => console.log(response));
    //localStorage.setItem('locationCoords', customCoords);
}
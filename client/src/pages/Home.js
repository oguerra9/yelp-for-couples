import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { getGeoId, reverseGeocode } from '../services/APIService';

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

        
        if (location === '📍Current Location') {
            saveCurrentLocation();
        } else {
            console.log(`saving custom location name = ${location}`);
            saveCustomLocation(location);
        }

        //window.location.pathname = '/options/cuisine';

        
    };

    const setCurrLocation = (event) => {
        console.log('saving current location');
        setLocation('📍Current Location');
    };



    return (
        <div>
            <h2 className="mb-4">Welcome to Yelp for Couples</h2>
            <div className="d-flex justify-content-around">
                <Col className="col-lg-5 p-3" style={{'border':'1px solid black'}}>
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
                <Col className="col-lg-5 p-3" style={{'border':'1px solid black'}}>
                    <div>
                        <h5>Set your location</h5>
                    </div>
                    <div className="d-flex">
                        <Button onClick={setCurrLocation} className="p-2">Use my current location</Button>
                        <div className="m-2">OR</div>
                        <Form className="d-flex">
                            <div>
                                <Form.Control type="text" id="formTextLine" name="locationForm" onChange={handleLocationChange} value={location} placeholder="Enter Custom Location" />
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


async function saveCurrentLocation() {

    const successCallback = async (position) => {
        console.log(`position data: ${position}`);
        let userCoords = [position.coords.latitude, position.coords.longitude];
    
        console.log(`position: <lat: ${userCoords[0]}, lon: ${userCoords[1]}>`);
        localStorage.setItem('locationCoords', userCoords);

        let locationName = await reverseGeocode(userCoords).then((response) => {
            console.log(`location name = ${response}`);
            return response;
        });
        console.log(locationName);
        await getGeoId(locationName).then((response) => {
            console.log(response);
            //localStorage.setItem('locationId', response.locationId);
            window.location.pathname = '/options/cuisine';
        });
    };

    const errorCallback = (error) => {
        console.log(`error: ${error}`);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

async function saveCustomLocation(locationName) {
    console.log(`saving custom location: ${locationName}`);
    await getGeoId(locationName).then((response) => {
        //localStorage.setItem('locationId', response.locationId);
        localStorage.setItem('locationCoords', response.coords);
        window.location.pathname = '/options/cuisine';
    });

}
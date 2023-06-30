import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { getGeoId, reverseGeocode } from '../services/APIService';

export default function Home() {
    const [userNames, setUserNames] = useState(['user0', 'user1']);
    const [groupMembers, setGroupMembers] = useState({});
    const [groupMemberData, setGroupMemberData] = useState({});
    const [location, setLocation] = useState('');
    const [maxDistance, setMaxDistance] = useState('');
    const [distanceUnits, setDistanceUnits] = useState('');

    const [showLocationAlert, setShowLocationAlert] = useState(false);
    const handleShowLocationAlert = () => setShowLocationAlert(true);
    const handleHideLocationAlert = () => setShowLocationAlert(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setGroupMemberData({ ...groupMemberData, [name]: value });
    };

    const handleChangeUnits = (event) => {
        console.log(event.target.value);
        setDistanceUnits(event.target.value);
    }

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const handleDistanceChange = (event) => {

        setMaxDistance(event.target.value);
    }

    const addFormLine = (event) => {
        event.preventDefault();

        setUserNames([...userNames, `user${userNames.length}`]);   
    };

    const submitSetUp = async (event) => {
        let groupNames = [];
        userNames.forEach(user => groupNames.push(groupMemberData[user]));

        localStorage.setItem('groupNames', groupNames);
        localStorage.setItem('distanceUnits', distanceUnits);
        localStorage.setItem('maxDistance', maxDistance);

        if (location === '') {
            handleShowLocationAlert();
        } else if (location === '📍Current Location') {
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
        <div id="welcomeScreenCon" className="col-8">
            <h2 className="mb-4">Welcome to Yelp for Couples</h2>
            <div className="d-flex justify-content-around">
                <Col id="setupCon" className="p-3">
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
                                    <Button id="pageButton" onClick={addFormLine}>+</Button>
                                </div>
                                
                            </Container>
                        </Form>
                    </div>
                </Col>
                <Col style={{'paddingLeft':'8px'}}>
                    <div id="setupCon" className="p-3 mb-2">
                        <div className="d-flex">
                            <h5>Set your location</h5>
                            {showLocationAlert ? (
                                <Alert className="p-1 m-1 mt-0">Please enter a location.</Alert>
                            ) : (<></>)}
                        </div>
                        <div className="d-flex">
                            <Button id="pageButton" onClick={setCurrLocation} className="p-2">Use my current location</Button>
                            <div className="m-2">OR</div>
                            <Form className="d-flex">
                                <div>
                                    <Form.Control type="text" id="formTextLine" name="locationForm" onChange={handleLocationChange} value={location} placeholder="Enter Custom Location" />
                                </div>
                            </Form>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div className="p-3" id="setupCon" style={{'width':'49%'}}>
                            <div>
                                <h5>Set your max distance</h5>
                            </div>
                            <div className="d-flex">
                                <Form className="d-flex">
                                    <Form.Control type="text" id="formTextLine" name="maxDistanceForm" onChange={handleDistanceChange} value={maxDistance} placeholder="Maximum Distance" />
                                </Form>
                            </div>
                        </div>
                        <div className="p-3" id="setupCon" style={{'width':'49%'}}>
                            <div>
                                <h5>Set your units</h5>
                            </div>
                            <div >
                                <Form className="d-flex">
                                    <Form.Group>
                                        <Form.Select name="distanceUnits" id="formTextLine" value={distanceUnits} onChange={handleChangeUnits}>
                                            <option>Units</option>
                                            <option value="km">kilometers</option>
                                            <option value="mi">miles</option>      
                                        </Form.Select>
                                    </Form.Group>
                                </Form>
                            </div>
                        </div>
                    </div>
                </Col>
            </div>
            <div className="d-flex justify-content-center">
                <Button id="pageButton" onClick={submitSetUp} className="col-lg-4 d-flex justify-content-center mt-4">All Set!</Button>
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
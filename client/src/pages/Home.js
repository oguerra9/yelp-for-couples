import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

export default function Home() {
    const [userNames, setUserNames] = useState(['user0', 'user1']);
    const [groupMembers, setGroupMembers] = useState({});
    const [groupMemberData, setGroupMemberData] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setGroupMemberData({ ...groupMemberData, [name]: value });
    };

    const addFormLine = (event) => {
        event.preventDefault();

        setUserNames([...userNames, `user${userNames.length}`]);   
    };

    const submitUserList = (event) => {
        let groupNames = [];
        userNames.forEach(user => groupNames.push(groupMemberData[user]));

        localStorage.setItem('groupNames', groupNames);

        window.location.pathname = '/options/cuisine';
    };

    return (
        <div>
            <div>
                <h3>Welcome to Yelp for Couples</h3>
                <h5>Enter your group members below to get started</h5>
            </div>
            <div>
                <Form className="col-lg-6">
                        <Container className="d-flex flex-wrap mb-2">
                            {userNames.map(user => (
                                <div className="col-lg-3" key={user}>
                                    <Form.Control type="text" name={user} onChange={handleChange} value={groupMembers.user} placeholder="name" />
                                </div>
                            ))}
                            <Button onClick={addFormLine}>+</Button>
                        </Container>
                    <Row>
                        <Button onClick={submitUserList}>All Set!</Button>
                    </Row>
                </Form>
            </div>
            
        </div>
    );
}

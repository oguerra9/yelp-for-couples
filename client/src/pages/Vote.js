import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function Vote() {
    const [elementType, setElementType] = useState(window.location.pathname.split('/')[2]);
    const [voteOptions, setVoteOptions] = useState(localStorage.getItem(`${elementType}Selected`).split(','));
    const [rankSum, setRankSum] = useState(new Array(voteOptions.length).fill(0));
    const [voters, setVoters] = useState(localStorage.getItem('groupNames').split(','));
    const [userRankings, setUserRankings] = useState({});
    const [groupRankings, setGroupRankings] = useState({});
    const [currVoterNum, setCurrVoterNum] = useState(0);

    /*
        groupRankings = {
            voters[0]: userRankings,
            voters[1]: userRankings,
            ...,
            voters[currVoterNum]: userRankings
        }
        userRankings = {
            voteOptions[0]: 0,
            voteOptions[1]: 1,
            ...
        }
    */

    useEffect(() => {
        initRank();    
    },[]);

    const initRank = () => {
        let clearedRank = {};
        voteOptions.forEach(option => clearedRank[option] = '');
        setUserRankings(clearedRank);
    };

    const calculateWinner = () => {
        //findMax();
        console.log(`${elementType} will be calculated here`);
    };

    const submitVote = () => {
        groupRankings[voters[currVoterNum]] = userRankings; 
        initRank();
        setCurrVoterNum(currVoterNum + 1);

    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserRankings({ ...userRankings, [name]: value });
    };

    const renderVoting = () => {
        if (currVoterNum < voters.length) {
            return (
                <div>
                    <h5>{voters[currVoterNum]}'s turn to vote</h5>
                    <VotingForm 
                        submitVote={submitVote} 
                        voteOptions={voteOptions} 
                        handleChange={handleChange}
                        formData={userRankings}
                    />
                </div>
            );
        } else {
            calculateWinner();
        }

    };


    return (
        <div>
            <h4>Time to Vote!</h4>
            {renderVoting()}
        </div>
    );
}

function VotingForm(props) {

    return (
        <Container>
            <Form>
                {(props.voteOptions).map(option => (
                    <Form.Group className="mb-3" key={option} controlId={`${option}Rank`}>
                        <Form.Label>{option}</Form.Label>
                        <Form.Control type="text" placeholder="" name={option} value={(props.formData)[option]} onChange={props.handleChange} />
                    </Form.Group>
                ))}
                <Button onClick={props.submitVote}>Submit Vote</Button>
            </Form>
        </Container>
    );

}
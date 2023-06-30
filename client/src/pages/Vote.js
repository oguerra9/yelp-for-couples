import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function Vote() {
    const [elementType, setElementType] = useState(window.location.pathname.split('/')[2]);
    const [voteOptions, setVoteOptions] = useState(JSON.parse(localStorage.getItem(`${elementType}Selected`)));
    const [rankSum, setRankSum] = useState(new Array(voteOptions.length).fill(0));
    const [voters, setVoters] = useState(localStorage.getItem('groupNames').split(','));
    const [userRankings, setUserRankings] = useState('');
    const [groupRankings, setGroupRankings] = useState({});
    const [currVoterNum, setCurrVoterNum] = useState(0);
    const [winner, setWinner] = useState('');

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

    const clearRank = () => {
        let clearedRank = {};
        voteOptions.forEach(option => clearedRank[option.name] = '');
        setUserRankings(clearedRank);
    };

    const calculateWinner = () => {
        // call functions to calculate winner here
        findHighestRank(); // sample function to find first option in list with highest rank sum and set as winner
    };

    const findHighestRank = () => {
        console.log(rankSum);
        let sortedRankSums = [];
        rankSum.forEach((num) => sortedRankSums.push(num));
        sortedRankSums.sort(function(a, b){return b - a});

        let highestRank = sortedRankSums[0];
        let highestIndex = rankSum.indexOf(highestRank);

        setWinner(voteOptions[highestIndex]);
    };

    const submitVote = () => {
        let currSum = rankSum;
        console.log(rankSum);
        console.log(`user rankings: ${JSON.stringify(userRankings)}`);
        for (let i = 0; i < voteOptions.length; i++) {
            let option = voteOptions[i];
            console.log(`option`);
            console.log(option);
            currSum[i] += parseInt(userRankings[option.name])
        }
        console.log(currSum);
        setRankSum(currSum);
        setGroupRankings({...groupRankings, [voters[currVoterNum]] : userRankings}); 
        clearRank();
        setCurrVoterNum(currVoterNum + 1);

    };

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUserRankings({ ...userRankings, [name]: value });

    };

    const renderVoting = () => {

        if (userRankings === '' && Array.isArray(voteOptions)) {
            clearRank();
        }
        
        if (currVoterNum < voters.length && Array.isArray(voteOptions)) {
            console.log(`vote options`);
            console.log(voteOptions);

            return (
                <div>
                    <h4>{voters[currVoterNum]}'s turn to vote</h4>
                    
                    <VotingForm 
                        submitVote={submitVote} 
                        voteOptions={voteOptions} 
                        handleChange={handleChange}
                        formData={userRankings}
                    />
                </div>
            );
        } else {

            if (winner === '' && Array.isArray(voteOptions)) {
                calculateWinner();
            }

            localStorage.setItem(`${elementType}Type`, JSON.stringify(winner));

            return (
                <WinnerDisplay 
                    elementType={elementType}
                    winner={winner}
                />
            );            
        }

    };

    if (!Array.isArray(voteOptions)) {
        return (
            <WinnerDisplay 
                elementType={elementType}
                winner={(JSON.parse(localStorage.getItem(`${elementType}Type`)))[0]}
            />
        );      
    }

    return (
        <div>
            <h3>Time to Vote!</h3>
            
            {renderVoting()}
        </div>
    );
}

function VotingForm(props) {
    // props = {submitVote, voteOptions, handleChange, formData
    console.log(`form data`);
    console.log(props.formData);

    let rankNums = Array.from({ length: (props.voteOptions.length) }, (value, index) => (index + 1));

    return (
        <Container>
            <h5 className="mb-3">Rank your options with your favorite at {props.voteOptions.length} and your least favorite at 1</h5>
            <Form>
                {(props.voteOptions).map(option => (
                    <Form.Group 
                        className="mb-3" 
                        key={option.value} 
                        controlId={`${option.name}Rank`}
                    >
                        <div className="d-flex">
                            <Form.Select name={option.name} value={props.formData[option.name]} onChange={props.handleChange}>
                                <option> </option>
                                {(rankNums).map(num => (
                                    <option key={num} value={num} name={option.name}>{num}</option>
                                ))}
                                
                            </Form.Select>
                            <Form.Label className="m-0 col-lg-11">{option.name}</Form.Label>
                        </div>
                    </Form.Group>
                ))}
                <Button onClick={props.submitVote}>Submit Vote</Button>
            </Form>
        </Container>
    );

}

function WinnerDisplay(props) {
    // props = {elementType, winner}

    const handleChooseRes = () => { 
        window.location.pathname = '/options/restaurant';
    };

    const handleOpenWebsite = (event) => {
        // ideally restaurant data will all be stored in local storage and can be parsed into an object
        // hopefully can retrieve either menu or website data from api call and open link in new tab
        window.open(event.target.value); 
    }

    return (
        <div>
            <h3>{props.winner.name} won!!!</h3>
            {(props.elementType === 'restaurant') ? (
                <Button onClick={handleOpenWebsite} value={props.winner.website}>Open Website</Button>
            ) : (
                <Button onClick={handleChooseRes}>Pick a restaurant</Button>
            )}
        </div>
    )
}
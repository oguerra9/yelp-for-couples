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

    useEffect(() => {
        console.log('use effect');
        
    }, []);

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
        let sortedRankSums = [];
        rankSum.forEach((num) => sortedRankSums.push(num));
        sortedRankSums.sort(function(a, b){return b - a});

        let highestRank = sortedRankSums[0];
        let highestIndex = rankSum.indexOf(highestRank);

        setWinner(voteOptions[highestIndex]);
    };

    const submitVote = () => {
        let currSum = rankSum;
        for (let i = 0; i < voteOptions.length; i++) {
            let option = voteOptions[i];
            currSum[i] += parseInt(userRankings[option.name])
        }
        setRankSum(currSum);
        setGroupRankings({...groupRankings, [voters[currVoterNum]] : userRankings}); 
        clearRank();
        setCurrVoterNum(currVoterNum + 1);

    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserRankings({ ...userRankings, [name]: value });
    };

    const renderVoting = () => {

        if (userRankings === '') {
            clearRank();
        }
        
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

            if (winner === '') {
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

    return (
        <div>
            <h4>Time to Vote!</h4>
            {renderVoting()}
        </div>
    );
}

function VotingForm(props) {
    // props = {submitVote, voteOptions, handleChange, formData

    return (
        <Container>
            <Form>
                {(props.voteOptions).map(option => (
                    <Form.Group className="mb-3" key={option.value} controlId={`${option.name}Rank`}>
                        <Form.Label>{option.name}</Form.Label>
                        <Form.Control type="text" placeholder="" name={option.name} value={(props.formData)[option.name]} onChange={props.handleChange} />
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

    const handleOpenMenu = () => {
        // ideally restaurant data will all be stored in local storage and can be parsed into an object
        // hopefully can retrieve either menu or website data from api call and open link in new tab
        window.open('https://google.com'); // placefiller
    }

    return (
        <div>
            <h3>{props.winner.name} won!!!</h3>
            {(props.elementType === 'restaurant') ? (
                <Button onClick={handleOpenMenu}>View Menu</Button>
            ) : (
                <Button onClick={handleChooseRes}>Pick a restaurant</Button>
            )}
        </div>
    )
}
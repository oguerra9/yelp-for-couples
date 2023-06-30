import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import RestaurantDisplayLine from '../components/RestaurantDisplayLine';

export default function Vote(props) {
    const [elementType, setElementType] = useState(localStorage.getItem('pathname').split('/')[2]);
    const [voteOptions, setVoteOptions] = useState(JSON.parse(localStorage.getItem(`${elementType}Selected`)));
    const [rankSum, setRankSum] = useState(new Array(voteOptions.length).fill(0));
    const [voters, setVoters] = useState(localStorage.getItem('groupNames').split(','));
    const [userRankings, setUserRankings] = useState('');
    const [groupRankings, setGroupRankings] = useState({});
    const [currVoterNum, setCurrVoterNum] = useState(0);
    const [winner, setWinner] = useState('');


    // const clearRank = () => {
    //     let clearedRank = {};
    //     voteOptions.forEach(option => clearedRank[option.name] = '');
    //     setUserRankings(clearedRank);
    // };

    const calculateWinner = () => {
        // call functions to calculate winner here
        findHighestRank(); // sample function to find first option in list with highest rank sum and set as winner
    };

    const findHighestRank = () => {
        console.log(rankSum);
        let sortedRankSums = [];
        rankSum.forEach((num) => sortedRankSums.push(num));
        sortedRankSums.sort(function(a, b){return a - b});

        let highestRank = sortedRankSums[0];
        let highestIndex = rankSum.indexOf(highestRank);

        setWinner(voteOptions[highestIndex]);
    };

    const submitVote = (newRanking) => {
        console.log(newRanking);
        setUserRankings(newRanking);

        console.log(`user rankings`);
        console.log(userRankings);

        let currSum = rankSum;

        for (let i = 0; i < voteOptions.length; i++) {
            let option = voteOptions[i];
            console.log(`option`);
            console.log(option);
            currSum[i] += newRanking.indexOf(option);
        }

        console.log(currSum);

        setRankSum(currSum);
        setCurrVoterNum(currVoterNum + 1);

    };

    const renderVoting = () => {

        // if (userRankings === '' && Array.isArray(voteOptions)) {
        //     clearRank();
        // }
        
        if (currVoterNum < voters.length && Array.isArray(voteOptions)) {
            console.log(`vote options`);
            console.log(voteOptions);

            return (
                <div id="voteScreenCon" className="col-6">
                    <h3>Time to Vote!</h3>
                    <div id="voteFormDiv" className="p-3">
                        <h4 className="align-self-center">{voters[currVoterNum]}'s turn to vote</h4>
                        
                        <VotingForm 
                            submitVote={submitVote} 
                            voteOptions={voteOptions} 
                            
                            formData={userRankings}
                            elementType={elementType}
                        />
                    </div>
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
                    handlePageChange={props.handlePageChange}
                />
            );            
        }

    };

    if (!Array.isArray(voteOptions)) {
        return (
            <WinnerDisplay 
                elementType={elementType}
                winner={(JSON.parse(localStorage.getItem(`${elementType}Type`)))[0]}
                handlePageChange={props.handlePageChange}
            />
        );      
    }

    return (
        <>
            {renderVoting()}
        </>
    );
}



function VotingForm(props) {
    // props = {submitVote, voteOptions, handleChange, formData

    const [optionList, setOptionList] = useState(props.voteOptions);


    const handleOnDragEnd = (result) => {
        console.log(result);
        if (!result.destination) return;

        const items = Array.from(optionList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setOptionList(items);
        console.log(items);
    }

    const sendVote = () => {
        console.log(optionList);
        props.submitVote(optionList);
    }

    return (
        <div className="p-2">
            <h5 className="mb-3">Drag your options in order with your favorite at the top</h5>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="optionList">
                    {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef} id="restaurantDisplayLine">
                        {(props.elementType === 'cuisine') ? (
                            <>
                                {optionList.map((option, index) => {
                                    return (
                                        <Draggable key={option.key} draggableId={option.key} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <h5>{option.name}</h5>
                                            </div>
                                        )}
                                        </Draggable>
                                    );
                                })}
                            </>
                        ) : (
                            <>
                            {optionList.map((option, index) => {
                                return (
                                    <Draggable key={option.location_id} draggableId={option.location_id} index={index}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <RestaurantDisplayLine restaurantData={option} />
                                        </div>
                                    )}
                                    </Draggable>
                                );
                            })}
                            </>
                        )}
                        
                        {provided.placeholder}
                    </ul>
                    )}
                </Droppable>
            </DragDropContext>
            <Button id="pageButton" onClick={sendVote}>Submit Vote</Button>
        </div>
    );

}

function WinnerDisplay(props) {
    // props = {elementType, winner}

    const handleChooseRes = () => { 
        //window.location.pathname = '/yelp-for-couples/options/restaurant';
        localStorage.setItem('pathname', '/options/restaurant');
        props.handlePageChange('Options');
    };

    const handleOpenWebsite = (event) => {
        // ideally restaurant data will all be stored in local storage and can be parsed into an object
        // hopefully can retrieve either menu or website data from api call and open link in new tab
        window.open(event.target.value); 
    }

    return (
        <div id="voteScreenCon" className="col-6">
            <h3 className="mb-2">{props.winner.name} won!!!</h3>
            {(props.elementType === 'restaurant') ? (
                <div className="d-flex flex-column">
                <div className="d-flex justify-content-center">
                    {(props.winner.hasOwnProperty('phone') && props.winner.phone != '') ? (
                        <h5 className="m-3 mb-1 align-self-center">Call: {props.winner.phone}</h5>
                    ) : (<></>)}
                    

                    {(props.winner.hasOwnProperty('website') && props.winner['website'] != '') ? (
                        <Button id="pageButton" className="align-self-center m-3 mb-1 p-3 pt-1 pb-1" onClick={handleOpenWebsite} value={props.winner.website}>Open Website</Button>
                    ) : (<></>)} 
                </div>

                    {(props.winner.hasOwnProperty('photo')) ? (
                        <DisplayPhotos winnerPhotos={props.winner.photo} />
                    ) : (<></>)}

                    

                </div>
            ) : (
                <Button id="pageButton" className="col-4 align-self-center mt-3" onClick={handleChooseRes}>Pick a restaurant</Button>
            )}

        </div>
    )
}

function DisplayPhotos(props) {
    let photoArr = props.winnerPhotos;
    let displayImage = photoArr.images.medium;
    let imgHeight = displayImage.height;
    let imgWidth = displayImage.width;
    let imgSrc = displayImage.url;
    return (
        <div style={{'height': {imgHeight}, 'width': {imgWidth}}} className='align-self-center m-2'>
            <img src={imgSrc} style={{'height': {imgHeight}, 'width': {imgWidth}}} />
        </div>
    )
}
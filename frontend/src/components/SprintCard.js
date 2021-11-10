import React from 'react';
import styled from 'styled-components';
import pencil from '../assets/pencil.svg';
import time from '../assets/time.svg';
import book from '../assets/book.svg';
import fire from '../assets/fire.svg';

const Container = styled.div`
  margin-top: 52px;
  display: flex;
  justify-content: space-between;

  @media (min-width: 320px) {
    overflow-x: scroll;
    padding-left: 1em;
    padding-right: 1em;
    padding-bottom: 3em;
  }

  @media (min-width: 600px) {
    overflow-x: unset;
    padding: unset;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 24px;
  width: 100%;
  height: 200px;
  background: #FFFFFF;
  box-shadow: 0px 17px 32px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  flex: 0 0 calc(25% - 24px);
  min-width: 250px;

  @media (min-width: 320px) {
    margin-right: 20px;
  }
`;

const Metric = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  margin: 0;
`;

const SprintCard = ({
  sprintName,
  sprintNumber,
  daysRemaning,
  sprintDuration,
  storyPointsInSprint,
  storyPointsAddedDuringSprint,
  storyPointsBurned,
  storyPointsRemaining,
}) => (
  <>
    <Container>
      <Card>
        <h5>Sprint</h5>
        <Metric>
          <h4 style={{ marginRight: '15px' }}><img src={pencil} alt="pencil" /></h4>
          <h4 style={{ marginTop: '2px' }}>{sprintName}</h4>
        </Metric>
        <Stat>
          <p>Number</p>
          <h6>{sprintNumber}</h6>
        </Stat>
      </Card>
      <Card>
        <h5>Days Remaining</h5>
        <Metric>
          <h4 style={{ marginRight: '15px' }}><img src={time} alt="time" /></h4>
          <h4 style={{ marginTop: '2px' }}>{daysRemaning}</h4>
        </Metric>
        <Stat>
          <p>Duration</p>
          <h6>{sprintDuration}</h6>
        </Stat>
      </Card>
      <Card>
        <h5>Story Points in Sprint</h5>
        <Metric>
          <h4 style={{ marginRight: '15px' }}><img src={book} alt="book" /></h4>
          <h4 style={{ marginTop: '2px' }}>{storyPointsInSprint}</h4>
        </Metric>
        <Stat>
          <p>Added During Sprint</p>
          <h6>{storyPointsAddedDuringSprint}</h6>
        </Stat>
      </Card>
      <Card>
        <h5>Story Points Burned</h5>
        <Metric>
          <h4 style={{ marginRight: '15px' }}><img src={fire} alt="fire" /></h4>
          <h4 style={{ marginTop: '2px' }}>{storyPointsBurned}</h4>
        </Metric>
        <Stat>
          <p>Remaining</p>
          <h6>{storyPointsRemaining}</h6>
        </Stat>
      </Card>
    </Container>
  </>
);

export default SprintCard;

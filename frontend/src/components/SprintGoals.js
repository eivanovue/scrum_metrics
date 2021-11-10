import React from 'react';
import styled from 'styled-components';
import cup from '../assets/cup.svg';
import loading from '../assets/loading.svg';
import doodle from '../assets/doodle.svg';

const Container = styled.div`
 @media (min-width: 320px) {
    padding: 1em;
  }

  @media (min-width: 600px) {
    padding: unset;
  }
`;
const Heading = styled.div`
  margin-top: 68px;
`;
const SprintGoalsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const SprintGoal = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  align-items: flex-start;
  padding: 30px;
  max-height: 90px;
  background: ${({ completed }) => (completed ? '#212243' : '#fff')} ;
  box-shadow: 0px 17px 24px rgba(0, 0, 0, 0.14);
  border-radius: 16px;
  margin-right: 16px;
  min-width: 400px;
  max-width: 600px;
  align-items: center;

  @media (min-width: 320px) {
    min-width: unset;
    width: 100%;
  }

  @media (min-width: 600px) {
  min-width: 500px;
    width: unset;

  }
`;

const GoalTitle = styled.h5`
  color: ${({ completed }) => (completed ? '#fff' : '#212243')} ;
  margin: 0;
`;

const Doodle = styled.div`
  @media (min-width: 320px) {
    position: absolute;
    width: 350px;
    height: 350px;
    top: ${({ isGoodVibes }) => (isGoodVibes ? '1400px;' : '900px;')}
    background-image: url(${doodle});
    background-position: top;
    background-repeat: no-repeat;
    background-size: contain;
    right: calc(50% - 175px);
  }

  @media (min-width: 600px) {
    display: none;
    right: unset;
  }

  @media (min-width: 1600px) {
    display: block;
    position: absolute;
    right: 150px;
    width: 450px;
    height: 450px;
    top: ${({ isGoodVibes }) => (isGoodVibes ? '950px;' : '425px;')}
    background-image: url(${doodle});
    background-position: top;
    background-repeat: no-repeat;
    background-size: contain;
    right: 150px;
  }

  @media (min-width: 1800px) {
    position: absolute;
    right: 150px;
    width: 450px;
    height: 450px;
    top: ${({ isGoodVibes }) => (isGoodVibes ? '950px;' : '425px;')}
    background-image: url(${doodle});
    background-position: top;
    background-repeat: no-repeat;
    background-size: contain;
    right: 150px;
  }

  @media (min-width: 2000px) {
    position: absolute;
    right: 150px;
    width: 450px;
    height: 450px;
    top: ${({ isGoodVibes }) => (isGoodVibes ? '950px;' : '425px;')}
    background-image: url(${doodle});
    background-position: top;
    background-repeat: no-repeat;
    background-size: contain;
    position: absolute;
    right: 350px;
  }

    @media (min-width: 2200px) {
    position: absolute;
    right: 100px;
    width: 450px;
    height: 450px;
    top: ${({ isGoodVibes }) => (isGoodVibes ? '950px;' : '425px;')}
    background-image: url(${doodle});
    background-position: top;
    background-repeat: no-repeat;
    background-size: contain;
    position: absolute;
    right: 400px;
  }
`;

const SprintGoals = ({ isGoodVibes, sprintGoals }) => (
  <Container>
    <Heading>
      <h3>Sprint Goals</h3>
    </Heading>
    <SprintGoalsContainer>
      {
        sprintGoals.length && sprintGoals.map(({ goal, completed }) => (
          <SprintGoal key={goal} completed={completed}>
            <img
              style={{
                marginRight: '21px',
                opacity: completed ? '1' : '.5',
              }}
              src={completed ? cup : loading}
              alt="trophy"
            />
            <GoalTitle completed={completed}>{goal}</GoalTitle>
          </SprintGoal>

        ))
      }
      {isGoodVibes ? (
        <Doodle isGoodVibes={isGoodVibes} />
      ) : (
        <Doodle />

      )}
    </SprintGoalsContainer>
  </Container>
);

export default SprintGoals;

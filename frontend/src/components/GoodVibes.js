/*eslint-disable */

import React from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import catVideo from '../assets/cat.mp4';
import fridayVideo from '../assets/friday.mp4';
import cross from '../assets/cross.svg';

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  @media (min-width: 320px) {
    padding: 1em;
  }

  @media (min-width: 600px) {
    padding: unset;
  }
`;

const Icon = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  width: 48px;
  height: 48px;
  background: #212243;
  border-radius: 64px;
  justify-content: center;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: 450px;
  padding: 24px;
  background: #FFFFFF;
  box-shadow: 0px 17px 32px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  flex: 0 0 calc(50% - 25px);

  @media (min-width: 320px) {
    margin-bottom: 1em;
  }

  @media (min-width: 600px) {
    margin-bottom: unset;
    margin-bottom: 80px;
  }
`;

const GoodVibes = ({ isGoodVibes, handleGoodVibes }) => {
  const todaysDate = new Date();
  const dayToday = todaysDate.getDay();

  return (

    <Card>
      <Container>
        <h3>Good Vibes?</h3>
        <Icon onClick={handleGoodVibes}>
          <img src={cross} alt="ta-da" />
        </Icon>
      </Container>
      <video controls>
        <source src={dayToday === 5 ? fridayVideo : catVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Card>
  );
};

export default GoodVibes;

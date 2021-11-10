import React from 'react';
import styled from 'styled-components';
import taDa from '../assets/ta-da.svg';

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
  align-items: flex-start;
  padding: 8px;
  position: static;
  width: 48px;
  height: 48px;
  left: 1098px;
  top: 7.5px;
  background: #212243;
  border-radius: 64px;
`;

const Header = ({ isGoodVibes, handleGoodVibes }) => (
  <Container>
    <h3>Sprint Metrics</h3>
    {!isGoodVibes && (
      <Icon onClick={handleGoodVibes}>
        <img src={taDa} alt="ta-da" />
      </Icon>
    )}
  </Container>
);

export default Header;

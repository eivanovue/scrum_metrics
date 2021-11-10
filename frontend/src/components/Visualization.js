/*eslint-disable */

import React from 'react';
import styled from 'styled-components';
import { Container as ComponentContainer } from 'react-bootstrap';
import BurnDownChart from './burndown-chart';
import AddedBurnedChart from './added-burned-chart';

const GraphRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 175px;

  @media (min-width: 320px) {
    margin-top: 300px;
    padding: 1em;
    flex-direction: column;
  }

  @media (min-width: 600px) {
    margin-top: 175px;
    flex-direction: row;
    padding: unset;
  }
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
  }
`;

const Credits = styled.h5`
  margin-top: 50px;
  color: #212243;
  text-align: center;
  opacity: .75;
`;

const Visualization = ({ metrics, totalPointsInSprint }) => (
  <ComponentContainer>
    <GraphRow>
      <Card>
        <h4>Burndown Chart</h4>
        <BurnDownChart
          totalPointsInSprint={totalPointsInSprint}
          sprintMetrics={metrics}
        />
      </Card>
      <Card>
        <h4>SPs Added & Burned</h4>
        <AddedBurnedChart
          totalPointsInSprint={totalPointsInSprint}
          sprintMetrics={metrics}
        />
      </Card>
    </GraphRow>
    <Credits>
      Concept & Development by Full-Stack GOD Emil, Design by UI/UX GOD Jakob
    </Credits>
  </ComponentContainer>
);

export default Visualization;

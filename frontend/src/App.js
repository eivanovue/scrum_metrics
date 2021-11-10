/*eslint-disable */
import React, { useState } from 'react';
import './App.scss';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import env from 'react-dotenv';
import Header from './components/Header';
import SprintCard from './components/SprintCard';
import SprintGoals from './components/SprintGoals';
import Visualization from './components/Visualization';
import bg from './assets/bg.svg';
import getter from './util/getter';
import PageError from './components/page-error';
import loadingCat from './assets/loading_cat.gif';
import GoodVibes from './components/GoodVibes';
import { CSSTransition } from 'react-transition-group';

const MainContainer = styled.div`
  background: #fff;
  background-image: url(${bg});
  /* Center and scale the image nicely */
  background-repeat: no-repeat;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  max-width: 100%;
  height: 100%;
  z-index: 0;
  padding-top: 80px;
`;

function App() {
  // const API_URL = `${env.SSL === 'true' ? 'https://' : 'http://'}${env.API_HOST}:${env.SSL === 'true' ? env.API_PORT_SSL : env.API_PORT}/sprint/metrics`;
  const API_URL = 'http://82.37.208.27:3001/jira/board/3/sprint';

  const { data, loading, error } = getter(API_URL);
  const [isGoodVibes, setIsGoodVibes] = useState(false);

  const handleGoodVibes = () => {
    setIsGoodVibes(!isGoodVibes);
  };

  const render = (stuff) => {
    const {
      sprintName,
      sprintNumber,
      storyPointsAddedDuringSprint,
      totalCompletedPointsInSprint,
      totalPointsInSprint,
      sprintGoals,
      sprintDuration,
      metrics,
      leftInSprint,
      daysRemaning
    } = stuff;

    return (
      <>
        <MainContainer>
          <Container >
            <>
              {isGoodVibes && (
                <>
                  <Container>
                    <CSSTransition
                      in={isGoodVibes}
                      out
                      timeout={300}
                      classNames="alert"
                      unmountOnExit
                    >
                      <GoodVibes key={1} isGoodVibes={isGoodVibes} handleGoodVibes={handleGoodVibes} />
                    </CSSTransition>
                  </Container>
                </>
              )}
              <Header isGoodVibes={isGoodVibes} handleGoodVibes={handleGoodVibes} />
              <SprintCard
                sprintName={sprintName}
                sprintNumber={sprintNumber}
                daysRemaning={daysRemaning}
                sprintDuration={sprintDuration}
                storyPointsInSprint={totalPointsInSprint}
                storyPointsAddedDuringSprint={storyPointsAddedDuringSprint}
                storyPointsBurned={totalCompletedPointsInSprint}
                storyPointsRemaining={leftInSprint}
              />
              <SprintGoals sprintGoals={sprintGoals} isGoodVibes={isGoodVibes} />
            </>
          </Container>
          <Visualization metrics={metrics} storyPointsInSprint={totalPointsInSprint} />

        </MainContainer>
      </>
    )
  }

  return (
    <>
      {error && <PageError />}
      {loading && (
        <Container>
          <Row className="justify-center" >
            <Col className="text-center">
              <img className="img-fluid" src={loadingCat} alt="loading gif" />
              <h3 style={{ textAlign: 'center' }}>Loading habibi...</h3>
            </Col>
          </Row>
        </Container>
      )}
      {!loading && !error && render(data)}
    </>
  );
}

export default App;

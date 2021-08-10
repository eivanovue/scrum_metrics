import './App.scss';
import getter from './util/getter';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import Navigation from './components/Nav';
import ResponsiveArticle from './util/ResponsiveArticle';
import BurnDownChart from './components/burndown-chart';
import { useState } from 'react';
import catVideo from './assets/cat.mp4';

function App() {
  const { data, loading } = getter('http://82.37.208.27:3001/sprint/metrics/30/Hafling');
  const [isGoodVibes, setIsGoodVibes] = useState(false);

  const handleGoodVibes = () => {
    setIsGoodVibes(!isGoodVibes);
  };

  const styleOptions = {
    col: {
      textAlign: 'left',
      paddingTop: '50px',
    },
    text: {
      fontWeight: '500',
      opacity: '.85',
      position: 'relative',
      fontFamily: 'Raleway, sans- serif',
      color: '#080808',
      transition: 'all 0.4s ease 0s',
      textTransform: 'unset',
    }
  }
  return (
    <div className="min-vh-100">
      <Navigation />
      <Container>
        {loading && (
          <ResponsiveArticle className="mt-5" />
        )}
        {!loading && (
          <>
            <Row className="mt-5">
              <Col md={{ span: 4 }} xl={{ span: 3 }}>
                <Card className="card bg-c-blue order-card">
                  <div className="card-block">
                    <Row>
                      <Col>
                        <h6 className="m-b-20">Sprint</h6>
                      </Col>
                    </Row>
                    <Row className="text-left justify-content-left">
                      <Col xs={{ span: 2 }} lg={{ span: 2 }} className="align-self-center">
                        <i className="fa fa-history f-left" />
                      </Col>
                      <Col className="align-self-center">
                        <h2 className="text-right"><span>{data.sprintName}</span></h2>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="">
                        <p>Number<span className="f-right">{data.sprintNumber}</span></p>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>

              <Col md={{ span: 4 }} xl={{ span: 3 }}>
                <Card className="card bg-c-green order-card">
                  <div className="card-block">
                    <Row>
                      <Col>
                        <h6 className="m-b-20">Days Remaining</h6>
                      </Col>
                    </Row>
                    <Row className="text-left justify-content-left">
                      <Col xs={{ span: 2 }} lg={{ span: 2 }} className="align-self-center">
                        <i className="fa fa-clock-o f-left" />
                      </Col>
                      <Col className="align-self-center">
                        <h2 className="text-right"><span>{data.daysRemaning}</span></h2>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="">
                        <p>Duration<span className="f-right">{data.sprintDuration}</span></p>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>

              <Col md={{ span: 4 }} xl={{ span: 3 }} className="align-items-stretch" >
                <Card className="card bg-c-yellow order-card">
                  <div className="card-block">
                    <Row>
                      <Col>
                        <h6 className="m-b-20">Story Points In Sprint</h6>
                      </Col>
                    </Row>
                    <Row className="text-left justify-content-left">
                      <Col xs={{ span: 2 }} lg={{ span: 2 }} className="align-self-center">
                        <i className="fa fa-arrow-up f-left" />
                      </Col>
                      <Col className="align-self-center">
                        <h2 className="text-right"><span>{data.totalPointsInSprint}</span></h2>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>

              <Col md={{ span: 4 }} xl={{ span: 3 }}>
                <Card className="card bg-c-pink order-card">
                  <div className="card-block">
                    <Row>
                      <Col>
                        <h6 className="m-b-20">Story Points Burned</h6>
                      </Col>
                    </Row>
                    <Row className="text-left justify-content-left">
                      <Col xs={{ span: 2 }} lg={{ span: 2 }} className="align-self-center">
                        <i className="fa fa-arrow-down f-left" />
                      </Col>
                      <Col className="align-self-center">
                        <h2 className="text-right"><span>{data.totalCompletedPointsInSprint}</span></h2>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="">
                        <p>Remaining<span className="f-right">{data.leftInSprint}</span></p>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row className="justify-content-between">
              <Col style={styleOptions.col}>
                <BurnDownChart
                  totalPointsInSprint={data.totalPointsInSprint}
                  sprintMetrics={data.metrics}
                />
              </Col>
            </Row>

            <Row className="mt-5">
              <Col>
                <Button
                  variant="light"
                  onClick={() => handleGoodVibes()}
                >
                  {
                    isGoodVibes ? 'Hide Good Vibes' : '🤙 Good Vibes Only 🤙'
                  }
                </Button>
              </Col>
            </Row>
            {isGoodVibes && (
              <Row>
                <Col>
                  <video width="600" height="500" controls autoPlay>
                    <source src={catVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Col>
              </Row>
            )}

          </>
        )}
      </Container>
    </div>
  );
}

export default App;

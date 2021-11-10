import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import loadingCat from '../assets/loading_cat.gif';

const PageError = () => {
  const styles = {
    errorContainer: {
      marginTop: '50px',
      textAlign: 'center',
    },
    icon: {
      marginRight: '20px',
    },
    heading: {
      textTransform: 'uppercase',
    },
    description: {
      marginTop: '25px',
      opacity: '.75',
    },
    button: {
      height: '50px',
      borderRadius: '16px',
      boxShadow: '0px 17px 24px rgba(0, 0, 0, 0.14)',
    },
  };

  return (
    <Row style={styles.errorContainer}>
      <Col className="text-center">
        <img className="img-fluid" src={loadingCat} alt="loading gif" />
        <h3 style={{ textAlign: 'center' }}>Hmm...</h3>
        <h6 style={{ textAlign: 'center' }}>Seems like the server is playing hard to get!</h6>
        <br />
        <Button style={styles.button} variant="dark" onClick={() => window.location.reload()}>
          <h6
            style={{ color: 'white' }}
          >
            Try again habibi
          </h6>
        </Button>
      </Col>

    </Row>
  );
};

export default PageError;

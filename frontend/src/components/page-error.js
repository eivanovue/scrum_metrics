import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

const PageError = () => {
  const styles = {
    errorContainer: {
      marginTop: '200px',
      textAlign: 'center',
    },
    icon: {
      marginRight: '20px',
    },
    heading: {
      textTransform: 'uppercase'
    },
    description: {
      marginTop: '25px',
      opacity: '.75'
    }
  }
  return (
    <Row style={styles.errorContainer}>
      <Col>
        <h1 style={styles.heading}><i className="fa fa-exclamation-circle" style={styles.icon}></i>Oops...</h1>
        <p style={styles.description}>Something has gone wrong on our end. We apologise for the inconvinience.</p>
        <Button variant={'dark'} onClick={() => window.location.reload()}>Refresh</Button>
      </Col>
    </Row >
  )
};

export default PageError;
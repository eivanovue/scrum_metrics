import { Navbar, Container } from 'react-bootstrap';
import React from 'react';

const Navigation = () => (
  <>
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="#home">🤙 Azzurri Sprint Metrics 🤙</Navbar.Brand>
      </Container>
    </Navbar>
  </>
);
export default Navigation;

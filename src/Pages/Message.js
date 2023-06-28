import {Outlet} from 'react-router-dom'
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";

function Message() {
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Link to="/message/form">Form</Link>
          </Col>
          <Col>
            <Link to="/message/list">List</Link>
          </Col>
        </Row>
      </Container>
      <p>Use the NavBar to get to the right component </p>
      {/* Outlet allows react router dom to render component below this.  */}

      <Outlet />
    </div>
  );
}
export default Message;

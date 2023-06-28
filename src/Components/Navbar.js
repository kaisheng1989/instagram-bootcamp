import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function Navbar(props) {
  return (
    <div className="text-bg-warning">
      <div>
        <Container>
          <Row>
            <Col>
              <Link to="/">Home</Link>
            </Col>
            <Col>
              <Link to="/login">Login</Link>
            </Col>
            <Col>
              <Link to="/message">Message</Link>
            </Col>
            <Col>
              {props.user ? (
                <Button
                  className="border btn btn-outline-light btn btn-warning"
                  onClick={props.handleSignOut}
                >
                  Logout
                </Button>
              ) : null}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Navbar;

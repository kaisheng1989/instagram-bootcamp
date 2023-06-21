import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
// ref : reference to the location in the  database. set-> for new value added. push -> new data to list. onChildAdded -> Everytime a child added to update our code to render on the screen.
import { database } from "./firebase";
import logo from "./logo.png";
import "./App.css";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
// Location on the database to store stuff.
const DB_MESSAGES_KEY = "messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      newMessageInput: "",
    };
  }
  /*messageRef is the location online where the data is stored.
onChildAdded is when new message is added take the new message and add to the current state. 

*/
  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      console.log(data);
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }
  /*

*/
  handleChange = (e) => {
    this.setState({
      newMessageInput: e.target.value,
    });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  handleSubmit = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      newMessageInput: this.state.newMessageInput,
      date: new Date().toLocaleString(),
    });
    this.setState({ newMessageInput: "" });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <div key={message.key}>
        <h6>
          {message.val.newMessageInput}-{message.val.date}
        </h6>
      </div>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/* TODO: Add input field and add text input as messages in Firebase */}
          {/*Input newly added. */}
          <br />
          <input
            class="rounded-pill"
            type="text"
            value={this.state.newMessageInput}
            onChange={this.handleChange}
            placeholder="Type your message"
          />
          <br />
          <Button onClick={this.handleSubmit} variant="warning">
            Send
          </Button>
          <br />
          <Container>
            <Row>
              <Col>
                <p class="text-start fs-3 ">Messages:</p>
                <div class="text-bg-warning p-3 rounded">
                  <div class="text-start text-secondary fw-bold">
                    {messageListItems}
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </header>
      </div>
    );
  }
}

export default App;

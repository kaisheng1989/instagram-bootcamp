import React from "react";
import {
  onChildAdded,
  push,
  ref as databaseRef,
  set,
  remove,
  onChildRemoved,
} from "firebase/database";
// ref : reference to the location in the  database. set-> for new value added. push -> new data to list. onChildAdded -> Everytime a child added to update our code to render on the screen.
import {
  getDownloadURL,
  uploadBytes,
  deleteObject,
  ref as storageRef,
} from "firebase/storage";
// Getting storage reference and renaming as storageref
import { database, storage } from "./firebase";
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
// Part 2: Firebase Storage
// Puting the slash here to make the code clean
const STORAGE_MESSAGES_KEY = "messages/";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI

    // Part 2: Increase the number of state to add file.
    this.state = {
      messages: [],
      newMessageInput: "",
      // Part 2: Adding this two state to accept file and value.
      fileInputFile: null,
      fileInputvalue: "",
    };
  }
  /*messageRef is the location online where the data is stored.
onChildAdded is when new message is added take the new message and add to the current state. 

*/
  componentDidMount() {
    const messagesRef = databaseRef(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      console.log(data);
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
    onChildRemoved(messagesRef, (data) => {
      let MessageArray = [...this.state.messages];
      let NewMesssageArray = MessageArray.filter(
        (item) => item.key !== data.key
      );
      this.setState({
        messages: NewMesssageArray,
      });
    });
  }
  /*

*/
  handleChange = (e) => {
    this.setState({
      newMessageInput: e.target.value,
    });
  };

  // Function to handle file changes.

  handleFileChange = (e) => {
    // This console log written in this manner will allow the file path to log into console. fileInputFile in the state below provide the path to the file.
    console.log(e.target.value);
    this.setState({
      fileInputFile: e.target.files[0],
      fileInputvalue: e.target.value,
    });
  };
  // This portion is to handle delete function.

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  handleSubmit = () => {
    // Part 2:

    const messageListRef = databaseRef(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    // Part 2:
    console.log(this.state.fileInputFile);
    const storageRefInstance = storageRef(
      storage,
      // Remove the slash from below.
      STORAGE_MESSAGES_KEY + this.state.fileInputFile.name
    );
    console.log("Storage Ref Instance", storageRefInstance);
    // Part 2: This si the function to upload something online. Then we do something.
    uploadBytes(storageRefInstance, this.state.fileInputFile).then(
      (snapshot) => {
        console.log(snapshot);
        console.log("Upload Image");

        getDownloadURL(storageRefInstance).then((url) => {
          console.log(url);

          set(newMessageRef, {
            newMessageInput: this.state.newMessageInput,
            date: new Date().toLocaleString(),
            url: url,
            ref: String(storageRefInstance),
          });

          // Part 2: Setting the state after a successful upload. Once after upload it will reset the state.
          this.setState({
            newMessageInput: "",
            fileInputFile: null,
            fileInputvalue: "",
          });
        });
      }
    );
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <div key={message.key}>
        <h6>
          {message.val.newMessageInput}-{message.val.date}
          <div>
            <img
              style={{ height: "30vh" }}
              src={message.val.url}
              alt={message.val.name}
            />
          </div>
          <div>
            <Button
              variant="danger"
              onClick={(e) => {
                const ImagetoDeleteRef = storageRef(storage, message.val.ref);
                console.log("Message Reference", message.val.ref);
                deleteObject(ImagetoDeleteRef).then(() =>
                  console.log("Deleted?")
                );
                const itemToDelete = databaseRef(
                  database,
                  "messages/" + message.key
                );
                remove(itemToDelete).then(() => console.log("Success"));
              }}
            >
              Delete
            </Button>
          </div>
        </h6>
      </div>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          {/*Part 2: Add an input to upload files.  */}
          <br />
          <input
            className="rounded-pill bg-warning fs-3"
            type="file"
            value={this.state.fileInputvalue}
            onChange={this.handleFileChange}
            placeholder="Add a file here"
          />

          <br />
          {/* TODO: Add input field and add text input as messages in Firebase */}
          {/*Input newly added. */}
          <input
            className="rounded-pill"
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
                <p className="text-start fs-3 ">Messages and Pictures:</p>
                <div className="text-bg-warning p-3 rounded">
                  <div className="text-start text-secondary fw-bold">
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

import React, { useEffect, useState } from "react";
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
import { database, storage, auth } from "./firebase";
// Part 3: Authentication
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import logo from "./logo.png";
import "./App.css";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const DB_MESSAGES_KEY = "messages";
const STORAGE_MESSAGES_KEY = "messages/";

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessageInput, setNewMessageInput] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        console.log("Success");
        console.log(userCred);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        console.log("Success");
        console.log(userCred);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log("Sign out successful");
      setEmail("");
      setPassword("");
    });
  };

  useEffect(() => {
    const messagesRef = databaseRef(database, DB_MESSAGES_KEY);

    onChildAdded(messagesRef, (data) => {
      console.log(data);
      setMessages((messages) => [
        ...messages,
        { key: data.key, val: data.val() },
      ]);
    });
    onChildRemoved(messagesRef, (data) => {
      let MessageArray = [...messages];
      let NewMessageArray = MessageArray.filter(
        (item) => item.key !== data.key
      );
      setMessages(NewMessageArray);
    });

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Current User:", user);
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser({});
      }
    });
  }, []);

  const handleSubmit = () => {
    const messageListRef = databaseRef(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    console.log(fileInputFile);

    const storageRefInstance = storageRef(
      storage,
      STORAGE_MESSAGES_KEY + fileInputFile.name
    );

    uploadBytes(storageRefInstance, fileInputFile).then((snapshot) => {
      console.log(snapshot);
      console.log("Upload Image");

      getDownloadURL(storageRefInstance).then((url) => {
        console.log(url);
        console.log(storageRefInstance._location.path_);
        console.log("Submission", user);

        set(newMessageRef, {
          newMessageInput: newMessageInput,
          date: new Date().toLocaleString(),
          url: url,
          ref: String(storageRefInstance),
          user: user.email,
        });

        setNewMessageInput("");
        setFileInputFile(null);
        setFileInputValue("");
      });
    });
  };

  let messageListItems = messages.map((message) => (
    <div key={message.key}>
      <h6>
        {message.val.newMessageInput}-{message.val.date}
        <div>
          <h4>{message.val.user}</h4>
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
        {!isLoggedIn ? (
          <div>
            <label>Email:</label>
            <input
              value={email}
              name="email"
              type="text"
              placeholder="Type in Email Here"
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password:</label>
            <input
              value={password}
              name="password"
              type="text"
              placeholder="Type in password Here"
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={handleLogin} variant="warning">
              Login
            </Button>
            <Button onClick={handleSignup} variant="warning">
              SignUp
            </Button>
          </div>
        ) : (
          <div>
            <Button onClick={handleSignOut} variant="warning">
              Log Out!
            </Button>
          </div>
        )}

        <br />
        <img src={logo} className="App-logo" alt="logo" />

        {/*Part 2: Add an input to upload files.  */}
        <br />

        {isLoggedIn ? (
          <div>
            <h2>Welcome Back {user.email}</h2>
            <input
              className="rounded-pill bg-warning fs-3"
              type="file"
              value={fileInputValue}
              onChange={(e) => {
                setFileInputFile(e.target.files[0]);
                setFileInputValue(e.target.value);
              }}
              placeholder="Add a file here"
            />

            <br />
            {/* TODO: Add input field and add text input as messages in Firebase */}
            {/*Input newly added. */}
            <input
              className="rounded-pill"
              type="text"
              value={newMessageInput}
              onChange={(e) => {
                setNewMessageInput(e.target.value);
              }}
              placeholder="Type your message"
            />
            <br />
            <Button onClick={handleSubmit} variant="warning">
              Send
            </Button>
          </div>
        ) : null}
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

export default App;

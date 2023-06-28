import React, {useState } from "react";
import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  uploadBytes,
 
  ref as storageRef,
} from "firebase/storage";
import { database, storage } from "../firebase";
import Button from "react-bootstrap/Button";

const DB_MESSAGES_KEY = "messages";
const STORAGE_MESSAGES_KEY = "messages/";

function Form() {
  const [newMessageInput, setNewMessageInput] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");
  
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
      //console.log("Submission", user);

      set(newMessageRef, {
        newMessageInput: newMessageInput,
        date: new Date().toLocaleString(),
        url: url,
        ref: String(storageRefInstance),
       // user: user.email,
      });

      setNewMessageInput("");
      setFileInputFile(null);
      setFileInputValue("");
    });
  });
};


  return (
    <div className="border">
      <p>Form </p>
      <div>
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
    </div>
  );
}
export default Form;

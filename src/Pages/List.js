import React, { useEffect, useState } from "react";
// Things imported 
import {
  onChildAdded,
  ref as databaseRef,
  remove,
  onChildRemoved,
} from "firebase/database";
import { database, storage } from "../firebase";
import { deleteObject, ref as storageRef } from "firebase/storage";
import Button from "react-bootstrap/Button";

const DB_MESSAGES_KEY = "messages";


function List() {
  const [messages, setMessages] = useState([]);

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
  }, []);

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
    <div className="text-bg-warning p-3 rounded">
      <p>List </p>
      {messageListItems}
    </div>
  );
}
export default List;

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Errorpage from "./Pages/Error";
import Welcome from "./Pages/Welcome";
import Message from "./Pages/Message";
import Login from "./Pages/Login";
import Form from "./Pages/Form";
import List from "./Pages/List";
import Navbar from "./Components/Navbar";

import "./App.css";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {auth} from './firebase'
import {Navigate} from 'react-router-dom'

function App() {
      const [user, setUser] = useState("");
       const [email, setEmail] = useState("");
       const [password, setPassword] = useState("");
      const [isLoggedIn, setIsLoggedIn] = useState(false);
     const handleSignup = (email,password) => {
       createUserWithEmailAndPassword(auth, email, password)
         .then((userCred) => {
           console.log("Success");
           console.log(userCred);
         })
         .catch((error) => {
           console.log("Error", error);
         });
     };

     const handleLogin = (email, password) => {
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


  useEffect(()=>{
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

  },[])
  
function RequireAuth({ children, redirectTo, user }) {
  console.log(user);
  const isAuthenticated = isLoggedIn
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

// Within a React functional component, wrapped inside a BrowserRouter

   
       
   

  return (
    <div className="App-header">
      <BrowserRouter>
        {/* Reason to put it within BrowserRouter for it to work or else it will not work  */}
        <Navbar handleSignOut={handleSignOut} user={user} />
        <Routes>
          {/* Setting the local host 300 main page. */}
          <Route path="/instagram-bootcamp/" element={<Welcome />} />

          {/*Login in component */}
          <Route
            path="/login"
            element={
              <Login handleLogin={handleLogin} handleSignOut={handleSignup} />
            }
          />
          {/*Below is a example of a nested route. Not Nested self closing. Nested not self closing. */}
          {/*Nested Route have no / */}
          {/*If not login will be redirected.  */}
          <Route path="/message" element={<Message user={user} />}>
            <Route
              path="form"
              element={
                <RequireAuth redirectTo="/login" user={user}>
                  <Form />
                </RequireAuth>
              }
            />
            <Route path="list" element={<List />} />
          </Route>

          {/*No match route */}
          {/*For example if the URL is an error then it will directed here */}
          <Route path="*" element={<Errorpage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;

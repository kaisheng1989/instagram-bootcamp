import React, {  useState } from "react";
import Button from "react-bootstrap/Button";


function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="border">
      <p>Please click on the links to view messages and add messages </p>
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

      <Button onClick={()=>props.handleLogin(email, password)} variant="warning">
        Login
      </Button>
      <Button onClick={()=>props.handleSignup(email, password)} variant="warning">
        SignUp
      </Button>
    </div>
  );
}
export default Login;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import validator from "validator";
import "./Register.css";
import axios from "axios";
import Cookies from "js-cookie";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
      color: "white",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
      color: "white",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
      color: "white",
    },
  },
});

function Register() {
  const classes = useStyles();
  const [usernameError, setUsernameError] = useState(false);
  const [usernameHelper, setUsernameHelper] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [emailHelper, setEmailHelper] = useState("");

  const [passwordError, setPasswordError] = useState(false);
  const [passHelper, setPassHelper] = useState("");

  const [repeatPassError, setRepeatPassError] = useState(false);
  const [repeatPassHelper, setRepeatPassHelper] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function usernameValidate(e) {
    let username = e.target.value;
    if (username.length < 5) {
      setUsernameHelper("Username too short");
      setUsernameError(true);
    } else {
      setUsernameHelper("");
      setUsernameError(false);
    }
  }

  function emailValidate(e) {
    let email = e.target.value;

    if (!validator.isEmail(email)) {
      setEmailHelper("Invalid email");
      setEmailError(true);
    } else {
      setEmailHelper("");
      setEmailError(false);
    }
  }

  function passwordValidate(e) {
    let length = e.target.value.length;
    if (length < 6) {
      setPassHelper("Password too short");
      setPasswordError(true);
    } else {
      setPassHelper("");
      setPasswordError(false);
    }
  }

  function repeatPasswordValidate(e) {
    if (e.target.value != password) {
      setRepeatPassHelper("Passwords don't match");
      setRepeatPassError(true);
    } else {
      setRepeatPassHelper("");
      setRepeatPassError(false);
    }
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  function completeRegister() {
    let username = document.getElementById("outlined-required-username").value;
    let email = document.getElementById("outlined-email-input").value;

    if (!username || !email || !password) {
      if (!email) {
        setEmailError(true);
        setEmailHelper("Invalid email");
      }

      if (!username) {
        setUsernameError(true);
        setUsernameHelper("Invalid username");
      }

      if (!password) {
        setPasswordError(true);
        setPassHelper("Invalid password");
      }

      setError(true);
      setErrorMessage("Invalid details, please check again");
    } else {
      setError(false);
      let data = {
        username: username,
        password: password,
        email: email,
        shows: "",
      };
      axios
        .post("http://localhost:6969/users/register", data)
        .then((response) => {
          if (response.data.error) {
            setErrorMessage(response.data.error);
            setError(true);
          } else {
            Cookies.set("accessToken", response.data, { SameSite: "Lax" });
          }
        });
    }
  }

  return (
    <div className="wrapper_holder">
      <div className="content_wrapper">
        <Stack spacing={2}>
          <div className="logo">SHOWLOG</div>
          <TextField
            sx={{ input: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
            className={classes.root}
            error={usernameError}
            required
            id="outlined-required-username"
            label="Username"
            helperText={usernameHelper}
            onChange={usernameValidate}
          />
          <TextField
            sx={{ input: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
            className={classes.root}
            error={emailError}
            required
            id="outlined-email-input"
            label="Email"
            type="email"
            helperText={emailHelper}
            onChange={emailValidate}
          />
          <TextField
            sx={{ input: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
            className={classes.root}
            error={passwordError}
            required
            id="outlined-password-input-repeat"
            label="Password"
            type="password"
            helperText={passHelper}
            onChange={(e) => {
              handlePassword(e);
              passwordValidate(e);
            }}
          />
          <TextField
            sx={{ input: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
            className={classes.root}
            error={repeatPassError}
            required
            id="outlined-password-input"
            label="Repeat Password"
            type="password"
            helperText={repeatPassHelper}
            onChange={(e) => {
              repeatPasswordValidate(e);
            }}
          />
          <Button
            onClick={completeRegister}
            sx={{
              height: 56,
            }}
            variant="outlined"
          >
            Register
          </Button>
          <Link to="/login" className="new_message">
            Registered? Login here
          </Link>
          {error && <Alert severity="error">{errorMessage}</Alert>}
        </Stack>
      </div>
    </div>
  );
}

export default Register;

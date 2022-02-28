import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { makeStyles } from "@material-ui/core/styles";

import { useNavigate } from "react-router-dom";

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

function Login() {
  const classes = useStyles();
  const [usernameError, setUsernameError] = useState(false);
  const [usernameHelper, setUsernameHelper] = useState("");

  const [passwordError, setPasswordError] = useState(false);
  const [passHelper, setPassHelper] = useState("");

  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

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

  function handlePassword(e) {
    setPassword(e.target.value);
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

  function completeLogin() {
    let username = document.getElementById("outlined-required-username").value;

    if (!username || !password) {
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
      let data = { username: username, password: password };
      axios.post("http://localhost:6969/users/login", data).then((response) => {
        if (response.data.error) {
          setErrorMessage(response.data.error);
          setError(true);
          setUsernameError(true);
          setPasswordError(true);
        } else {
          Cookies.set("accessToken", response.data, { SameSite: "Lax" });
          navigate("/");
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
          <Button
            onClick={completeLogin}
            sx={{
              height: 56,
            }}
            variant="outlined"
          >
            Login
          </Button>
          <Link to="/register" className="new_message">
            New? Register here
          </Link>
          {error && <Alert severity="error">{errorMessage}</Alert>}
        </Stack>
      </div>
    </div>
  );
}

export default Login;

import React, { useState } from 'react';
import '../../stylesheets/SignUpANDLogInContainer.css';
import axios from 'axios';

function SignUpContainer({ updatePage }) {
  const [formInputs, setformInputs] = useState({ userName: '', emailAddress: '', password: '', confirmPassword: '' });
  const [hasError, setHasError] = useState({
    userName: null,
    emailAddress: null,
    password: null,
    confirmPassword: null,
  });

  const setUserName = (e) => {
    setformInputs({ ...formInputs, userName: e.target.value.trim() });
  };

  const setEmailAddress = (e) => {
    setformInputs({ ...formInputs, emailAddress: e.target.value.trim() });
  };

  const setPassword = (e) => {
    setformInputs({ ...formInputs, password: e.target.value.trim() });
  };

  const setConfirmPassword = (e) => {
    setformInputs({ ...formInputs, confirmPassword: e.target.value.trim() });
  };

  function isNotValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !pattern.test(email);
  }

  const validateSignUp = () => {
    let newStateHasError = { userName: null, emailAddress: null, password: null, confirmPassword: null };
    let username = formInputs.userName.trim();
    let email = formInputs.emailAddress.trim();
    let password = formInputs.password.trim();
    let confirmPassword = formInputs.confirmPassword.trim();

    if (username.length === 0) {
      newStateHasError = { ...newStateHasError, userName: 'Username field can not be empty.' };
    }
    if (email.length === 0) {
      newStateHasError = { ...newStateHasError, emailAddress: 'Email field can not be empty.' };
    } else if (isNotValidEmail(email)) {
      newStateHasError = { ...newStateHasError, emailAddress: 'Invalid email address provided.' };
    }
    if (password.length === 0) {
      newStateHasError = { ...newStateHasError, password: 'Password field can not be empty.' };
    } else if (email.includes(password) || username.includes(password)) {
      newStateHasError = {
        ...newStateHasError,
        password: 'Password field can not contain any part of email address or username.',
      };
    }
    if (confirmPassword.length === 0) {
      newStateHasError = { ...newStateHasError, confirmPassword: 'Confirm Password field can not be empty.' };
    } else if (confirmPassword !== password) {
      newStateHasError = { ...newStateHasError, confirmPassword: 'Input provided does not match the password above.' };
    }

    setHasError(newStateHasError);

    if (
      newStateHasError.userName === null &&
      newStateHasError.emailAddress === null &&
      newStateHasError.password === null &&
      newStateHasError.confirmPassword === null
    ) {
      const newUser = {
        username: username,
        email: email,
        password: password,
        isAdmin: false,
      };

      axios
        .post('http://localhost:8000/users/signUp', newUser, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          if (res.data === 'success') {
            updatePage('login');
          } else {
            let newStateHasError = { userName: null, emailAddress: null, password: null, confirmPassword: null };
            newStateHasError = { ...newStateHasError, confirmPassword: res.data };
            setHasError(newStateHasError);
          }
        });
    }
  };
  function returntoWelcomePage() {
    updatePage('welcome');
  }

  function directToLoginPage() {
    updatePage('login');
  }

  return (
    <>
      <div className="sulg-container">
        <h1>Sign Up</h1>
        <div className="sulg-form">
          <input type="text" placeholder="Username" onChange={(e) => setUserName(e)} maxLength="100" />
          <br />
          <label htmlFor="username" className="new-f-error" id="f-error">
            {hasError.userName === null ? '' : hasError.userName}
          </label>
          <input type="email" placeholder="Email Address" onChange={(e) => setEmailAddress(e)} />
          <br />
          <label htmlFor="email" className="new-f-error" id="f-error">
            {hasError.emailAddress === null ? '' : hasError.emailAddress}
          </label>
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e)} />
          <br />
          <label htmlFor="password" className="new-f-error" id="f-error">
            {hasError.password === null ? '' : hasError.password}
          </label>
          <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e)} />
          <br />
          <label htmlFor="confirmPassword" className="new-f-error" id="f-error">
            {hasError.confirmPassword === null ? '' : hasError.confirmPassword}
          </label>
          <button onClick={validateSignUp}>Sign Up</button>
        </div>
        <div className="sulg-bottom-div">
          <button onClick={returntoWelcomePage}>Back to Welcome Page</button>
          <button onClick={directToLoginPage}>Log In</button>
        </div>
      </div>
    </>
  );
}

export default SignUpContainer;

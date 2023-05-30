import React, { useState, useEffect, useCallback } from 'react';
import '../../stylesheets/WelcomePage.css';
import LoginContainer from './LoginContainer.js';
import SignUpContainer from './SignupContainer.js';
import PageSelector from '../pageSelector/PageSelector.js';
import axios from 'axios';

function WelcomePage() {
  const [currentPage, setcurrentPage] = useState('welcome');
  const [sessionActive, setSessionActive] = useState({ loggedIn: false, username: '', email: '' });

  const updateSession = useCallback((data) => {
    setSessionActive(data);
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8000/users/session')
      .then((res) => {
        updateSession(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [updateSession]);

  if (currentPage === 'login') {
    return (
      <>
        {sessionActive.loggedIn ? (
          <PageSelector
            currentPage={'questions'}
            welcomePage={setcurrentPage}
            sessionActive={sessionActive}
            updateSession={updateSession}
          />
        ) : (
          <LoginContainer updatePage={setcurrentPage} />
        )}
      </>
    );
  }
  if (currentPage === 'signup') {
    return (
      <>
        {sessionActive.loggedIn ? (
          <PageSelector
            currentPage={'questions'}
            welcomePage={setcurrentPage}
            sessionActive={sessionActive}
            updateSession={updateSession}
          />
        ) : (
          <SignUpContainer updatePage={setcurrentPage} />
        )}
      </>
    );
  }
  if (currentPage === 'guest') {
    return (
      <div>
        <PageSelector
          currentPage={'questions'}
          welcomePage={setcurrentPage}
          sessionActive={sessionActive}
          updateSession={updateSession}
        />
      </div>
    );
  }

  function directToLoginForm() {
    setcurrentPage('login');
  }

  function directToSignUpForm() {
    setcurrentPage('signup');
  }

  function directAsGuest() {
    setcurrentPage('guest');
  }

  return (
    <>
      <div className="wp-main-div"></div>
      <div className="centered">
        <h1 className="wp-h1">Fake Stackoverflow</h1>
        <div className="wp-button-container">
          <button disabled={sessionActive.loggedIn} onClick={directToSignUpForm}>
            Sign Up | new user |{' '}
          </button>
          <button disabled={sessionActive.loggedIn} onClick={directToLoginForm}>
            Log In | existing user |{' '}
          </button>
          <button onClick={directAsGuest}>
            {sessionActive.loggedIn ? `Welcome back ${sessionActive.username}` : 'Continue as Guest'}
          </button>
        </div>
      </div>
    </>
  );
}

export default WelcomePage;

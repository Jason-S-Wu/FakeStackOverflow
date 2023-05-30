import React, { useEffect } from 'react';
import axios from 'axios';
import '../../stylesheets/Header.css';

function Header({ setSearch, updatePage, updateSession, currentSession, welcomePage }) {
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

  function searchQuestion(e) {
    if (e.key === 'Enter') {
      setSearch({ tagSearch: false, search: e.target.value });
      updatePage('questions');
      e.target.value = '';
    }
  }

  function headerButtonClicked() {
    if (currentSession.loggedIn) {
      axios
        .post('http://localhost:8000/users/logout')
        .then(() => {
          updateSession({ loggedIn: false, username: '', email: '' });
          welcomePage('welcome');
        })
        .catch(() => {
          // "The application should give appropriate feedback to the user if the log out failed."
          // This is the bare minimum. 😂
          alert('Error logging out');
        });
    } else {
      updateSession({ loggedIn: false, username: '', email: '' });
      welcomePage('login');
    }
  }
  return (
    <div id="header" className="header">
      <div id="header-button-div">
        <button onClick={headerButtonClicked}>{currentSession.loggedIn ? 'Log Out' : 'Log In'}</button>
      </div>
      <div id="header-title-div">
        <a
          id="header-title"
          href="/"
          onClick={() => {
            return false;
          }}
        >
          Fake Stack Overflow
        </a>
      </div>
      <div id="header-search-div">
        <input
          id="header-search"
          onKeyUp={(e) => searchQuestion(e)}
          type="text"
          name="search"
          placeholder="Search..."
        />
      </div>
    </div>
  );
}

export default Header;

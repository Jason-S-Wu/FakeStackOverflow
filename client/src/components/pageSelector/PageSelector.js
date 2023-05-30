import React, { useState } from 'react';
import '../../stylesheets/NavBar.css';
import MainPage from '../mainPage/MainPage';
import Header from '../header/Header';

function NavBar({ currentPage, welcomePage, sessionActive, updateSession }) {
  const [selectedNav, setSelectedNav] = useState(currentPage || 'none');
  const [currentSearch, setSearch] = useState({ tagSearch: false, search: '' });

  const updateSelectedNav = (navValue) => {
    setSelectedNav(navValue);
  };

  const updateSearch = (searchValue) => {
    setSearch(searchValue);
  };

  function navQuestionClick() {
    setSelectedNav('questions');
    setSearch({ tagSearch: false, search: '' });
  }

  function navTagsClick() {
    setSelectedNav('tags');
    setSearch({ tagSearch: false, search: '' });
  }

  function navUserClick() {
    setSelectedNav('user');
    setSearch({ tagSearch: false, search: '' });
  }

  return (
    <div>
      <Header
        setSearch={updateSearch}
        updatePage={updateSelectedNav}
        updateSession={updateSession}
        currentSession={sessionActive}
        welcomePage={welcomePage}
      />
      <div id="nav-main-div">
        <div id="nav" className={'nav'}>
          <button
            id="nav-questions"
            onClick={navQuestionClick}
            className={'nav-button'}
            style={{
              backgroundColor: selectedNav === 'questions' ? 'lightgray' : 'whitesmoke',
            }}
          >
            Questions
          </button>
          <button
            id="nav-tags"
            onClick={navTagsClick}
            className={'nav-button'}
            style={{ backgroundColor: selectedNav === 'tags' ? 'lightgray' : 'whitesmoke' }}
          >
            Tags
          </button>
          <button
            id="nav-tags"
            onClick={navUserClick}
            className={'nav-button'}
            style={{ backgroundColor: selectedNav === 'user' ? 'lightgray' : 'whitesmoke' }}
          >
            User
          </button>
        </div>
        <MainPage
          currentPage={selectedNav}
          updatePage={updateSelectedNav}
          setSearch={updateSearch}
          currentSearch={currentSearch}
          currentSession={sessionActive}
        />
      </div>
    </div>
  );
}

export default NavBar;

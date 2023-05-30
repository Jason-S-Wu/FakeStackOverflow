import { useState, useEffect } from 'react';
import '../../stylesheets/TagsPage.css';
import TagsWrapper from './TagsWrapper';
import axios from 'axios';

function TagsPage({ updatePage, setSearch, currentSession, userTags, username, userid }) {
  const [tagsObj, setTagsObj] = useState([]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (userTags) {
      setTagsObj(userTags);
      return () => {
        source.cancel('Component unmounted');
      };
    }
    axios
      .get(`http://localhost:8000/posts/tags`, {
        cancelToken: source.token,
      })
      .then((res) => {
        setTagsObj(res.data);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request cancelled:', err.message);
        } else {
          console.log('Request failed:', err.message);
        }
        setTagsObj('An error occurred while fetching tags from the server. Please try again later.');
      });

    return () => {
      source.cancel('Component unmounted');
    };
  }, [userTags]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function showError() {
    return (
      <h1 id="tags-error-message">
        An error occurred while fetching tags from the server. Please try again later.<br></br>
        <br></br>
        <div onClick={() => window.location.reload(false)}>Return to Welcome Page</div>
      </h1>
    );
  }

  function askButtonSownIfLogin() {
    if (currentSession.loggedIn) {
      return (
        <button id="main-ask" onClick={() => updatePage('ask-question')}>
          Ask Question
        </button>
      );
    }
    return <></>;
  }

  return (
    <div>
      <div id="upper-main-tags">
        <div id="top-upper-main-tags">
          <h1 id="top-upper-main-title-tags">{userTags ? `All Tags Created By ${username}` : 'All Tags'}</h1>
          {askButtonSownIfLogin()}
          <h1 id="number-of-tags">
            {' '}
            {tagsObj === 'An error occurred while fetching tags from the server. Please try again later.'
              ? 0
              : tagsObj.length}{' '}
            Tags
          </h1>
        </div>
      </div>
      <div id="lower-main">
        <div id="tags-wrapper-div">
          {tagsObj === 'An error occurred while fetching tags from the server. Please try again later.' ? (
            showError()
          ) : (
            <TagsWrapper
              updatePage={updatePage}
              setSearch={setSearch}
              tags={tagsObj}
              username={username}
              userid={userid}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TagsPage;

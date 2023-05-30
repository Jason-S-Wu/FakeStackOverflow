import React, { useState, useEffect } from 'react';
import '../../stylesheets/QuestionsPage.css';
import QuestionContainers from './QuestionContainers';
import axios from 'axios';

function QuestionsPage({ updatePage, currentSearch, currentSession, questions, username, userid }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [questionSortMode, setQuestionSortMode] = useState('latest');
  const [questionsList, setQuestionsList] = useState([]);
  const numberOfQuestions = () => {
    if (typeof questionsList === 'string') {
      return 0;
    } else {
      return questionsList.length;
    }
  };

  useEffect(() => {
    if (username) {
      setQuestionsList(questions);
    } else {
      questionsBasedOnMode(questionSortMode, currentSearch).then((res) => {
        setQuestionsList(() => res);
      });
    }
  }, [currentSearch, questionSortMode, username, questions]);

  function questionsBasedOnMode(questionSortMode, currentSearch) {
    if (currentSearch.search !== '') {
      let encodedSearch = encodeURIComponent(currentSearch.search);
      if (questionSortMode === 'latest') {
        return axios
          .get(`http://localhost:8000/posts/questions/search/${encodedSearch}`)
          .then(async (res) => {
            const questions = res.data;
            const promises = questions.map((question) => {
              return axios.get(`http://localhost:8000/users/getUsername/${question.asked_by}`).then((res) => {
                question.username = res.data;
                return question;
              });
            });
            const results = await Promise.all(promises);
            return results;
          })
          .catch((err) => {
            console.log(err);
            return 'error';
          });
      }
      if (questionSortMode === 'active') {
        return axios
          .get(`http://localhost:8000/posts/questions/active/${encodedSearch}`)
          .then(async (res) => {
            const questions = res.data;
            const promises = questions.map((question) => {
              return axios.get(`http://localhost:8000/users/getUsername/${question.asked_by}`).then((res) => {
                question.username = res.data;
                return question;
              });
            });

            const results = await Promise.all(promises);
            return results;
          })
          .catch((err) => {
            console.log(err);
            return 'error';
          });
      }
      if (questionSortMode === 'unanswered') {
        return axios
          .get(`http://localhost:8000/posts/questions/unanswered/${encodedSearch}`)
          .then(async (res) => {
            const questions = res.data;
            const promises = questions.map((question) => {
              return axios.get(`http://localhost:8000/users/getUsername/${question.asked_by}`).then((res) => {
                question.username = res.data;
                return question;
              });
            });
            const results = await Promise.all(promises);
            return results;
          })
          .catch((err) => {
            console.log(err);
            return 'error';
          });
      }
    }
    if (questionSortMode === 'unanswered') {
      return axios
        .get('http://localhost:8000/posts/questions/unanswered')
        .then(async (res) => {
          const questions = res.data;
          const promises = questions.map((question) => {
            return axios.get(`http://localhost:8000/users/getUsername/${question.asked_by}`).then((res) => {
              question.username = res.data;
              return question;
            });
          });
          const results = await Promise.all(promises);
          return results;
        })
        .catch(() => {
          return 'error';
        });
    }
    if (questionSortMode === 'active') {
      return axios
        .get('http://localhost:8000/posts/questions/active')
        .then(async (res) => {
          const questions = res.data;
          const promises = questions.map((question) => {
            return axios.get(`http://localhost:8000/users/getUsername/${question.asked_by}`).then((res) => {
              question.username = res.data;
              return question;
            });
          });
          const results = await Promise.all(promises);
          return results;
        })
        .catch(() => {
          return 'error';
        });
    }
    if (questionSortMode === 'latest') {
      return axios
        .get('http://localhost:8000/posts/questions/newest')
        .then(async (res) => {
          const questions = res.data;
          const promises = questions.map((question) => {
            return axios.get(`http://localhost:8000/users/getUsername/${question.asked_by}`).then((res) => {
              question.username = res.data;
              return question;
            });
          });
          const results = await Promise.all(promises);
          return results;
        })
        .catch(() => {
          return 'error';
        });
    }
  }

  function displayQuestions() {
    if (questionsList === 'error') {
      return (
        <h1 id="questions-error-message">
          An error occurred while fetching questions from the server. Please try again later.<br></br>
          <br></br>
          <div onClick={() => window.location.reload(false)}>Return to Welcome Page</div>
        </h1>
      );
    }
    return (
      <QuestionContainers
        questions={questionsList}
        updatePage={updatePage}
        userSession={currentSession}
        username={username}
        userid={userid}
      />
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

  function sortByButton() {
    if (username) {
      return null;
    }
    return (
      <>
        <button
          id="main-unanswered"
          onClick={() => {
            setQuestionSortMode(() => 'unanswered');
          }}
        >
          Unanswered
        </button>

        <button
          id="main-active"
          onClick={() => {
            setQuestionSortMode(() => 'active');
          }}
        >
          Active
        </button>

        <button
          id="main-newest"
          onClick={() => {
            setQuestionSortMode(() => 'latest');
          }}
        >
          Newest
        </button>
      </>
    );
  }
  const tagSearchResult = currentSearch.tagSearch
    ? `All Questions With Tag: ${currentSearch.search.slice(1, -1)}`
    : 'Search Results';
  return (
    <div>
      <div id="upper-main">
        <div id="top-upper-main">
          <h1 id="top-upper-main-title">
            {username
              ? `All Questions Answered By ${username}`
              : currentSearch.search === ''
              ? 'All Questions'
              : tagSearchResult}
          </h1>
          {askButtonSownIfLogin()}
        </div>
        <div id="bottom-upper-main">
          <h3 id="number-of-questions">
            {numberOfQuestions()} question{numberOfQuestions() > 1 ? 's' : ''}
          </h3>
          {sortByButton()}
        </div>
      </div>
      <div id="lower-main">{displayQuestions()}</div>
    </div>
  );
}

export default QuestionsPage;

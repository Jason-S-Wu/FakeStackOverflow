import axios from 'axios';
import '../../stylesheets/UsersPage.css';
import generateDate from '../utils/generateDate';
import { getTagById } from '../utils/generateHtmlForTags';
import React, { useState, useEffect } from 'react';

function UserContainer({ userid, updatePage }) {
  const [user, setUser] = useState({});
  const [questions, setQuestions] = useState([]);
  const [showWarningQuestion, setShowWarningQuestion] = useState({ warning: false, questionId: '' });

  useEffect(() => {
    axios.get(`http://localhost:8000/users/getUserData/${userid}`).then(async (res) => {
      setUser(res.data);
    });
    axios.get(`http://localhost:8000/posts/questions/byUser/${userid}`).then(async (res) => {
      setQuestions(res.data);
    });
  }, [userid]);

  function getTimeElapsedString(date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 1000) {
      // less than a second
      return 'Just now';
    } else if (diff < 60 * 1000) {
      // less than a minute
      const seconds = Math.floor(diff / 1000);
      return `${seconds} second${seconds === 1 ? '' : 's'}`;
    } else if (diff < 60 * 60 * 1000) {
      // less than an hour
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      // less than a day
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    } else {
      // more than a day
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days} day${days === 1 ? '' : 's'}`;
    }
  }

  return (
    <>
      <div id="upper-main">
        <div className="user-top-container">
          <div className="user-header">
            <h1>User Profile for user: {user.username}</h1>
          </div>
          <div className="user-header">
            <h2>Member for {getTimeElapsedString(new Date(user.created_at))}</h2>
          </div>
          <div className="user-header">
            <h3>Reputation Score: {user.reputation}</h3>
          </div>
        </div>
      </div>
      <div id="lower-main">
        <div className="user-all-questions-container">
          <h2 className="user-page-heading-title">
            {questions.length === 0
              ? `No questions found for ${user.username}`
              : `All questions ${user.username} has posted`}
          </h2>
          {questions.length === 0
            ? null
            : questions.map((question) => {
                function handleDeleteClick() {
                  if (showWarningQuestion.warning) {
                    deleteQuestion();
                  } else {
                    setShowWarningQuestion({ warning: true, questionId: question._id });
                  }
                }
                function handleCancelClick() {
                  setShowWarningQuestion({ warning: false, questionId: '' });
                }
                function deleteQuestion() {
                  const questionIdToDel = showWarningQuestion.questionId;
                  axios
                    .delete(`http://localhost:8000/posts/questions/deleteQuestion/${questionIdToDel}`)
                    .then((res) => {
                      if (res.data === 'success') {
                        const newQuestions = questions.filter((question) => question._id !== questionIdToDel);
                        setQuestions(newQuestions);
                        setShowWarningQuestion({ warning: false, questionId: '' });
                      } else {
                        alert('Error deleting question');
                      }
                    });
                }
                return (
                  <div key={question._id} className="question-container">
                    <div className="question-content-div">
                      <div id="question-content-div-top">
                        <h2
                          id={question._id}
                          onClick={async () => {
                            const tags = await Promise.all(question.tags.map((tagId) => getTagById(tagId)));
                            question.tags = tags.join(' ');
                            updatePage({ currentPage: 'ask-question', questionEdit: question });
                          }}
                        >
                          {question.title}
                        </h2>
                      </div>
                    </div>
                    <div className="question-metadata-div">
                      <h5>asked {generateDate(question.ask_date_time, new Date())} </h5>
                    </div>
                    <button id="user-self-delete-button" onClick={handleDeleteClick}>
                      Delete
                    </button>
                    {showWarningQuestion.questionId === question._id && ( // move the warning div here
                      <div className="warning">
                        <p>Are you sure you want to delete this question?</p>
                        <button onClick={deleteQuestion}>Delete Question</button>
                        <button onClick={handleCancelClick}>Cancel</button>
                      </div>
                    )}
                  </div>
                );
              })}
        </div>
        <button
          className="user-bottom-button"
          onClick={async () => {
            const res = await axios.get(`http://localhost:8000/posts/tags/getUser/${userid}`);
            updatePage({ currentPage: 'tags', tags: res.data, username: user.username, userid: userid });
          }}
        >
          All Tags Created By {user.username}{' '}
        </button>
        <button
          className="user-bottom-button"
          onClick={async () => {
            const res = await axios.get(`http://localhost:8000/posts/answers/getQuestionsAnswered/${userid}`);
            updatePage({ currentPage: 'questions', questions: res.data, username: user.username, userid: userid });
          }}
        >
          All Questions that Contain Answers By {user.username}{' '}
        </button>
      </div>
    </>
  );
}

export default UserContainer;

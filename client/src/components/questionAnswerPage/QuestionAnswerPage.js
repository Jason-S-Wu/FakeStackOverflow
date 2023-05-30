import React, { useEffect, useState } from 'react';
import '../../stylesheets/QuestionAnswerPage.css';
import GenerateHtmlForTags from '../utils/generateHtmlForTags';
import AnswerContainers from './AnswerContainers';
import parseContent from '../utils/parseContent';
import generateDate from '../utils/generateDate';
import axios from 'axios';

function QuestionAnswerPage({ updatePage, qid, currentSession, username, userid }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [question, setQuestion] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:8000/posts/questions/${qid}`)
      .then(async (res) => {
        const question = res.data;
        const username = await axios.get(`http://localhost:8000/users/getUsername/${question.asked_by}`);
        question.username = username.data;
        setQuestion(question);
      })
      .catch(() => {
        alert('Error getting question');
      });
  }, [qid, updatePage]);

  if (Object.keys(question).length === 0) {
    return <div>Loading...</div>;
  }

  const answers = question.answers;

  function ansButtonSownIfLogin() {
    if (currentSession.loggedIn) {
      return (
        <button
          className="ans-main-answer"
          onClick={() => {
            updatePage({ currentPage: 'reply-to-question', qid: question._id });
          }}
        >
          Answer Question
        </button>
      );
    }
    return <></>;
  }

  return (
    <div>
      <div id="upper-main-Answers">
        <div id="top-upper-mainAns">
          <h3 id="top-upper-main-numAns">{answers.length} answers</h3>
          <h1 id="top-upper-main-title">{question.title}</h1>
          <div id="top-upper-main-ask">
            <div id="top-upper-main-votes">{question.votes} votes</div>
          </div>
        </div>
        <div id="bottom-upper-mainAns">
          <h3 id="top-upper-main-numViews">{question.views} views</h3>
          <p id="top-upper-main-questionContent">{parseContent(question.text)}</p>
          <div id="question-content-div-bottom">
            <GenerateHtmlForTags tagIds={question.tags} qid={question._id} />
          </div>
          <div className="top-upper-main-QAskedBy">
            <h4 id={question.asked_by}>{question.username}&nbsp;</h4>
            <h5>asked {generateDate(question.ask_date_time, new Date())} </h5>
          </div>
        </div>
      </div>
      <div id="lower-main-Answers">
        <AnswerContainers
          question_id={qid}
          updatePage={updatePage}
          userSession={currentSession}
          username={username}
          userid={userid}
        />
        <div className="answer-container-last">{ansButtonSownIfLogin()}</div>
      </div>
    </div>
  );
}

export default QuestionAnswerPage;

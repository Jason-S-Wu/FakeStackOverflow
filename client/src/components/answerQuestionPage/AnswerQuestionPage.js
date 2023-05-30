import React, { useState, useEffect } from 'react';
import '../../stylesheets/AnswerQuestionPage.css';
import validateHyperLinks from '../utils/validateHyperLinks';
import axios from 'axios';

function AnswerQuestionPage({ updatePage, qid, username, userid, aid, text }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [hasError, setHasError] = useState(null);
  const [answer, setAnswer] = useState('');

  const setAnswerContent = (e) => {
    setAnswer(e.target.value.trim());
  };

  const validateAnswer = (qid) => {
    let newStateHasError = null;

    if (answer.length === 0) {
      newStateHasError = '*Answer field cannot be empty';
    } else {
      let foundError = validateHyperLinks(answer);
      if (foundError) {
        newStateHasError =
          '*Constraints violated. The target of a hyperlink, that is, the stuff within () cannot be empty and must begin with “https://” or “http://”.';
      }
    }

    setHasError(newStateHasError);

    if (newStateHasError === null) {
      let newAnswer = {
        qid: qid,
        text: `${answer}`,
        ans_by: userid,
      };

      if (username) {
        axios.put('http://localhost:8000/posts/answers/editAnswer/' + aid, newAnswer).then(() => {
          updatePage({
            currentPage: 'question-answer-user',
            qid: qid,
            username: username,
            userid: userid,
          });
        });
      } else {
        axios.post('http://localhost:8000/posts/answers/answerQuestion', newAnswer).then(() => {
          updatePage({ currentPage: 'question-answer', qid: qid });
        });
      }
    }
  };

  return (
    <div id="ask-question">
      <h2>Answer Text*</h2>
      <label htmlFor="content">Write answer here</label>
      <textarea
        onChange={(e) => setAnswerContent(e)}
        id="ans-new-content"
        name="content"
        defaultValue={username ? text : ''}
      ></textarea>
      <br />
      <br />
      <label htmlFor="title" className="new-q-error" id="ans-content-error">
        {hasError === null ? '' : hasError}
      </label>
      <input
        type="submit"
        className="submit-question"
        id={qid}
        value="Post Answer"
        onClick={() => validateAnswer(qid)}
      />
      <h3>* indicates mandatory fields</h3>
    </div>
  );
}

export default AnswerQuestionPage;

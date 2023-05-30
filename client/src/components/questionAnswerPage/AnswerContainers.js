import parseContent from '../utils/parseContent';
import generateDate from '../utils/generateDate';
import CommentContainer from './CommentContainer';
import axios from 'axios';
import { useState, useEffect } from 'react';

function AnswerContainers({ question_id, updatePage, userSession, username, userid }) {
  const [answerListObj, setAnswerListObj] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const answersPerPage = 5;
  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  let currentanswers = answerListObj.slice(indexOfFirstAnswer, indexOfLastAnswer);
  const totalPages = Math.ceil(answerListObj.length / answersPerPage);

  useEffect(() => {
    axios.get(`http://localhost:8000/posts/answers/${question_id}`).then(async (res) => {
      const answers = res.data;
      const promises = answers.map(async (answer) => {
        const res = await axios.get(`http://localhost:8000/users/getUsername/${answer.ans_by}`);
        answer.username = res.data;
        return answer;
      });
      let results = await Promise.all(promises);
      if (username) {
        let matchingElements = results.filter((element) => element.ans_by === userid);
        let nonMatchingElements = results.filter((element) => element.ans_by !== userid);
        results = matchingElements.concat(nonMatchingElements);
      }
      setAnswerListObj([...results]);
    });
  }, [question_id, username, userid]);

  function handleNextClick() {
    setCurrentPage((currentPage) => {
      if (currentPage === totalPages) {
        return 1;
      } else {
        return currentPage + 1;
      }
    });
  }

  function handleBackClick() {
    setCurrentPage((currentPage) => currentPage - 1);
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function upVoteButtonClicked(answer) {
    if (userSession.reputation && userSession.reputation >= 50) {
      let userAlreadyVoted = answer.voters.filter((voter) => voter.userVoted === userSession.userId);
      if (userAlreadyVoted && userAlreadyVoted.direction !== 1) {
        await axios.patch(`http://localhost:8000/posts/answers/incrementVotes/${answer._id}/${userSession.userId}`);
        updatePage(() => 'loading');
        await sleep(10);
        updatePage({ currentPage: 'question-answer', qid: question_id });
      }
    }
  }

  async function downVoteButtonClicked(answer) {
    if (userSession.reputation && userSession.reputation >= 50) {
      let userAlreadyVoted = answer.voters.filter((voter) => voter.userVoted === userSession.userId);
      if (userAlreadyVoted && userAlreadyVoted.direction !== -1) {
        await axios.patch(`http://localhost:8000/posts/answers/decrementVotes/${answer._id}/${userSession.userId}`);
        updatePage(() => 'loading');
        await sleep(10);
        updatePage({ currentPage: 'question-answer', qid: question_id });
      }
    }
  }

  function renderPagination() {
    return (
      <div className="pagination">
        <button className="pagination-button" disabled={currentPage === 1} onClick={handleBackClick}>
          Back
        </button>
        <button className="pagination-button" disabled={totalPages <= 1} onClick={handleNextClick}>
          Next
        </button>
      </div>
    );
  }

  const [deleteAnswer, setDeleteAnswer] = useState({ answer_id: '', delete: false });

  const answerList = currentanswers.map((element) => {
    function renderDeleteAndEditButton() {
      if (element.ans_by === userid) {
        return (
          <div className="delete-edit-button-container">
            <button
              className="delete-button"
              onClick={() => {
                setDeleteAnswer({ answer_id: element._id, delete: true });
              }}
            >
              Delete
            </button>
            <button
              className="edit-button"
              onClick={() => {
                updatePage({
                  currentPage: 'reply-to-question-user',
                  qid: question_id,
                  aid: element._id,
                  userid: userid,
                  username: username,
                  text: element.text,
                });
              }}
            >
              Edit
            </button>
          </div>
        );
      }
    }

    function createDeleteWarn() {
      return (
        <div className="delete-warning-container">
          <h3>Are you sure you want to delete this answer?</h3>
          <button onClick={handleDelete}>Yes</button>
          <button onClick={handleCancel}>No</button>
        </div>
      );
    }

    async function handleDelete() {
      axios.delete(`http://localhost:8000/posts/answers/deleteAnswer/${deleteAnswer.answer_id}`);
      updatePage(() => 'loading');
      await sleep(10);
      updatePage({ currentPage: 'question-answer-user', qid: question_id, userid: userid, username: username });
    }

    function handleCancel() {
      setDeleteAnswer({ answer_id: '', delete: false });
    }

    let timeNow = new Date();
    return (
      <div key={element._id} className="answer-container">
        <div className="vote-container">
          <button
            disabled={!userSession.loggedIn || userSession.reputation < 50 || userSession.userId === element.ans_by}
            onClick={() => upVoteButtonClicked(element)}
            className="upvote-button"
          >
            Upvote
          </button>
          <div className="vote-counter">{element.votes}</div>
          <button
            disabled={!userSession.loggedIn || userSession.reputation < 50 || userSession.userId === element.ans_by}
            onClick={() => downVoteButtonClicked(element)}
            className="downvote-button"
          >
            Downvote
          </button>
        </div>
        <div className="answer-content-div">
          <p>{parseContent(element.text)}</p>
        </div>
        <div className="answer-metadata-div">
          {renderDeleteAndEditButton()}
          {element._id === deleteAnswer.answer_id ? createDeleteWarn() : null}
          <h4 id={element.ans_by}>{element.username}&nbsp;</h4>
          <h5>asked {generateDate(element.ans_date_time, timeNow)} </h5>
        </div>
        <hr></hr>
        <CommentContainer
          question_id={question_id}
          answer_id={element._id}
          updatePage={updatePage}
          userSession={userSession}
        />
      </div>
    );
  });
  return (
    <>
      {answerList} {renderPagination()}
    </>
  );
}

export default AnswerContainers;

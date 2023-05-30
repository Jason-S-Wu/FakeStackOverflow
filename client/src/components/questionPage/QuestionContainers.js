import generateDate from '../utils/generateDate';
import GenerateHtmlForTags from '../utils/generateHtmlForTags';
import CommentContainer from './CommentContainer';
import axios from 'axios';
import React, { useState } from 'react';

function QuestionContainers({ questions, updatePage, userSession, username, userid }) {
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

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

  if (currentQuestions.length === 0) {
    return (
      <div id="no-question-found">
        <h1>No questions found</h1>
      </div>
    );
  }

  function writeSummaryIfExist(question) {
    if (question.summary) {
      return <p>{question.summary}</p>;
    }
    return null;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function upVoteButtonClicked(question) {
    if (userSession.reputation && userSession.reputation >= 50) {
      let userAlreadyVoted = question.voters.filter((voter) => voter.userVoted === userSession.userId);
      if (userAlreadyVoted && userAlreadyVoted.direction !== 1) {
        await axios.patch(`http://localhost:8000/posts/questions/incrementVotes/${question._id}/${userSession.userId}`);
        updatePage(() => 'loading');
        await sleep(10);
        updatePage(() => 'questions');
      }
    }
  }

  async function downVoteButtonClicked(question) {
    if (userSession.reputation && userSession.reputation >= 50) {
      let userAlreadyVoted = question.voters.filter((voter) => voter.userVoted === userSession.userId);
      if (userAlreadyVoted && userAlreadyVoted.direction !== -1) {
        await axios.patch(`http://localhost:8000/posts/questions/decrementVotes/${question._id}/${userSession.userId}`);
        updatePage(() => 'loading');
        await sleep(10);
        updatePage(() => 'questions');
      }
    }
  }

  const questionsList = currentQuestions.map((question) => {
    return (
      <div key={question._id} className="question-container">
        <div className="vote-container">
          <button
            disabled={!userSession.loggedIn || userSession.reputation < 50 || userSession.userId === question.asked_by}
            onClick={() => upVoteButtonClicked(question)}
            className="upvote-button"
          >
            Upvote
          </button>
          <div className="vote-counter">{question.votes}</div>
          <button
            disabled={!userSession.loggedIn || userSession.reputation < 50 || userSession.userId === question.asked_by}
            onClick={() => downVoteButtonClicked(question)}
            className="downvote-button"
          >
            Downvote
          </button>
        </div>
        <div className="question-ans-views-div">
          <h6>{question.answers.length} answers</h6>
          <h6>{question.views} views</h6>
        </div>
        <div className="question-content-div">
          <div id="question-content-div-top">
            <h2
              id={question._id}
              onClick={async () => {
                if (username) {
                  updatePage({
                    currentPage: 'question-answer-user',
                    qid: question._id,
                    username: username,
                    userid: userid,
                  });
                } else {
                  await axios
                    .patch('http://localhost:8000/posts/questions/incrementViews/' + question._id)
                    .catch(() => alert('An Error Occurred'));
                  updatePage({ currentPage: 'question-answer', qid: question._id });
                }
              }}
            >
              {question.title}
            </h2>
            {writeSummaryIfExist(question)}
            <GenerateHtmlForTags tagIds={question.tags} qid={question._id} />
          </div>
        </div>
        <div className="question-metadata-div">
          <h4 id={question.asked_by}>{question.username}&nbsp;</h4>
          <h5>asked {generateDate(question.ask_date_time, new Date())} </h5>
        </div>
        <hr></hr>
        <CommentContainer question_id={question._id} updatePage={updatePage} userSession={userSession} />
      </div>
    );
  });

  function renderPagination() {
    return (
      <div className="pagination">
        <button className="pagination-button" disabled={currentPage === 1} onClick={handleBackClick}>
          Back
        </button>
        <button className="pagination-button" onClick={handleNextClick}>
          Next
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="all-question-containers">{questionsList}</div>
      {renderPagination()}
    </>
  );
}

export default QuestionContainers;

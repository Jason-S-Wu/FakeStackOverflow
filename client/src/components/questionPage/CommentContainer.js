import axios from 'axios';
import parseContent from '../utils/parseContent';
import React, { useState, useEffect } from 'react';

function CommentContainer({ question_id, updatePage, userSession }) {
  const [commentListObj, setCommentListObj] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 3;
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentcomments = commentListObj.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(commentListObj.length / commentsPerPage);

  useEffect(() => {
    axios.get(`http://localhost:8000/posts/questions/comments/${question_id}`).then(async (res) => {
      const comments = res.data;
      const promises = comments.map(async (comment) => {
        const res = await axios.get(`http://localhost:8000/users/getUsername/${comment.com_by}`);
        comment.username = res.data;
        return comment;
      });
      const results = await Promise.all(promises);
      setCommentListObj([...results]);
    });
  }, [question_id]);

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

  async function upVoteButtonClicked(comment) {
    let userAlreadyVoted = comment.voters.filter((voter) => voter.userVoted === userSession.userId);
    if (userAlreadyVoted && userAlreadyVoted.direction !== 1) {
      await axios.patch(
        `http://localhost:8000/posts/questions/comments/incrementVotes/${comment._id}/${userSession.userId}`
      );
      updatePage(() => 'loading');
      await sleep(10);
      updatePage(() => 'questions');
    }
  }

  function renderPagination() {
    if (currentcomments.length === 0) return;
    return (
      <div className="pagination-comments">
        <button className="pagination-button" disabled={currentPage === 1} onClick={handleBackClick}>
          Back
        </button>
        <button className="pagination-button" disabled={totalPages <= 1} onClick={handleNextClick}>
          Next
        </button>
      </div>
    );
  }

  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

  async function addCommentToQuestion(commentText) {
    const commentType = 'question';
    const toId = question_id;
    const com_by = userSession.userId;
    const newComment = {
      text: commentText,
      com_by: com_by,
      commentType: commentType,
      toId: toId,
    };
    const res = await axios.post('http://localhost:8000/posts/comments/addComment', newComment);
    if (res.data === 'success') {
      setCommentText('');
      setCommentError('');
      updatePage(() => 'loading');
      await sleep(10);
      updatePage(() => 'questions');
    }
    if (res.data === 'User reputation too low') {
      setCommentError('You cannot make a comment because your reputation is lower than 50');
    }
    if (res.data === 'Comment must be between 1 and 140 characters') {
      setCommentError('Comment must be between 1 and 140 characters');
    }
  }

  function renderNewCommentInput() {
    if (!userSession.loggedIn) return;
    const handleCommentTextChange = (event) => {
      setCommentText(event.target.value);
    };

    const handleAddCommentClick = () => {
      addCommentToQuestion(commentText);
    };

    return (
      <div className="new-comment-input">
        <textarea
          className="new-comment-textarea"
          placeholder="Add a comment"
          value={commentText}
          onChange={handleCommentTextChange}
        />
        <button className="new-comment-button" onClick={handleAddCommentClick}>
          Add Comment
        </button>
        <div className="comment-error">{commentError}</div>
      </div>
    );
  }

  const commentList = currentcomments.map((element) => {
    return (
      <div key={element._id} className="comment-container">
        <div className="vote-container">
          <button
            disabled={!userSession.loggedIn || userSession.userId === element.com_by}
            onClick={() => upVoteButtonClicked(element)}
            className="upvote-button"
          >
            Upvote
          </button>
          <div className="vote-counter">{element.votes}</div>
        </div>
        <div className="comment-content-div">
          <p>{parseContent(element.text)}</p>
        </div>
        <div className="comment-metadata-div">
          <h4 id={element.com_by}>commented By {element.username}&nbsp;</h4>
        </div>
      </div>
    );
  });
  return (
    <>
      {commentList} {renderNewCommentInput()} {renderPagination()}
    </>
  );
}

export default CommentContainer;

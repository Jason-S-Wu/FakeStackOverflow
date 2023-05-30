import React, { useEffect, useState } from 'react';
import '../../stylesheets/AskQuestionPage.css';
import validateHyperLinks from '../utils/validateHyperLinks';
import axios from 'axios';

function AskQuestionPage({ updatePage, currentSession, editInfo }) {
  const [hasError, setHasError] = useState({
    title: false,
    summary: null,
    content: null,
    tags: null,
    userId: false,
  }); // tags is null if no error, otherwise it is a string with the error message

  const [question, setQuestion] = useState({
    title: '',
    summary: '',
    content: '',
    tags: '',
    userId: currentSession.userId,
  });

  useEffect(() => {
    if (editInfo) {
      setQuestion({
        title: editInfo.title,
        summary: editInfo.summary,
        content: editInfo.text,
        tags: editInfo.tags,
        userId: currentSession.userId,
      });
    }
  }, [editInfo, currentSession]);

  const setQuestionTitle = (e) => {
    setQuestion({ ...question, title: e.target.value.trim() });
  };

  const setQuestionContent = (e) => {
    setQuestion({ ...question, content: e.target.value.trim() });
  };

  const setQuestionTags = (e) => {
    setQuestion({ ...question, tags: e.target.value.trim() });
  };

  // const setQuestionuserId = (e) => {
  //   setQuestion({ ...question, userId: e.target.value.trim() });
  // };

  const setQuestionSummary = (e) => {
    setQuestion({ ...question, summary: e.target.value.trim() });
  };

  const validateQuestion = () => {
    let newStateHasError = { title: false, summary: null, content: null, tags: null, userId: false };
    let tags = question.tags.toLowerCase().split(' ');
    tags = tags.filter((tag) => tag.trim() !== '');
    if (tags.length === 0) {
      newStateHasError = { ...newStateHasError, tags: '*Question must have at least one tag' };
    }

    if (tags.length > 5) {
      newStateHasError = { ...newStateHasError, tags: '*Question cannot have more than 5 tags' };
    } else {
      for (const tag of tags) {
        if (tag.length > 10) {
          newStateHasError = { ...newStateHasError, tags: '*Tag cannot have more than 10 characters' };
        }
      }
    }

    // Check if there is a new tag and if the user's reputation is less than 50
    axios.get(`http://localhost:8000/posts/tags`, {}).then((res) => {
      let currentTagsList = res.data.map((tag) => tag.name);
      const noNewTags = tags.every((val) => currentTagsList.includes(val));
      if (currentSession.reputation < 50 && !noNewTags) {
        let newStateHasError = { title: false, summary: null, content: null, tags: null, userId: false };
        newStateHasError = {
          ...newStateHasError,
          tags: '*User must have atleast 50 reputation points to create a new tag.',
        };
        setHasError(newStateHasError);
      }
    });

    if (question.title === '') {
      newStateHasError = { ...newStateHasError, title: true };
    }

    if (question.summary === '') {
      newStateHasError = { ...newStateHasError, summary: '*Summary cannot be empty' };
    }

    if (question.summary.length > 140) {
      newStateHasError = { ...newStateHasError, summary: '*Summary cannot have more than 140 characters' };
    }

    if (question.content === '') {
      newStateHasError = { ...newStateHasError, content: '*Description field cannot be empty' };
    } else {
      let foundError = validateHyperLinks(question.content);
      if (foundError) {
        newStateHasError = {
          ...newStateHasError,
          content:
            '*Constraints violated. The target of a hyperlink, that is, the stuff within () cannot be empty and must begin with “https://” or “http://”.',
        };
      }
    }

    if (question.userId === '') {
      newStateHasError = { ...newStateHasError, userId: true };
    }

    setHasError(newStateHasError);

    if (
      !newStateHasError.title &&
      newStateHasError.summary === null &&
      newStateHasError.content === null &&
      newStateHasError.tags === null &&
      !newStateHasError.userId
    ) {
      const newQuestion = {
        title: question.title,
        summary: question.summary,
        text: question.content,
        tagNames: tags,
        askedBy: currentSession.userId,
      };

      if (!editInfo) {
        axios
          .post('http://localhost:8000/posts/questions/askQuestion', newQuestion, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((res) => {
            if (res.data.error) {
              let newStateHasError = { title: false, summary: null, content: null, tags: null, userId: false };
              newStateHasError = {
                ...newStateHasError,
                tags: '*User must have atleast 50 reputation points to create a new tag.',
              };
              setHasError(newStateHasError);
            } else {
              updatePage('questions');
            }
          });
      }

      if (editInfo) {
        axios
          .put(`http://localhost:8000/posts/questions/editQuestion/${editInfo._id}`, newQuestion, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((res) => {
            if (res.data.error) {
              let newStateHasError = { title: false, summary: null, content: null, tags: null, userId: false };
              newStateHasError = {
                ...newStateHasError,
                tags: '*User must have at least 50 reputation points to create a new tag.',
              };
              setHasError(newStateHasError);
            } else {
              updatePage('questions');
            }
          });
      }
    }
  };

  return (
    <div id="ask-question">
      <h2>Question Title*</h2>
      <label htmlFor="title">Limit title to 50 characters or less</label>
      <input
        onChange={(e) => setQuestionTitle(e)}
        type="text"
        className="new-q-input"
        id="new-title"
        name="title"
        maxLength="50"
        defaultValue={editInfo ? editInfo.title : ''}
      />
      <br />
      <br />
      <label htmlFor="title" className="new-q-error" id="title-error">
        {hasError.title ? '*Title field cannot be empty' : ''}
      </label>
      <h2>Question Summary*</h2>
      <label htmlFor="summary">Limit summary to 140 characters or less</label>
      <input
        onChange={(e) => setQuestionSummary(e)}
        type="text"
        className="new-q-input"
        id="new-summary"
        name="summary"
        maxLength="140"
        defaultValue={editInfo ? editInfo.summary : ''}
      />
      <br />
      <br />
      <label htmlFor="title" className="new-q-error" id="summary-error">
        {hasError.summary === null ? '' : hasError.summary}
      </label>

      <h2>Question Text*</h2>
      <label htmlFor="content">Add details</label>
      <textarea
        onChange={(e) => setQuestionContent(e)}
        id="new-content"
        name="content"
        defaultValue={editInfo ? editInfo.text : ''}
      ></textarea>
      <br />
      <br />
      <label htmlFor="title" className="new-q-error" id="content-error">
        {hasError.content === null ? '' : hasError.content}
      </label>
      <h2>Tags*</h2>
      <label htmlFor="tags">Add keywords separated by whitespace</label>
      <input
        onChange={(e) => setQuestionTags(e)}
        type="text"
        className="new-q-input"
        id="new-tags"
        name="tags"
        defaultValue={editInfo ? editInfo.tags : ''}
      />
      <br />
      <br />
      <label htmlFor="title" className="new-q-error" id="tags-error">
        {hasError.tags === null ? '' : hasError.tags}
      </label>
      <input type="submit" className="submit-question" value="Post Question" onClick={() => validateQuestion()} />
      <h3>* indicates mandatory fields</h3>
    </div>
  );
}

export default AskQuestionPage;

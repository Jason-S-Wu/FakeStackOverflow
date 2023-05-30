import React from 'react';
import '../../stylesheets/MainPage.css';
import QuestionsPage from '../questionPage/QuestionsPage';
import TagsPage from '../tagsPage/TagsPage';
import AskQuestionPage from '../askQuestionPage/AskQuestionPage';
import QuestionAnswerPage from '../questionAnswerPage/QuestionAnswerPage';
import AnswerQuestionPage from '../answerQuestionPage/AnswerQuestionPage';
import UserPage from '../userPage/UserPage';
import UserContainer from '../userPage/UserContainer';

function MainPage({ currentPage, updatePage, setSearch, currentSearch, currentSession }) {
  if (currentPage === 'questions') {
    return (
      <div className={'main'}>
        <QuestionsPage
          updatePage={updatePage}
          currentSearch={currentSearch}
          currentSession={currentSession}
        />
      </div>
    );
  }
  if (currentPage.currentPage === 'questions') {
    return (
      <div className={'main'}>
        <QuestionsPage
          updatePage={updatePage}
          currentSearch={currentSearch}
          currentSession={currentSession}
          questions={currentPage.questions}
          username={currentPage.username}
          userid={currentPage.userid}
        />
      </div>
    );
  }
  if (currentPage === 'tags') {
    return (
      <div className={'main'}>
        <TagsPage
          updatePage={updatePage}
          setSearch={setSearch}
          currentSession={currentSession}
        />
      </div>
    );
  }
  if (currentPage.currentPage === 'tags') {
    return (
      <div className={'main'}>
        <TagsPage
          updatePage={updatePage}
          setSearch={setSearch}
          currentSearch={currentSearch}
          currentSession={currentSession}
          userTags={currentPage.tags}
          username={currentPage.username}
          userid={currentPage.userid}
        />
      </div>
    );
  }
  if (currentPage === 'user') {
    return (
      <div className={'main'}>
        <UserPage updatePage={updatePage} currentSession={currentSession} />
      </div>
    );
  }

  if (currentPage.currentPage === 'admin-user') {
    return (
      <div className={'main'}>
        <UserContainer userid={currentPage.userid} updatePage={updatePage} />
      </div>
    );
  }

  if (currentPage === 'ask-question') {
    return (
      <div className={'main'}>
        <AskQuestionPage updatePage={updatePage} currentSession={currentSession} />
      </div>
    );
  }
  if (currentPage.currentPage === 'ask-question') {
    return (
      <div className={'main'}>
        <AskQuestionPage updatePage={updatePage} currentSession={currentSession} editInfo={currentPage.questionEdit} />
      </div>
    );
  }
  if (currentPage.currentPage === 'question-answer') {
    return (
      <div className={'main'}>
        <QuestionAnswerPage updatePage={updatePage} qid={currentPage.qid} currentSession={currentSession} />
      </div>
    );
  }
  if (currentPage.currentPage === 'question-answer-user') {
    return (
      <div className={'main'}>
        <QuestionAnswerPage
          updatePage={updatePage}
          qid={currentPage.qid}
          currentSession={currentSession}
          username={currentPage.username}
          userid={currentPage.userid}
        />
      </div>
    );
  }
  if (currentPage.currentPage === 'reply-to-question') {
    return (
      <div className={'main'}>
        <AnswerQuestionPage updatePage={updatePage} qid={currentPage.qid} />
      </div>
    );
  }
  if (currentPage.currentPage === 'reply-to-question-user') {
    return (
      <div className={'main'}>
        <AnswerQuestionPage
          updatePage={updatePage}
          qid={currentPage.qid}
          username={currentPage.username}
          userid={currentPage.userid}
          aid={currentPage.aid}
          text={currentPage.text}
        />
      </div>
    );
  }

  if (currentPage.currentPage === 'loading') {
    return (
      <div className={'main'}>
        <div>Loading</div>
      </div>
    );
  }

  return <div>404</div>;
}

export default MainPage;

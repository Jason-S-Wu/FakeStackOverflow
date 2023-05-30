import React from 'react';
import '../../stylesheets/UsersPage.css';
import UserContainer from './UserContainer';
import AdminContainer from './AdminContainer';


function UserPage({ updatePage, currentSession }) {
  if (!currentSession.loggedIn) {
    return <><div id="users-error-message">Please login to view this page</div></>;
  }

  if(currentSession.isAdmin) {
    return (
      <>
        <AdminContainer updatePage = {updatePage} currentSession = {currentSession}/>
      </>
    ) 

  }else{
    return (
      <>
        <UserContainer userid = {currentSession.userId} updatePage = {updatePage}/>
      </>
    ) 
  }


}

export default UserPage;

import React, { useState, useEffect } from 'react';
import '../../stylesheets/UsersPage.css';
import axios from 'axios';

function AdminContainer({ updatePage, currentSession }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [usersList, setUsersList] = useState([]);
  const [showWarning, setShowWarning] = useState({ warning: false, userId: '' });

  useEffect(() => {
    axios.get(`http://localhost:8000/users/admin`).then(async (res) => {
      setUsersList([...res.data]);
    });
  }, []);

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

  function displayUsers() {
    if (usersList === 'error') {
      return (
        <h1 id="users-error-message">
          An error occurred while fetching Users from the server. Please try again later.<br></br>
          <br></br>
          <div onClick={() => window.location.reload(false)}>Return to Welcome Page</div>
        </h1>
      );
    } else {
      const userList = usersList.map((user) => {
        function handleDeleteClick() {
          if (showWarning.warning) {
            deleteUser();
          } else {
            setShowWarning({ warning: true, userId: user._id });
          }
        }
        function handleCancelClick() {
          setShowWarning({ warning: false, userId: '' });
        }

        function deleteUser() {
          const userToDelete = showWarning.userId;
          axios.delete(`http://localhost:8000/users/deleteUser/${userToDelete}`).then(async (res) => {
            if (res.data === 'success') {
              const updatedUsersList = usersList.filter((user) => user._id !== userToDelete);
              setUsersList(updatedUsersList);
              setShowWarning({ warning: false, userId: '' });
            } else {
              alert('An error occurred while deleting the user. Please try again later.');
            }
          });
        }

        return (
          <React.Fragment key={user._id}>
            <div className="user-container">
              <h2
                onClick={() => {
                  updatePage({ currentPage: 'admin-user', userid: user._id });
                }}
              >
                {user._id === currentSession.userId ? user.username + ' (My Account)' : user.username}
              </h2>
              <button disabled={user._id === currentSession.userId} onClick={handleDeleteClick}>
                Delete
              </button>
            </div>
            {showWarning.userId === user._id && (
              <div className="warning">
                <p>Are you sure you want to delete this user?</p>
                <button onClick={deleteUser}>Delete User</button>
                <button onClick={handleCancelClick}>Cancel</button>
              </div>
            )}
            <hr></hr>
          </React.Fragment>
        );
      });

      return <>{userList}</>;
    }
  }

  return (
    <div>
      <div id="upper-main">
        <div className="user-top-container">
          <div className="user-header">
            <h1>Welcome back {currentSession.username}!</h1>
          </div>
          <div className="user-header">
            <h2>Member for {getTimeElapsedString(new Date(currentSession.created_at))}</h2>
          </div>
          <div className="user-header">
            <h3>Reputation Score: {currentSession.reputation}</h3>
          </div>
        </div>
      </div>
      <div id="lower-main">{displayUsers()}</div>
    </div>
  );
}

export default AdminContainer;

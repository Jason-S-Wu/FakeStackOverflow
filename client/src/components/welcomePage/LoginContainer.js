import React, {useState} from 'react';
import '../../stylesheets/SignUpANDLogInContainer.css'
import axios from 'axios';

function LogInContainer({updatePage}) {

    const [formInputs, setformInputs] = useState({emailAddress: '', password: ''})
    const [hasError, setHasError] = useState({emailAddress: null, password: null});

    function returntoWelcomePage(){
        updatePage('welcome');
    }

    function directToSignUpPage(){
        updatePage('signup');
    }

    const setEmailAddress = (e) => {
        setformInputs({ ...formInputs, emailAddress: e.target.value.trim() });
      };

    const setPassword = (e) => {
        setformInputs({ ...formInputs, password: e.target.value.trim() });
      };

    function isNotValidEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !(pattern.test(email));
    }

    const validateLogin = () => {
        let newStateHasError = { emailAddress: null, password: null};
        let email = formInputs.emailAddress.trim();
        let password = formInputs.password.trim();

        if(email.length === 0){
            newStateHasError = {...newStateHasError, emailAddress: 'Email field can not be empty.'}
        }else if(isNotValidEmail(email)){
            newStateHasError = {...newStateHasError, emailAddress: 'Invalid email address provided.'}
        }
        if(password.length === 0){
            newStateHasError = {...newStateHasError, password: 'Password field can not be empty.'}
        }

        setHasError(newStateHasError);

        if(newStateHasError.emailAddress === null && 
            newStateHasError.password === null){

                const user = {
                    email: email,
                    password: password,
                  };
                  axios
                    .post('http://localhost:8000/users/logIn', user, {
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    })
                    .then((res) => {
                        if(res.data === 'success'){
                            updatePage('guest'); 
                        }else{
                            let newStateHasError = {emailAddress: null, password: null};
                            newStateHasError = {...newStateHasError, password: res.data}
                            setHasError(newStateHasError);
                        } 
                    });
            }
    }

    return (
        <>
            <div className="sulg-container">
                <h1>Log In</h1>
                <div className="sulg-form">                
                    <input type="email" placeholder="Email Address"
                        onChange={(e) => setEmailAddress(e)}
                    />
                    <br />
                    <label htmlFor="email" className="new-f-error" id="f-error">
                        {hasError.emailAddress === null ? '' : hasError.emailAddress}
                    </label>
                    <input type="password" placeholder="Password"
                        onChange={(e) => setPassword(e)}
                    />
                    <br />
                    <label htmlFor="password" className="new-f-error" id="f-error">
                        {hasError.password === null ? '' : hasError.password}
                    </label>
                    <button onClick = {validateLogin}>Log In</button>
                    </div>
                <div className="sulg-bottom-div">
                    <button onClick = {returntoWelcomePage}>Back to Welcome Page</button>
                    <button onClick = {directToSignUpPage}>Sign Up</button>
                </div>
            </div>
        </>
        )
};

export default LogInContainer;

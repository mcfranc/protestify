import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'

import './Auth.css';
import AuthContext from '../context/auth-context';
import Header from '../components/Header/Header';

class AuthPage extends Component {
  state = {
    isLogin: true,
    regText: false
  }

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return {isLogin: !prevState.isLogin}
    })
  }

  regTextHandler = () => {
    this.setState({regText: true})
  }

  submitHandler = event => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password
        }
      };
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      if (resData.data.createUser) {
        this.regTextHandler();
        return;
      }
      if (resData.data.login.token) {
        this.context.login(
          resData.data.login.token,
          resData.data.login.userId,
          resData.data.login.tokenExpiration
        );
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <div className="auth-form-container">
          <form className="auth-form" onSubmit={this.submitHandler}>
            <h1>
              {this.state.isLogin ? 'Sign In' : 'Sign Up'}
            </h1>
            <p>
              {this.state.regText ? 'Sign up successful! Try logging in with your credentials.' : ''}
            </p>
            <div className="form-control">
              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" ref={this.emailEl} />
            </div>
            <div className="form-control">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" ref={this.passwordEl} />
            </div>
            <div className="form-actions">
              <button type="submit">Submit &nbsp;<FontAwesomeIcon icon={faAngleDoubleRight} /></button>
              <button type="button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Sign Up' : 'Sign In'}</button>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default AuthPage;

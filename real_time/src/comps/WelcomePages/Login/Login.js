import React, { Component } from "react";
import "./Login.css";
import facebook from "./facebook.png";
import google from "./google.png";
import fire from "../../../firebaseConfig"

class Login extends Component {

  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.state = {
      user: {},
      email: '',
      password: '',
      error_msg: '',
      loading: 'hidden',
      found: false
    }
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
      else {
        this.setState({ user: null });
      }
    });
  }
  componentDidMount() {
    this.authListener();
  }
  handleChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }
  handleChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleKeyDown(e){
    console.log('do')
    if (e.key === 'Enter') {
      console.log('do validate')
    }
  }

  login(e) {
    this.setState({ loading: 'visible', error_msg: '' });
    e.preventDefault();
    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((user) => {
      console.log('successful sign in');
      const db = fire.database();
      var userEmail = user.user.email;

      if (this.props.pageBodyState === "EmloyeeLogin") {
        db.ref("/employees/employees_list").on("value", (snapshot) => {
          snapshot.forEach((snap) => {
            if (snap.val().email === userEmail) {
              this.setState({ loading: 'hidden' });
              if(snap.val().status==="blocked")
                this.setState({ error_msg: "האדמין חסם את המשתמש שלך" });
              else
                this.props.clickConnectEmployee(snap.val(), snap.ref.key);
            }
          });
        });

        db.ref("/admins/admins_list").on("value", (snapshot) => {
          snapshot.forEach((snap) => {
            if (snap.val().email === userEmail) {
              this.setState({ loading: 'hidden' });
              this.props.clickConnectAdmin(snap.val(), snap.ref.key);
            }
          });
          //this.setState({ loading: 'hidden', error_msg: "שם משתמש או סיסמה שגויים" });
        });
      }
      else if (this.props.pageBodyState === 'BusinessLogin') {
        db.ref("/business/business_list").on("value", (snapshot) => {
          snapshot.forEach((snap) => {
            if (snap.val().email === userEmail) {
              this.setState({ loading: 'hidden' });
              if(snap.val().status==="wating")
                this.setState({ error_msg: "האדמין טרם אישר את ההרשמה שלך" });
              else if(snap.val().status==="blocked")
                this.setState({ error_msg: "האדמין חסם את המשתמש שלך" });
              else
                this.props.clickConnectBusiness(snap.val(), snap.ref.key);
            }
          });
        });
      }
    }).catch((error) => {
      this.setState({ loading: 'hidden' });
      this.setState({ error_msg: "שם משתמש או סיסמה שגויים" });
      console.log(error);
    });
  }

  render() {
    return (
      <div id="Login">
        <div id="loginContainer">
          <div id="wellcome">ברוכים הבאים</div>
          <div id="loginCenter">
            <fieldset>
              <input
                className="field"
                id="email"
                placeholder="Username"
                type="text"
                tabIndex="4"
                value={this.state.email}
                onChange={this.handleChangeEmail}
                required
                autoFocus
              />
            </fieldset>

            <fieldset>
              <input
                className="field"
                id="password"
                placeholder="Password"
                type="password"
                tabIndex="5"
                value={this.state.password}
                onChange={this.handleChangePassword}
                required
              />
            </fieldset>

            <fieldset>
              <div id="login" onClick={this.login}>התחבר</div>
            </fieldset>
            <div id="loginMsg">{this.state.error_msg}</div>
            <div
              id="loginLoadingContainer"
              style={{ visibility: `${this.state.loading}` }}>
              ...מתחבר
              <br />
              <div
                id="loginLoading"
                className="spinner-border"
                role="status"
                style={{ color: 'green' }}>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
            <fieldset>
              <div id="forgotPassword" onClick={this.props.clickForgotPassword}>
                שכחתי סיסמא
            </div>
            </fieldset>

            <fieldset>
              <div id="SignUponLogin" onClick={this.props.clickSignUp}>
                הרשמה
            </div>
            </fieldset>

            <div className="loginWith">
              {/* <a href="#"> */}
              <img src={google} className="loginWithButton" alt="google_img"></img>
              {/* </a> */}
              {/* <a href="#"> */}
              <img src={facebook} className="loginWithButton" alt="facebook_img"></img>
              {/* </a> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
};
export default Login;

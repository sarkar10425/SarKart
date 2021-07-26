import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";

/**
 * @class Register component handles the Register page UI and functionality
 *
 * Contains the following fields
 *
 * @property {boolean} state.loading
 *    Indicates background action pending completion. When true, further UI actions might be blocked
 * @property {string} state.username
 *    User given field for username
 * @property {string} state.password
 *    User given field for password
 * @property {string} state.confirmPassword
 *    User given field for retyping and confirming password
 */
class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      username: "",
      password: "",
      confirmPassword: "",
    };
  }
  
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * -    Check that username field is not an empty value
   * -    Check that username field is not less than 6 characters in length
   * -    Check that username field is not more than 32 characters in length
   * -    Check that password field is not an empty value
   * -    Check that password field is not less than 6 characters in length
   * -    Check that password field is not more than 32 characters in length
   * -    Check that confirmPassword field has the same value as password field
   */
  validateInput = () => {
    const username = this.state.username
    const password = this.state.password
    const confirmPassword = this.state.confirmPassword
    // if(username !== "" && username.length >= 6 && username.length <= 32 && password !== "" && password.length >= 6 && password.length <= 32 && confirmPassword === password){
    //   return true
    // }else{
    //   return false
    // }
    if(username.length === 0){
      message.error("Username is a required field")
      return false;
    }
    if(username.length < 6 || username.length > 32){
      message.error("Username must be between 6 and 32 characters in length")
      return false;
    }
    if(password.length === 0){
      message.error("Password is a required field")
      return false;
    }
    if(password.length < 6 || password.length > 32){
      message.error("Password must be between 6 and 32 characters in length")
      return false;
    }
    if(confirmPassword.length === 0){
      message.error("Confirm Password is a required field")
      return false;
    }
    if(confirmPassword !== password){
      message.error("Passwords do not match")
      return false;
    }
    return true;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Check API response
  /**
   * Check the response of the API call to be valid and handle any failures along the way
   *
   * @param {boolean}  errored
   *    Represents whether an error occurred in the process of making the API call itself
   * @param {{ success: boolean, message?: string }}  response
   *    The response JSON object which may contain further success or error messages
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * If the API call itself encounters an error, errored flag will be true.
   * If the backend returns an error, then success field will be false and message field will have a string with error details to be displayed.
   * When there is an error in the API call itself, display a generic error message and return false.
   * When there is an error returned by backend, display the given message field and return false.
   * When there is no error and API call is successful, return true.
   */
  validateResponse = (errored, response) => {
    if(response){
      if(!errored && response.success){
        return true;
      }
      if(errored && !response.success){
        if(response.message === "Username already exists"){
          message.error(response.message)
        }
        return false;
      }
    }
    return false
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the API call over the network and return the response
   *
   * @returns {{ success: boolean }|undefined}
   *     The response JSON object
   *
   * -    Set the loading state variable to true
   * -    Perform the API call via a fetch call: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   * -    The call must be made asynchronously using Promises or async/await
   * -    The call must handle any errors thrown from the fetch call
   * -    Parse the result as JSON
   * -    Set the loading state variable to false once the call has completed
   * -    Call the validateResponse(errored, response) function defined previously
   * -    If response passes validation, return the response object
   *
   * Example for successful response from backend:
   * HTTP 200
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  performAPICall = async () => {
    const url = `${config.endpoint}/auth/register`
    try{
      this.setState({
        loading: true
      })
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "username": this.state.username,
          "password": this.state.password
        })
      })
      const data = await res.json()
      this.setState({
        loading: false
      })
      if(this.validateResponse(!data.success, data)){
        return {success: this.validateResponse(!data.success, data)}
      }
    }catch(err) {
      message.error("Something went wrong")
      return undefined
    }
  };

  clearFields = () => {
    this.setState({
      username: "",
      password: "",
      confirmPassword: "",
    })
    return
  }

  redirect = () => {
    this.props.history.push("/login")
  }

  // TODO: CRIO_TASK_MODULE_LOGIN - Implement the register function
  /**
   * Definition for register handler
   * This is the function that is called when the user clicks on the register button or submits the register form
   * -    Call the previously defined validateInput() function and check that is returns true, i.e. the input values pass validation
   * -    Call the previously defined performAPICall() function asynchronously and capture the returned value in a variable
   * -    If the returned value exists,
   *      -   Clear the input fields
   *      -   Display a success message
   *      -   Redirect the user to the "/login" page
   */
  register = async () => {
    if(this.validateInput()){
      const check2 = await this.performAPICall()
      if(check2){
        if(check2.success){
          this.clearFields()
          message.success("User successfully registered")
          this.redirect()
        }
      }
    }
    return
  };

  /**
   * JSX and HTML goes here
   * We require a text field, a password field, and a confirm password field (each with data binding to state), and a submit button that calls register()
   */
  render() {
    return (
      <>
        {/* Display Header */}
        <Header history={this.props.history} />

        {/* Display Register fields */}
        <div className="flex-container">
          <div className="register-container container">
            <h1>Make an account</h1>

            {/* Antd component which renders a formatted <input type="text"> field */}
            <Input
              className="input-field"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              onChange={(e) => {
                this.setState({
                  username: e.target.value,
                });
              }}
            />

            {/* Antd component which renders a formatted <input type="password"> field */}
            <Input.Password
              className="input-field"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              onChange={(e) => {
                this.setState({
                  password: e.target.value,
                });
              }}
            />

            <Input.Password
              className="input-field"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm Password"
              onChange={(e) => {
                this.setState({
                  confirmPassword: e.target.value,
                });
              }}
            />

            <Button
              loading={this.state.loading}
              type="primary"
              onClick={this.register}
            >
              Register
            </Button>
          </div>
        </div>

        <Footer></Footer>
      </>
    );
  }
}

 export default withRouter(Register);

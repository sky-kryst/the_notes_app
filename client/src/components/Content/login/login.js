import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import * as actions from '../../../store/actions'
import Button from '../../UI/button/button'
import Input from '../../UI/Input/Input'
import Spinner from '../../UI/spinner/spinner'
import css from './login.module.css'

class Login extends Component {
  state = {
    controls: {
      email: {
        type: 'email',
        value: '',
        valid: false,
        touched: false,
      },
      password: {
        type: 'password',
        value: '',
        valid: false,
        touched: false,
      },
    },
    isSignup: false,
  }

  componentDidMount() {
    if (this.props.authRedirectPath !== '/') {
      this.props.onSetAuthRedirectPath()
    } else {
      this.props.onAuthFail(false)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState
  }

  inputChangedHandler = (event, id) => {
    const updatedFormElement = {
      ...this.state.controls[id],
      value: event.target.value,
      touched: true,
    }
    const updatedForm = { ...this.state.controls, [id]: updatedFormElement }
    this.setState({
      ...this.state,
      controls: updatedForm,
    })
  }

  submitHandler = event => {
    event.preventDefault()
    let userData = {}
    for (let key in this.state.controls) {
      userData = Object.assign(userData, {
        [key]: this.state.controls[key].value,
      })
    }
    this.props.onAuth(userData, this.state.isSignup)
    if (this.props.isAuthenticated) {
      this.props.history.goBack()
    }
  }

  signupHandler = event => {
    event.preventDefault()
    this.props.history.push('/signup')
  }

  forgotPasswordHandler = event => {
    event.preventDefault()
    this.props.history.push('/forgotPassword')
  }

  render() {
    const formElement = []
    for (let key in this.state.controls) {
      formElement.push({
        id: key,
        config: this.state.controls[key],
      })
    }

    const capitalize = str =>
      `${str.slice(0, 1).toLocaleUpperCase()}${str.slice(-(str.length - 1))}`

    let form = formElement.map(el => (
      <div key={el.id}>
        <div className={css.text}>{capitalize(el.id)}:</div>
        <Input
          type={el.config.type}
          value={el.config.value}
          invalid={!el.config.valid}
          shouldValidate={el.config.validation}
          touched={el.config.touched}
          changed={event => this.inputChangedHandler(event, el.id)}
        />
      </div>
    ))

    let errorMessage = null

    if (this.props.error) {
      errorMessage = <div className={css.msg}>{this.props.error.message}</div>
    }

    let authRedirect = null
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />
    }

    const op = (
      <Fragment>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler} className={css.form}>
          {form}
          <div className={css.buttons}>
            <Button btnType="Success" clicked={this.submitHandler}>
              SUBMIT
            </Button>
          </div>
          <div className={css.refs}>
            Not a member yet? Click here to{'\n'}
            <a href="/" onClick={this.signupHandler}>
              Signup
            </a>
            <a href="/" onClick={this.forgotPasswordHandler}>
              Forgot Password?
            </a>
          </div>
        </form>
      </Fragment>
    )

    return (
      <div className={css.login}>{this.props.loading ? <Spinner /> : op}</div>
    )
  }
}

const mapStateToProps = state => {
  return {
    error: state.auth.error,
    loading: state.auth.loading,
    isAuthenticated: state.auth.token !== null,
    authRedirectPath: state.auth.authRedirectPath,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (user, isSignup) => dispatch(actions.auth(user, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
    onAuthFail: err => dispatch(actions.authFail(err)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

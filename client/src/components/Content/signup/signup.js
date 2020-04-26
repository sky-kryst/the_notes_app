import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import validator from 'validator'
import * as actions from '../../../store/actions'
import Button from '../../UI/button/button'
import Input from '../../UI/Input/Input'
import Spinner from '../../UI/spinner/spinner'
import css from './signup.module.css'

const inputParameterState = {
  value: '',
  validator: () => {},
  type: 'text',
  valid: false,
  touched: false,
}

class signUpForm extends Component {
  state = {
    firstName: {
      ...inputParameterState,
      validator: val => validator.isAlpha(val),
    },
    lastName: {
      ...inputParameterState,
      validator: val => validator.isAlpha(val),
    },
    username: {
      ...inputParameterState,
      validator: val => validator.isAlphanumeric(val),
    },
    email: {
      ...inputParameterState,
      validator: val => validator.isEmail(val),
      type: 'email',
    },
    password: {
      ...inputParameterState,
      validator: val =>
        validator.isLength(val, { min: 0, max: 8 }) &&
        validator.isAlphanumeric(val),
      type: 'password',
    },
    passwordConfirm: {
      ...inputParameterState,
      validator: val => validator.equals(val, this.state.password.value),
      type: 'password',
    },
  }

  componentDidMount() {
    if (this.props.authRedirectPath !== '/') {
      this.props.onSetAuthRedirectPath()
    }
  }

  componentWillUnmount() {
    this.props.onAuthStart()
  }

  inputChangedHandler = (e, id) => {
    const updatedFormElement = {
      ...this.state[id],
      value: e.target.value,
      touched: true,
    }
    this.state[id].validator(e.target.value)
    this.setState(pS => {
      return {
        ...pS,
        [id]: updatedFormElement,
      }
    })
  }

  submitHandler = event => {
    event.preventDefault()
    let userData = {}
    for (let key in this.state) {
      userData = Object.assign(userData, { [key]: this.state[key].value })
    }
    this.props.onAuth(userData, true)
    if (this.props.isAuthenticated) this.props.history.replace('/')
  }

  render() {
    const formElements = []
    for (let key in this.state) {
      formElements.push(Object.assign({}, { ...this.state[key] }, { id: key }))
    }

    const Switch = n => {
      let ID
      switch (n) {
        case 'firstName':
          ID = 'First Name:'
          break
        case 'lastName':
          ID = 'Last Name:'
          break
        case 'email':
          ID = 'E-mail:'
          break
        case 'username':
          ID = 'Username:'
          break
        case 'password':
          ID = 'Password:'
          break
        case 'passwordConfirm':
          ID = 'Password Confirm:'
          break
        default:
          ID = 'id'
      }
      return ID
    }

    let form = (
      <form onSubmit={this.submitHandler} className={css.form}>
        {formElements
          .map(el => (
            <div className={css.el} key={el.id}>
              <div className={css.text}>{Switch(el.id)}</div>
              <Input
                key={el.id}
                type={el.type}
                value={el.value}
                invalid={!el.valid}
                shouldValidate={el.validator}
                touched={el.touched}
                changed={event => this.inputChangedHandler(event, el.id)}
              />
            </div>
          ))
          .filter(el => el.id !== 'id')}
        <div className={css.button}>
          <Button btnType="navSet">Submit!</Button>
        </div>
      </form>
    )

    if (this.props.loading) {
      form = <Spinner />
    }

    let errorMessage = null

    if (this.props.error) {
      const err = this.props.error.message.split(':')
      err.splice(0, 2)
      errorMessage = <div className={css.msg}>{err[0].split(',')[0]}</div>
    }

    let authRedirect = null
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />
    }

    return (
      <div className={css.Signup}>
        {authRedirect}
        {errorMessage}
        {form}
      </div>
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
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
    onAuthStart: () => dispatch(actions.authStart()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(signUpForm)

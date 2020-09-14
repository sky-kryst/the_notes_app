import Axios from 'axios'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import validator from 'validator'
import * as actions from '../../../store/actions'
import Button from '../../UI/button/button'
import Input from '../../UI/Input/Input'
import Spinner from '../../UI/spinner/spinner'
import style from './resetPassword.module.css'

const ResetPassword = props => {
  const [placeholder, setPlaceholder] = useState('')
  const [show, setShow] = useState(style.hide)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fetching, setFetching] = useState(null)
  const [err, setErr] = useState(null)
  const [showToken, setShowToken] = useState(null)
  const { onReleaseError, onError } = props
  const [errorType, setErrorType] = useState('red')
  const Msg = [style.msg]

  const compShow = useCallback(
    val => {
      if (validator.isHash(val, 'sha256')) {
        setShowToken({ display: 'none' })
        setShow(style.show)
        setErrorType('red')
        onReleaseError()
      }
    },
    [onReleaseError]
  )

  useEffect(() => {
    const path = new URL(document.location).pathname.split('/')[2] || null
    if (path) {
      setPlaceholder(path)
      compShow(path)
    } else {
      setErr(onError)
      if (onError) setErrorType('green')
    }
  }, [compShow, onError])

  const onChangeHandler = e => {
    setPlaceholder(e.target.value)
    compShow(e.target.value)
  }

  Msg.push(errorType === 'red' ? style.red : style.green)

  if (err) {
    const error = err.split(':')
    error.splice(0, 2)
    if (error.length > 0) {
      setErr(error[0].split(',')[0])
    }
  }

  const submitHandler = () => {
    setFetching(true)
    const post = async () => {
      try {
        const res = await Axios.patch(
          `/api/v1/user/resetPassword/${placeholder}`,
          { newPassword, confirmPassword }
        )
        if (res) {
          const expirationDate = new Date(Date.now() + res.data.expiresIn)
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('expirationDate', expirationDate)
          localStorage.setItem('userId', res.data.userId)
          props.onAuthSuccess(res.data.token, res.data.userId)
          props.onAuthCheckout(res.data.expiresIn)
          window.history.go('/')
        }
      } catch (err) {
        setErr(err.response.data.message)
      }
      setFetching(false)
    }
    post()
  }

  const op = (
    <Fragment>
      {err ? <div className={Msg.join(' ')}>{err}</div> : null}
      <form className={style.form}>
        <span style={showToken}>
          <div>Reset Token:</div>
          <Input
            value={placeholder}
            type="text"
            changed={e => onChangeHandler(e)}
          />
        </span>
        <div className={show} style={{ paddingTop: '0' }}>
          <div>New Password:</div>
          <Input
            type="password"
            value={newPassword}
            changed={e => setNewPassword(e.target.value)}
          />
          <div>Confirm Password:</div>
          <Input
            type="password"
            value={confirmPassword}
            changed={e => setConfirmPassword(e.target.value)}
          />
          <div className={style.button}>
            <Button clicked={submitHandler}>Submit</Button>
          </div>
        </div>
      </form>
    </Fragment>
  )

  return (
    <div className={style.resetPassword}>{fetching ? <Spinner /> : op}</div>
  )
}
const mapDispatchToProps = dispatch => {
  return {
    onAuthSuccess: (token, userId) =>
      dispatch(actions.authSuccess(token, userId)),
    onAuthCheckout: expiry => dispatch(actions.checkAuthTimeout(expiry)),
    onReleaseError: () => dispatch(actions.releaseError()),
  }
}

const mapStateToProps = state => {
  return {
    onError: state.notes.error,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)

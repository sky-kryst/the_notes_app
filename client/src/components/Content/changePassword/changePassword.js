import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from '../../../axios'
import Button from '../../UI/button/button'
import Input from '../../UI/Input/Input'
import Spinner from '../../UI/spinner/spinner'
import style from './changePassword.module.css'

const ChangePassword = props => {
  const [fetching, setFetching] = useState(null)
  const [message, setMessage] = useState(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorType, setErrorType] = useState('red')
  const Msg = [style.msg]

  const submitHandler = async () => {
    try {
      setFetching(true)
      const res = await axios.patch(`user/${props.userID}/updateMyPassword`, {
        currentPassword,
        newPassword,
        confirmPassword,
      })
      if (res.status === 200) {
        setErrorType('green')
        setMessage('Password has been successfully changed!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      setMessage(
        err.response.data.message.split(':')[2] || err.response.data.message
      )
    } finally {
      setFetching(false)
    }
  }

  Msg.push(errorType === 'red' ? style.red : style.green)

  const op = (
    <Fragment>
      {message ? <div className={Msg.join(' ')}>{message}</div> : null}
      <form className={style.form}>
        <div className={style.password}>
          <div>Current Password:</div>
          <Input
            type="password"
            value={currentPassword}
            changed={e => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className={style.password}>
          <div>New Password:</div>
          <Input
            type="password"
            value={newPassword}
            changed={e => setNewPassword(e.target.value)}
          />
        </div>
        <div className={style.password}>
          <div>Confirm New password:</div>
          <Input
            type="password"
            value={confirmPassword}
            changed={e => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className={style.button}>
          <Button clicked={submitHandler}>Confirm!</Button>
        </div>
      </form>
    </Fragment>
  )
  return (
    <div className={style.changePassword}>{fetching ? <Spinner /> : op}</div>
  )
}

const mapStateToProps = state => {
  return {
    userID: state.auth.userId,
  }
}

export default withRouter(connect(mapStateToProps)(ChangePassword))

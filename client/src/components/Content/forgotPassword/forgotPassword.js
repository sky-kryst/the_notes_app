import Axios from 'axios'
import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'
import Button from '../../UI/button/button'
import Input from '../../UI/Input/Input'
import Spinner from '../../UI/spinner/spinner'
import style from './forgotPassword.module.css'

const ForgotPassword = props => {
  const [placeholder, setPlaceholder] = useState('')
  const [message, setMessage] = useState(null)
  const [fetching, setFetching] = useState(null)
  const submitHandler = async () => {
    try {
      setFetching(true)
      const res = (
        await Axios.post(
          'http://192.168.56.1:5000/api/v1/user/forgotPassword',
          { email: placeholder }
        )
      ).data.message
      if (res) {
        props.onSetError(res)
        setFetching(false)
        props.history.push('/resetPassword')
      }
    } catch (err) {
      setFetching(false)
      setMessage(err.response.data.message)
    }
  }

  let msg = null

  if (message) msg = <div className={style.msg}>{message}</div>
  const op = (
    <Fragment>
      {msg}
      <form className={style.form} onSubmit={submitHandler}>
        <div className={style.text}>Enter your email here:</div>
        <Input
          value={placeholder}
          type="email"
          changed={e => setPlaceholder(e.target.value)}
        />
      </form>
      <div className={style.button}>
        <Button clicked={() => props.history.goBack()}>Go Back</Button>
        <Button clicked={submitHandler}>Submit</Button>
      </div>
    </Fragment>
  )

  return (
    <div className={style.forgotPassword}>{fetching ? <Spinner /> : op}</div>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    onSetError: err => dispatch(actions.setError(err)),
  }
}

export default connect(null, mapDispatchToProps)(ForgotPassword)

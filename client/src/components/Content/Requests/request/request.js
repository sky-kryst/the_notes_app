import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from '../../../../axios'
import * as actions from '../../../../store/actions'
import Button from '../../../UI/button/button'
import Spinner from '../../../UI/spinner/spinner'
import css from './request.module.css'

const Request = props => {
  const {
    user,
    note,
    reqType,
    userID,
    onLoading,
    onLoadingStart,
    onLoadingEnd,
  } = props

  const { creator, title, body, requests } = note

  const { firstName, lastName } = user

  const [show, setShow] = useState(true)
  const onResponseHandler = response => {
    onLoadingStart()
    const res = async () => {
      try {
        const res = (
          await axios.patch(`user/${userID}/note/response/${response}`, {
            userId: user._id,
            reqType,
            noteId: note._id,
          })
        ).data.data
        if (res) {
          onLoadingEnd()
          setShow(false)
        }
      } catch {
        onLoadingEnd()
      }
    }
    res()
  }

  let op = null

  const clicked = () => props.history.push(`/note/${note._id}`)

  if (body.length > 0) {
    let Title
    if (title.length > 15) {
      Title = `${title.slice(0, 15)}...`
    } else {
      Title = title
    }
    if (
      requests.filter(
        l =>
          l.userId === user._id &&
          l.reqType === reqType &&
          l.noteId === note._id
      )[0].accepted
    ) {
      op = (
        <div className={show ? css.open : css.close}>
          <div className={css.text}>
            <b>{creator.firstName + ' ' + creator.lastName}</b> has accepted
            your permission to {reqType}{' '}
            <span onClick={clicked}>
              <b>'{Title}'</b>
            </span>
          </div>
          <div className={css.button}>
            <Button clicked={() => onResponseHandler(false)}>OK</Button>
          </div>
        </div>
      )
    } else {
      op = (
        <div className={show ? css.open : css.close}>
          <div className={css.text}>
            <b>{firstName + ' ' + lastName}</b> has asked your permission to{' '}
            {reqType}{' '}
            <span onClick={clicked}>
              <b>'{Title}'</b>
            </span>
          </div>
          <div className={css.button}>
            <Button clicked={() => onResponseHandler(false)}>Decline</Button>
            <Button clicked={() => onResponseHandler(true)}>Accept</Button>
          </div>
        </div>
      )
    }
  }
  return onLoading ? <Spinner /> : op
}

const mapStateToProps = state => {
  return {
    userID: state.auth.userId,
    onLoading: state.notes.loading,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLoadingStart: () => dispatch(actions.loadingStart()),
    onLoadingEnd: () => dispatch(actions.loadingEnd()),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Request))

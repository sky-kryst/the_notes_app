import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import axios from '../../../axios'
import withErrorHandler from '../../../containers/errorHandler/errorHandler'
import * as actions from '../../../store/actions'
import Button from '../../UI/button/button'
import Spinner from '../../UI/spinner/spinner'
import css from './node.module.css'

const Note = props => {
  const pathname = new URL(document.location).pathname
  const noteId = pathname.split('/')[2]
  const { onLoadingStart, onLoadingEnd, onLoading } = props
  const [body, setBody] = useState('')
  const [title, setTitle] = useState('')
  const [fetched, setFetched] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const note = await axios.get(`/note/${noteId}`)
      setTitle(note.data.data.title)
      setBody(note.data.data.body)
      setFetched(true)
    }
    if (noteId) {
      fetch()
    } else {
      setFetched(true)
    }
  }, [noteId])

  const onTitleChange = event => {
    setTitle(event.target.value)
  }

  const onBodyChange = event => {
    setBody(event.target.value)
  }

  const onPublishHandler = () => {
    if (!props.isAuthenticated) {
      throw Error('You need to login to start creating notes!')
    }
    onLoadingStart()
    const noteData = {
      title,
      body,
      likesCount: 0,
      creator: props.userID,
    }
    if (noteId) {
      axios.post(`user/${noteData.creator}/note`, noteData).then(res => {
        onLoadingEnd()
        props.history.replace(`/note/${res.data.data.id}`)
      })
    } else {
      axios
        .patch(`user/${noteData.creator}/note/${noteId}`, noteData)
        .then(() => {
          onLoadingEnd()
          props.history.replace(`/note/${noteId}`)
        })
    }
  }

  const give = (
    <Fragment>
      <input
        type="text"
        placeholder="Title( 80 characters)"
        className={css.Title}
        value={title}
        onChange={onTitleChange}
      />
      <textarea
        type="text"
        placeholder="Enter your note here( 1500 characters)"
        className={css.Body}
        value={body}
        onChange={onBodyChange}
      ></textarea>
      <div className={css.pressable}>
        <Button clicked={() => props.history.goBack()}>Back</Button>
        <Button clicked={onPublishHandler}>Post</Button>
      </div>
    </Fragment>
  )

  return (
    <div className={css.note}>{fetched && !onLoading ? give : <Spinner />}</div>
  )
}

const mapStateToProps = state => {
  return {
    userID: state.auth.userId,
    onLoading: state.notes.loading,
    isAuthenticated: state.auth.token !== null,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLoadingStart: () => dispatch(actions.loadingStart()),
    onLoadingEnd: () => dispatch(actions.loadingEnd()),
  }
}

export default withErrorHandler(
  connect(mapStateToProps, mapDispatchToProps)(Note),
  axios
)

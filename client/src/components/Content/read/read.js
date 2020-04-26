import React, { Fragment, useContext, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import axios from '../../../axios'
import ErrorHandler from '../../../containers/errorHandler/errorHandler'
import * as actions from '../../../store/actions'
import * as click from '../../../utils/onClick'
import PermissionContext from '../../Context/permissions'
import Button from '../../UI/button/button'
import Spinner from '../../UI/spinner/spinner'
import css from './read.module.css'

const Read = props => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const context = useContext(PermissionContext)
  const { noteID, onNotesIdRelease, userID, onSet, onNotesIdSet } = props

  useEffect(() => {
    const noteId = new URL(document.location).pathname.split('/')[2]

    onNotesIdSet(noteId)

    const fetch = async () => {
      const note = (await axios.get(`note/${noteId}`)).data.data
      setTitle(note.title)
      setBody(note.body)
    }

    fetch()

    return () => onNotesIdRelease()
  }, [onNotesIdSet, onNotesIdRelease])

  const op = (
    <Fragment>
      <div className={css.title}>{title}</div>
      <div className={css.body}>{body}</div>
      <div className={css.buttons}>
        <Button
          clicked={() => click.onEditHandler(userID, noteID, context, props)}
        >
          Edit
        </Button>
        <Button
          clicked={() => {
            context.setPermission('delete')
            onSet()
          }}
        >
          Delete
        </Button>
      </div>
    </Fragment>
  )

  return (
    <div className={css.note}>
      {props.onLoading && body.length > 0 ? <Spinner /> : op}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    userID: state.auth.userId,
    onLoading: state.notes.loading,
    noteID: state.notes.noteId,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLoadingStart: () => dispatch(actions.loadingStart()),
    onLoadingEnd: () => dispatch(actions.loadingEnd()),
    onNotesIdSet: id => dispatch(actions.idCapture(id)),
    onNotesIdRelease: () => dispatch(actions.idRelease()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorHandler(Read, axios))

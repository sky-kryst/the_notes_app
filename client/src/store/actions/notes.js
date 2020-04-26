import * as actionTypes from './actionTypes'

export const loadingStart = () => {
  return {
    type: actionTypes.NOTES_LOADING_START,
  }
}

export const loadingEnd = () => {
  return {
    type: actionTypes.NOTES_LOADING_END,
  }
}

export const idCapture = noteId => {
  return {
    type: actionTypes.NOTES_ID_CAPTURE,
    noteId,
  }
}

export const idRelease = () => {
  return {
    type: actionTypes.NOTES_ID_RELEASE,
  }
}
export const setError = error => {
  return {
    type: actionTypes.NOTES_SET_ERROR,
    error,
  }
}
export const releaseError = () => {
  return {
    type: actionTypes.NOTES_RELEASE_ERROR,
  }
}

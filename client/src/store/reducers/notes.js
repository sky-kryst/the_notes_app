import * as actionTypes from '../actions/actionTypes'

const initialState = {
  loading: null,
  noteId: '',
  error: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NOTES_LOADING_START:
      return {
        ...state,
        loading: true,
      }
    case actionTypes.NOTES_LOADING_END:
      return {
        ...state,
        loading: false,
      }
    case actionTypes.NOTES_ID_CAPTURE:
      return {
        ...state,
        noteId: action.noteId,
      }
    case actionTypes.NOTES_ID_RELEASE:
      return {
        ...state,
        noteId: '',
      }
    case actionTypes.NOTES_SET_ERROR:
      return {
        ...state,
        error: action.error,
      }
    case actionTypes.NOTES_RELEASE_ERROR:
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export default reducer

import axios from '../axios'

export const onViewHandler = async (userId, noteId, context, props) => {
  props.onLoadingStart()
  try {
    const res = await axios.get(`user/${userId}/note/${noteId}/permission/view`)
    if (res.data.data === true) {
      props.onNotesIdSet(noteId)
      props.onLoadingEnd()
      props.history.push(`/note/${noteId}`)
    }
  } catch (err) {
    props.onLoadingEnd()
    context.setPermission('view')
  }
}
export const onEditHandler = async (userId, noteId, context, props) => {
  props.onLoadingStart()
  try {
    const res = await axios.get(`user/${userId}/note/${noteId}/permission/edit`)
    if (res.data.data === true) {
      props.onLoadingEnd()
      props.history.push(`/create/${noteId}`)
    }
  } catch (err) {
    props.onLoadingEnd()
    context.setPermission('edit')
  }
}
export const onDeleteHandler = async (userId, noteId, props) => {
  props.onLoadingStart()
  try {
    const res = (await axios.delete(`user/${userId}/note/${noteId}`)).status
    if (res === 204) {
      props.onLoadingEnd()
      props.history.goBack()
    }
  } catch {
    props.onLoadingEnd()
  }
}

import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { connect } from 'react-redux'
import axios from '../../../axios'
import ErrorHandler from '../../../containers/errorHandler/errorHandler'
import PageContext from '../../Context/page'
import Spinner from '../../UI/spinner/spinner'
import Tiles from '../../UI/tiles/tiles'
import css from './notes.module.css'

const Notes = props => {
  const [created, setCreated] = useState([])

  const [collaborated, setCollaborated] = useState([])

  const [fetched, setFetched] = useState(false)

  const { page, setPage } = useContext(PageContext)

  const wrappedSetPage = useCallback(setPage, [])

  useEffect(() => {
    wrappedSetPage('1')
    const fetch = async () => {
      const userId = localStorage.getItem('userId')
      const createdNotes = (
        await axios.get(`/user/${userId}/note?creator=${userId}`)
      ).data.data
      const collaboratedNotes = (
        await axios.get(`/user/${userId}/note?collaborator[in]=${userId}`)
      ).data.data
      setCreated(createdNotes)
      setCollaborated(collaboratedNotes)
      setFetched(true)
    }
    fetch()
  }, [wrappedSetPage])

  const op = ip => {
    let op
    if (ip.length === 0) {
      op = <h4>You have no notes yet. Start writing!</h4>
    } else if (ip === created) {
      if (created.length <= 4 * (1 * page - 1)) {
        op = <h4>Nothing to show here!</h4>
      } else {
        op = (
          <Tiles
            data={created /* .slice(4 * (1 * page - 1), 4 * page) */}
            TLength={10}
            BLength={40}
          />
        )
      }
    } else if (ip === collaborated) {
      if (collaborated.length <= 4 * (1 * page - 1)) {
        op = <h4>Nothing to show here!</h4>
      } else {
        op = (
          <Tiles
            data={collaborated /* .slice(4 * (1 * page - 1), 5 * page - 1) */}
            TLength={20}
            BLength={150}
          />
        )
      }
    }
    return op
  }

  const give = (
    <Fragment>
      <div className={css.created}>
        <span>Your notes:</span>
        <div className={css.tiles}>{op(created)}</div>
      </div>
      <div className={css.collaborated}>
        <span>Your collaborations:</span>
        <div className={css.tiles}>{op(collaborated)}</div>
      </div>
    </Fragment>
  )

  return (
    <div className={css.notes}>
      {fetched && !props.onLoading ? give : <Spinner />}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    onLoading: state.notes.loading,
  }
}

export default ErrorHandler(connect(mapStateToProps)(Notes), axios)

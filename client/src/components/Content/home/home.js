import Axios from 'axios'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import axios from '../../../axios'
import ErrorHandler from '../../../containers/errorHandler/errorHandler'
import * as actions from '../../../store/actions'
import PageContext from '../../Context/page'
import { RequestsContext } from '../../Context/requests'
import Spinner from '../../UI/spinner/spinner'
import Tiles from '../../UI/tiles/tiles'
import css from './home.module.css'

const Home = props => {
  const { setRequests, setIsRequests } = useContext(RequestsContext)
  const [notes, setNotes] = useState([])
  const { isAuthenticated, userID, onLoading, onReleaseError } = props
  const { page, setPage } = useContext(PageContext)
  const [sortBy, setSortBy] = useState('latest')
  const wrappedSetRequests = useCallback(setRequests, [])
  const wrappedSetPage = useCallback(setPage, [])
  const [fetched, setFetched] = useState(null)
  const wrappedSetIsRequests = useCallback(setIsRequests, [])
  const [err, setErr] = useState(null)

  useEffect(() => wrappedSetPage('1'), [wrappedSetPage])

  useEffect(() => {
    const fetch = async () => {
      try {
        let url = '/api/v1/note',
          sort = ''
        if (sortBy === 'most_liked') sort = '&sort=-likesCount'
        const res = (await Axios.get(url + sort)).data.data
        if (res) setNotes(res)
        if (isAuthenticated) {
          const fetch = async () => {
            let res = (await axios.get('user/me')).data.data
            const arr = res.createdPosts
              .map(el => el.requests)
              .reduce((a, c) => a.concat(c), [])
              .filter(l => !l.accepted)
              .concat(
                res.collaboratedPosts
                  .map(el => el.requests)
                  .reduce((a, c) => a.concat(c), [])
                  .filter(l => l.accepted && l.userId === userID)
              )
              .concat(
                !Object.is(res.consumedPosts, null)
                  ? res.consumedPosts
                      .map(el => el.requests)
                      .reduce((a, c) => a.concat(c), [])
                      .filter(l => l.accepted && l.userId === userID)
                  : []
              )
            const newArr = arr.reduce((A, c) => {
              A.forEach(l => {
                if (
                  l._id !== c._id &&
                  l.userId === c.userId &&
                  l.reqType === c.reqType &&
                  l.noteId === c.noteId
                )
                  return A.splice(A.indexOf(l), 1)
              })
              return A
            }, arr)
            wrappedSetRequests(newArr)
            setFetched(true)
          }
          fetch()
        } else {
          setFetched(true)
        }
      } catch {
        setErr(`Couldn't load data. Please try again later`)
      }
    }
    fetch()

    return () => onReleaseError()
  }, [
    page,
    wrappedSetPage,
    sortBy,
    isAuthenticated,
    userID,
    wrappedSetRequests,
    wrappedSetIsRequests,
    onReleaseError,
  ])

  let home = null

  if (notes.length < 1) {
    home = (
      <h3 style={{ margin: '8% 2%', textAlign: 'center' }}>
        Nothing to see here. Start adding!
      </h3>
    )
  } else {
    home = (
      <div className={css.tiles}>
        <Tiles data={notes} TLength={20} BLength={130} />
      </div>
    )
  }

  const output = e => setSortBy(e.target.value)

  return !err ? (
    <div className={css.Home}>
      <div className={css.Header}>
        <div>Notes</div>
        <div>
          <select onChange={output}>
            <option value="latest">Latest</option>
            <option value="most_liked">Most Liked</option>
          </select>
        </div>
      </div>
      {onLoading || !fetched ? <Spinner /> : home}
    </div>
  ) : (
    <h3 style={{ margin: 'auto' }}>{err}</h3>
  )
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
    onReleaseError: () => dispatch(actions.releaseError()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorHandler(Home, axios))

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import axios from '../../../axios'
import ErrorHandler from '../../../containers/errorHandler/errorHandler'
import { RequestsContext } from '../../Context/requests'
import Spinner from '../../UI/spinner/spinner'
import Request from './request/request'
import css from './requests.module.css'

const Requests = props => {
  const [thisRequests, setThisRequests] = useState([])

  const { requests, setIsRequests, setRequests } = useContext(RequestsContext)

  const WrappedIsRequests = useCallback(setIsRequests, [])

  const WrappedSetRequests = useCallback(setRequests, [])

  const { isAuthenticated, userID } = props

  useEffect(() => {
    WrappedIsRequests(false)
    const fetch = async (userId, noteId, reqType) => {
      const user = (await axios.get(`/user/${userId}`)).data.data
      const note = (await axios.get(`/note/${noteId}`)).data.data
      setThisRequests(prevState => [...prevState, [user, note, reqType]])
    }
    requests.forEach(el => {
      const { userId, noteId, reqType } = el
      fetch(userId, noteId, reqType)
    })
    return () => {
      if (isAuthenticated) {
        const fetch = async () => {
          const res = (await axios.get(`user/me`)).data.data
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
            .reduce((A, c, i, a) => {
              let el = true
              for (let l in a) {
                if (
                  i !== a.indexOf(l) &&
                  l.userId === c.userId &&
                  l.reqType === c.reqType &&
                  l.noteId === c.noteId
                ) {
                  el = false
                }
              }
              return A.concat(el ? c : null)
            }, [])
            .filter(l => l !== null)
          WrappedSetRequests(arr)
        }
        fetch()
      }
    }
  }, [WrappedIsRequests, requests, isAuthenticated, userID, WrappedSetRequests])

  let op
  if (thisRequests.length > 0) {
    op = thisRequests.map(el => {
      return (
        <Request
          key={el[0].id + el[2] + el[1].id}
          user={el[0]}
          reqType={el[2]}
          note={el[1]}
        />
      )
    })
  } else {
    op = <h4>Sorry! Nothing to see here</h4>
  }

  return (
    <div className={css.requests}>
      {thisRequests.length === requests.length ? op : <Spinner />}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    userID: state.auth.userId,
  }
}

export default ErrorHandler(connect(mapStateToProps)(Requests), axios)

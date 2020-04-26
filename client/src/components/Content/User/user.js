import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Photo from '../../../assets/user/default.jpg'
import axios from '../../../axios'
import ErrorHandler from '../../../containers/errorHandler/errorHandler'
import Image from '../../UI/Images/Images'
import Spinner from '../../UI/spinner/spinner'
import css from './user.module.css'

const User = props => {
  const [user, setUser] = useState({})

  const { isAuthenticated } = props

  const [fetched, setFetched] = useState(false)

  useEffect(() => {
    /* const getData = async () => {
      try {
        const res = await axios.get('user/me')
        setUser(res.data.data)
      } finally {
        setFetched(true)
      }
    } */
    if (isAuthenticated) {
      // getData()
      ;(async () => {
        try {
          const res = await axios.get('user/me')
          setUser(res.data.data)
        } finally {
          setFetched(true)
        }
      })()
    }
  }, [isAuthenticated])

  let show

  if (!props.isAuthenticated) {
    show = (
      <div className={css.user}>
        <h4>You need to login/ signup to view your profile</h4>
      </div>
    )
  } else {
    if (fetched) {
      show = (
        <div className={css.user}>
          <div className={css.credentials}>
            <div className={css.Name}>
              <div>{`${user.firstName}`}</div>
              <div>{`${user.lastName}`}</div>
            </div>
            <Image src={Photo} css={css.Photo} />
          </div>
          <div className={css.info}>
            <span>Username:</span>
            <div>{`${user.username}`}</div>
            <span>Email:</span>
            <div>{`${user.email}`}</div>
            <span>
              Password:
              <button onClick={() => props.history.push('/changePassword')}>
                Change Password
              </button>
            </span>
            <div>********</div>
          </div>
        </div>
      )
    } else {
      show = (
        <div className={css.user}>
          <Spinner />
        </div>
      )
    }
  }

  return show
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
  }
}

export default ErrorHandler(connect(mapStateToProps)(withRouter(User)), axios)

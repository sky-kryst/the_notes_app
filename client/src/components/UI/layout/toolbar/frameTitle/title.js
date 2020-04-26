import React from 'react'
import { withRouter } from 'react-router-dom'
import css from './title.module.css'

const Title = props => {
  const homeDirect = () => props.history.push('/')

  return (
    <div className={css.text} onClick={homeDirect}>
      The Notes App
    </div>
  )
}

export default withRouter(Title)

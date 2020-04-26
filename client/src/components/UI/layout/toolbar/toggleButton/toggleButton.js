import React from 'react'
import css from './toggleButton.module.css'

const toggler = props => {
  return (
    <div className={css.toggleButton} onClick={props.clicked}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default toggler

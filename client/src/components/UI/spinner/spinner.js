import React from 'react'
import css from './spinner.module.css'

const spinner = () => {
  return (
    <div className={css.spinner}>
      <div className={css.loader}>Loading...</div>
    </div>
  )
}

export default spinner

import React from 'react'
import css from './toolbar.module.css'
import ToggleButton from './toggleButton/toggleButton'
import Title from './frameTitle/title'
import Links from './links/links'

const toolbar = props => {
  return (
    <header className={css.toolbar}>
      <ToggleButton clicked={props.toggler} />
      <Title/>
      <Links />
    </header>
  )
}

export default toolbar

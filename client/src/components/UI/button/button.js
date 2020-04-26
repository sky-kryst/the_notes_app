import React from 'react'
import style from './button.module.css'

const button = props => {

  /* <div className={style.Button} onClick={props.clicked}>
      <button className={style.Button} onClick={props.clicked}>
        {props.children}
      </button>
    </div> */
  return (
    <button className={style.Button} onClick={props.clicked}>
      {props.children}
    </button>
  )
}

export default button

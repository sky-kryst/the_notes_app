import React, { useEffect } from 'react'
import css from './Input.module.css'

const Input = props => {
  let i
  const inputClasses = [css.InputElement]

  useEffect(() => {
    if (!props.invalid || !props.shouldValidate || !props.touched) {
      inputClasses.push(css.Invalid)
    }
  }, [props.invalid, props.shouldValidate, props.touched, inputClasses])

  if (props.type) {
    i = (
      <input
        className={inputClasses.join(' ')}
        type={props.type}
        onChange={props.changed}
      ></input>
    )
  }

  return i
}

export default Input

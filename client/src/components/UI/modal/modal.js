import React, { Fragment, memo } from 'react'
import Backdrop from '../backdrop/backdrop'
import css from './modal.module.css'

const equalProps = (prevProps, nextProps) =>
  nextProps.show === prevProps.show && nextProps.children === prevProps.children

const modal = props => {
  return (
    <Fragment>
      <Backdrop show={props.show} clicked={props.modalClosed} />
      <div
        className={css.Modal}
        style={{
          transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
          opacity: props.show ? '1' : '0',
        }}
      >
        {props.children}
      </div>
    </Fragment>
  )
}

export default memo(modal, equalProps)

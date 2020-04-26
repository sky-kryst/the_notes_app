import React, { Component } from 'react'
import css from './sideDock.module.css'
import Button from '../../button/button'
import { withRouter } from 'react-router-dom'

class sideDock extends Component{

  onCreateHandler = event => {
    event.preventDefault()
    this.props.history.push('/create')
  }

  onEditHandler = event => {
    event.preventDefault()
    this.props.history.push('/edit')
  }

  render() {
      return (
        <div className={css.dock}>
          <Button clicked={this.onCreateHandler}>Create</Button>
          <Button clicked={this.onEditHandler}>Edit</Button>
          <Button clicked={this.onEditHandler}>Delete</Button>
        </div>
      )
    }
};

export default withRouter(sideDock);
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import BackDrop from '../../backdrop/backdrop'
import css from './sideDrawer.module.css'

class sideDrawer extends Component {
  onClickHandler = (event, where) => {
    event.preventDefault()
    if (where === 'Home') {
      this.props.history.push('/')
    }
    if (where === 'Profile') {
      this.props.history.push('/user')
    }
    if (where === 'Your Notes') {
      this.props.history.push('/edit')
    }
    if (where.endsWith('t')) {
      this.props.history.push('/logout')
    }
    if (where.endsWith('n')) {
      this.props.history.push('/login')
    }
  }

  render() {
    let Class
    const resource = [
      'Home',
      'Profile',
      'Your Notes',
      this.props.isAuthenticated ? 'Logout' : 'Login',
    ]
    this.props.show ? (Class = css.open) : (Class = css.close)
    return (
      <Fragment>
        <BackDrop show={this.props.show} clicked={this.props.close} />
        <div className={Class}>
          <header>The Notes App</header>
          <nav onClick={this.props.clicked}>
            {resource.map(el => {
              return (
                <div key={el} onClick={event => this.onClickHandler(event, el)}>
                  <a href="/">{el}</a>
                </div>
              )
            })}
          </nav>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
  }
}

export default withRouter(connect(mapStateToProps)(sideDrawer))

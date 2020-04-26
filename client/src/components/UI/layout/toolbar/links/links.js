import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { RequestsContext } from '../../../../Context/requests'
import css from './links.module.css'

class links extends Component {
  static contextType = RequestsContext

  onClickHandler = (event, where) => {
    event.preventDefault()
    if (where === 'req') {
      this.props.history.push('/requests')
    }
    if (where === 'log') {
      this.props.isAuthenticated
        ? this.props.history.push('/logout')
        : this.props.history.push('/login')
    }
    if (where === 'pro') {
      this.props.history.push('/user')
    }
  }
  render() {
    return (
      <div>
        <nav className={css.link}>
          <a
            className={css.anchor}
            href="/"
            onClick={event => this.onClickHandler(event, 'req')}
          >
            Requests
          </a>
          <span
            className={this.context.isRequests ? css.red : null}
            style={{ margin: '0' }}
            onClick={event => this.onClickHandler(event, 'req')}
          >
            {this.context.requests.length > 0 && this.context.isRequests
              ? this.context.requests.length
              : null}
          </span>
          <a
            className={css.anchor}
            href="/"
            onClick={event => this.onClickHandler(event, 'log')}
          >
            {this.props.isAuthenticated ? 'Logout' : 'Login'}
          </a>
          <a
            className={css.anchor}
            href="/"
            onClick={event => this.onClickHandler(event, 'pro')}
          >
            Profile
          </a>
        </nav>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
  }
}

export default withRouter(connect(mapStateToProps)(links))

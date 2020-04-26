import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import * as actions from '../../../../store/actions'
import { RequestsContext } from '../../../Context/requests'

class Logout extends Component {
  static contextType = RequestsContext
  componentDidMount() {
    this.context.setRequests([])
    this.props.onLogout()
  }

  render() {
    return <Redirect to="/" />
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actions.logout()),
  }
}

export default connect(null, mapDispatchToProps)(Logout)

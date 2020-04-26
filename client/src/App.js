import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import style from './App.module.css'
import ChangePassword from './components/Content/changePassword/changePassword'
import ForgotPassword from './components/Content/forgotPassword/forgotPassword'
import Home from './components/Content/home/home'
import Login from './components/Content/login/login'
import Logout from './components/Content/login/logout/logout'
import Note from './components/Content/note/note'
import Notes from './components/Content/notes/notes'
import NotLogged from './components/Content/NotLogged/notLogged'
import Read from './components/Content/read/read'
import Requests from './components/Content/Requests/requests'
import ResetPassword from './components/Content/resetPassword/resetPassword'
import Signup from './components/Content/signup/signup'
import User from './components/Content/User/user'
import { PermissionContextProvider } from './components/Context/permissions'
import RequestsContextProvider from './components/Context/requests'
import Layout from './components/UI/layout/layout'
import * as actions from './store/actions'

const App = props => {
  const { isAuthenticated, onTryAutoSignup } = props

  useEffect(() => {
    onTryAutoSignup()
  }, [onTryAutoSignup])

  let routes
  if (isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/requests" component={Requests} />
        <Route path="/logout" component={Logout} />
        <Route path="/create" component={Note} />
        <Route path="/edit" component={Notes} />
        <Route path="/note" component={Read} />
        <Route path="/user" component={User} />
        <Route path="/changePassword" component={ChangePassword} />
        <Route
          path="/"
          exact
          render={() => <Home isAuthenticated={isAuthenticated} />}
        />
        <Redirect to="/" />
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/forgotPassword" component={ForgotPassword} />
        <Route path="/resetPassword" component={ResetPassword} />
        <Route path="/" exact component={Home} />
        <Route path="/notLogged" component={NotLogged} />
        <Redirect to="/notLogged" />
      </Switch>
    )
  }
  return (
    <div className={style.App}>
      <RequestsContextProvider>
        <Layout>
          <PermissionContextProvider>{routes}</PermissionContextProvider>
        </Layout>
      </RequestsContextProvider>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))

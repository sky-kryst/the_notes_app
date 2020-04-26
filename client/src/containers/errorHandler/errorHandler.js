import React, { Component, Fragment } from 'react'
import PermissionContext from '../../components/Context/permissions'
import Button from '../../components/UI/button/button'
import Modal from '../../components/UI/modal/modal'
import Spinner from '../../components/UI/spinner/spinner'
import * as click from '../../utils/onClick'
import style from './errorHandler.module.css'

const errorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null,
    }

    static contextType = PermissionContext

    UNSAFE_componentWillMount() {
      this.reqInterceptor = axios.interceptors.request.use(req => {
        this.setState({ error: null })
        return req
      })
      this.resInterceptor = axios.interceptors.response.use(
        res => res,
        error => {
          this.setState({
            error: error.response.data,
          })
        }
      )
      this.context.setPermission('')
    }

    onStaticError() {
      this.setState({
        error: { message: 'Are you sure you want to delete this note?' },
      })
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor)
      axios.interceptors.response.eject(this.resInterceptor)
    }

    errorConfirmedHandler = () => {
      this.setState({ error: null })
      if (this.context.permission === 'delete') {
        click.onDeleteHandler(this.props.userID, this.props.noteID, this.props)
      }
    }

    onClickedHandler = () => {
      const fetch = async () => {
        const url = `/user/${localStorage.getItem('userId')}/note/request`
        const body = {
          noteId: this.state.error.error.doc,
          type: this.state.error.error.type,
        }
        const res = await axios.patch(url, body)
        if (res.data.data === true) this.setState({ error: null })
      }
      fetch()
    }

    render() {
      let op = <Spinner />

      if (this.state.error) {
        op = (
          <div className={style.Error}>
            <p>{this.state.error.message}</p>
            <div>
              <Button clicked={this.errorConfirmedHandler}>
                {this.context.permission === 'delete' ? 'Yes' : 'OK'}
              </Button>
              {this.context.permission === 'edit' ||
              this.context.permission === 'view' ? (
                <Button clicked={this.onClickedHandler}>Send Request</Button>
              ) : null}
            </div>
          </div>
        )
      }

      return (
        <Fragment>
          <Modal
            show={this.state.error}
            modalClosed={() => this.setState({ error: null })}
          >
            {op}
          </Modal>
          <WrappedComponent
            {...this.props}
            onSet={() => this.onStaticError()}
          />
        </Fragment>
      )
    }
  }
}

export default errorHandler

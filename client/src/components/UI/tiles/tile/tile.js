import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from '../../../../axios'
import * as actions from '../../../../store/actions'
import * as click from '../../../../utils/onClick'
import PermissionContext from '../../../Context/permissions'
import style from './tile.module.css'

class Tile extends Component {
  static contextType = PermissionContext

  onLikehandler = async () => {
    this.props.onLoadingStart()
    await axios.patch(`user/${this.props.userID}/note/${this.props.id}/like`)
    window.location.reload()
  }

  render() {
    return (
      <div className={style.tile}>
        <div
          className={style.title}
          onClick={() =>
            click.onViewHandler(
              this.props.userID,
              this.props.id,
              this.context,
              this.props
            )
          }
        >
          {this.props.title.length > this.props.tLength
            ? `${this.props.title.slice(0, this.props.tLength)}...`
            : this.props.title}
        </div>
        <div
          className={style.body}
          onClick={() =>
            click.onViewHandler(
              this.props.userID,
              this.props.id,
              this.context,
              this.props
            )
          }
        >
          {this.props.body.length > this.props.bLength
            ? `${this.props.body.slice(0, this.props.bLength)}...`
            : this.props.body}
        </div>
        <div className={style.buttons}>
          <div className={style.like} onClick={this.onLikehandler}>
            <button className={style.like}>{`${this.props.likes}❤`}</button>
          </div>
          <div
            className={style.view}
            onClick={() =>
              click.onViewHandler(
                this.props.userID,
                this.props.id,
                this.context,
                this.props
              )
            }
          >
            <button>View</button>
          </div>
          <div
            className={style.edit}
            onClick={() =>
              click.onEditHandler(
                this.props.userID,
                this.props.id,
                this.context,
                this.props
              )
            }
          >
            <button className={style.edit}>Edit</button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = s => {
  return {
    userID: s.auth.userId,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLoadingStart: () => dispatch(actions.loadingStart()),
    onLoadingEnd: () => dispatch(actions.loadingEnd()),
    onNotesIdSet: id => dispatch(actions.idCapture(id)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Tile))

import React, { Component } from 'react'
import { PageContextProvider } from '../../Context/page'
import css from './layout.module.css'
// import PageNo from './pageNo/pageNo'
import SideDock from './sideDock/sideDock'
import SideDrawer from './sideDrawer/sideDrawer'
import Toolbar from './toolbar/toolbar'
// import SideNav from '../sideNav/sideNav'

class Layout extends Component {
  state = {
    sideDrawerShow: false,
  }

  drawerToggle = () => {
    this.setState({ sideDrawerShow: !this.state.sideDrawerShow })
  }

  render() {
    return (
      <div className={css.layout}>
        <SideDrawer
          show={this.state.sideDrawerShow}
          close={this.drawerToggle}
          clicked={this.drawerToggle}
        />
        <Toolbar title={this.state.thisPageTitle} toggler={this.drawerToggle} />
        <SideDock />
        <PageContextProvider>
          <main className={css.content}>{this.props.children}</main>
          {/* <PageNo /> */}
        </PageContextProvider>
        {/* <SideNav/> */}
      </div>
    )
  }
}

export default Layout

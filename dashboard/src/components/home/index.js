import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { Layout } from "antd";

import Sidebar from "../sidebar";
import CustomHeader from "../customHeader";
import Campaigns from "../campaigns";
import CampaignStats from "../campaignStats";

import "./styles.less";

const { Content } = Layout;

class Home extends Component {
  state = {
    sidebarCollapsed: false
  };

  onSidebarCollapse = (collapsed) => {
    this.setState({
      sidebarCollapsed: collapsed
    });
  };

  render() {
    const { sidebarCollapsed } = this.state;
    const { location } = this.props;

    const title = location.pathname.slice(1).split("/")[0];

    return (
      <Layout className="home">
        <Sidebar collapsed={sidebarCollapsed} handleCollapse={this.onSidebarCollapse} />
        <Layout className="home__body">
          <CustomHeader title={title} />
          <Content className="home__content">
            <div className="home__card">
              <Switch>
                <Route exact path="/campaigns" component={Campaigns} />
                <Route path="/campaigns/:name" component={CampaignStats} />
                <Redirect to="/campaigns" />
              </Switch>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  };
};

const mapStateToProps = state => {
  return {
    profile: state.user.profile
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     onUserSignout: () => dispatch(signoutUser())
//   };
// };

export default connect(mapStateToProps)(Home);

import React from "react";
import { Layout, Menu, Icon } from "antd";

import logo from "../../assets/logo.svg";
import "./styles.less";

const { Sider } = Layout;

const Sidebar = (props) => {
  const { collapsed, handleCollapse } = props;

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={handleCollapse} className="sidebar">
      <div className="sidebar__logo">
        <img src={logo} />
      </div>
      <Menu defaultSelectedKeys={["campaigns"]} className="sidebar__menu" theme="dark" mode="inline">
        <Menu.Item key="campaigns">
          <Icon type="bars" />
          <span>Campaigns</span>
        </Menu.Item>
        <Menu.Item key="analytics">
          <Icon type="bar-chart" />
          <span>Analytics</span>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default Sidebar;

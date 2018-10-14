import React from "react";
import { Layout, Input, Avatar, Badge, Icon } from "antd";
import { capitalize } from "underscore.string";


import "./styles.less";

const { Header } = Layout;
const { Search } = Input;

const CustomHeader = (props) => {
  const { title } = props;

  return (
    <Header className="header">
      <h1 className="header__title">{capitalize(title)}</h1>
      <Search className="header__search" placeholder="Search" />
      <div>
        <Badge dot>
          <Icon type="notification" />
        </Badge>
        <Avatar size="small" icon="user" />
      </div>
    </Header>
  );
}

export default CustomHeader;

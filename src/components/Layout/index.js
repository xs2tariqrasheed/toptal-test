import React from "react";
import { Layout, Menu, Avatar, Popover, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import "./style.css";

const { Header, Sider, Content } = Layout;

class AppLayout extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Layout>
        <Sider
          theme="light"
          className="sider"
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo" />
          <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              nav 1
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              nav 2
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              nav 3
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(
              this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: this.toggle,
              }
            )}
            <Popover
              placement="bottom"
              title={this.props.user?.email}
              content={
                <Button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/auth/login";
                  }}
                  size="small"
                  type="link"
                >
                  Logout
                </Button>
              }
              trigger="click"
            >
              <Avatar
                style={{
                  // color: "#f56a00",
                  // backgroundColor: "#fde3cf",
                  float: "right",
                  marginTop: 15,
                  marginRight: 15,
                  cursor: "pointer",
                }}
              >
                {this.props.user?.email?.slice(0, 1).toUpperCase()}
              </Avatar>
            </Popover>
          </Header>
          <Content
            className="site-layout-background shadow"
            style={{
              margin: "24px 16px",
              //   padding: 24,
              minHeight: 280,
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default AppLayout;

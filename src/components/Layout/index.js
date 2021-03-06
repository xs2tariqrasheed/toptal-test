import React, { useState } from "react";
import { Layout, Menu, Avatar, Popover, Button, Divider } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  AntDesignOutlined,
  BgColorsOutlined,
  UnorderedListOutlined,
  GlobalOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import "./style.css";
import { useHistory } from "react-router";
import { MANAGER, REGULAR } from "../../constants";

const { Header, Sider, Content } = Layout;

const AppLayout = (props) => {
  const { user } = props;
  const history = useHistory();
  const [collapsed, setCollapsed] = useState();

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
      <Sider
        theme="light"
        className="sider"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="logo" />
        <Menu
          onSelect={({ key }) => {
            history.push(key);
          }}
          theme="light"
          mode="inline"
          defaultSelectedKeys={[history.location.pathname]}
        >
          <Divider />
          {user.type === MANAGER ? (
            <>
              <Menu.Item key="/admin/bikes" icon={<AntDesignOutlined />}>
                Bikes
              </Menu.Item>
              <Menu.Item key="/admin/colors" icon={<BgColorsOutlined />}>
                Colors
              </Menu.Item>
              <Menu.Item key="/admin/models" icon={<UnorderedListOutlined />}>
                Bike Models
              </Menu.Item>
              <Menu.Item key="/admin/locations" icon={<GlobalOutlined />}>
                Locations
              </Menu.Item>
              <Divider />
              <Menu.Item key="/admin/users/regular" icon={<UserOutlined />}>
                Users
              </Menu.Item>
            </>
          ) : (
            ""
          )}

          {user.type === REGULAR ? (
            <>
              <Menu.Item key="/bikes" icon={<AntDesignOutlined />}>
                Bikes
              </Menu.Item>
              <Menu.Item key="/bookings" icon={<CalendarOutlined />}>
                My Bookings
              </Menu.Item>
            </>
          ) : (
            ""
          )}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}
          <Popover
            placement="bottom"
            title={props.user?.email}
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
                float: "right",
                marginTop: 15,
                marginRight: 15,
                cursor: "pointer",
              }}
            >
              {props.user?.email?.slice(0, 1).toUpperCase()}
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
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;

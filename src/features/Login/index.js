import classnames from "classnames";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Typography, Divider } from "antd";

import useLoading from "../../hooks/useLoading";
import { login } from "../../utils/auth";

import styles from "./Login.module.css";

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { loading, func: onFinish } = useLoading(
    async (values) => {
      await login(values, dispatch);
    },
    false,
    true
  );

  return (
    <div className={classnames(styles.loginForm, "shadow")}>
      <Form
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <div align="center">
          <Typography.Title level={2}>Bike Rental</Typography.Title>
          <Divider />
          <Typography.Title level={3}>Login</Typography.Title>
        </div>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
            {
              type: "email",
              required: true,
              message: "Please input a valid email!",
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item>
          <Button
            loading={loading}
            size="large"
            block
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
        <Button
          onClick={() => history.push("/auth/register")}
          size="large"
          type="link"
        >
          Don't have account? Sign-Up here.
        </Button>
      </Form>
    </div>
  );
};

export default Login;

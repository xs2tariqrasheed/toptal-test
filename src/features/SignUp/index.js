import classnames from "classnames";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Typography, Divider } from "antd";

import useLoading from "../../hooks/useLoading";
import { registerUser } from "../../utils/auth";

import styles from "./SignUp.module.css";
import { REGULAR } from "../../constants";

const SignUp = () => {
  const history = useHistory();

  const { loading, func: onFinish } = useLoading(
    async (values) => {
      const user = await registerUser({ ...values, type: REGULAR });
      if (user) history.push("/auth/login");
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
          <Typography.Title level={4}>Sign Up</Typography.Title>
        </div>
        <Form.Item
          name="firstName"
          rules={[
            {
              required: true,
              message: "Please input your first name!",
            },
          ]}
        >
          <Input placeholder="First Name" size="large" />
        </Form.Item>
        <Form.Item
          name="lastName"
          rules={[
            {
              required: true,
              message: "Please input your last name!",
            },
          ]}
        >
          <Input placeholder="Last Name" size="large" />
        </Form.Item>
        <Form.Item
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
          <Input placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password placeholder="Password" size="large" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: "Please input your password again!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Re-Enter Password" size="large" />
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
          onClick={() => history.push("/auth/login")}
          size="large"
          type="link"
        >
          Already have account? Sign-in here.
        </Button>
      </Form>
    </div>
  );
};

export default SignUp;

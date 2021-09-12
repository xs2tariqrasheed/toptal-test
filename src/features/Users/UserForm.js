import { Form, Input, Button, message } from "antd";

import { setDoc, serverTimestamp } from "../../firebase";
import useLoading from "../../hooks/useLoading";
import { registerUser, updateUser as _updateUser } from "../../utils/auth";
import uuid from "../../utils/uuid";

const UserForm = ({
  setVisible,
  unsetUserToBeEdited,
  userToBeEdited,
  fetchUserList,
  userType,
}) => {
  const { loading: createLoading, func: createUser } = useLoading(
    async (values) => {
      await registerUser({ ...values, type: userType });
      fetchUserList();
      setVisible(false);
    }
  );

  const { loading: updateLoading, func: updateUser } = useLoading(
    async (values) => {
      await _updateUser({
        oldEmail: userToBeEdited.email,
        oldPassword: userToBeEdited.password,
        data: {
          ...values,
          type: userType,
        },
      });
      fetchUserList();
    }
  );

  const loading = createLoading || updateLoading;

  const onFinish = (values) => {
    console.log("Success:", values);
    if (editMode) updateUser(values);
    else createUser({ ...values, createdAt: serverTimestamp() });
  };

  const editMode = !!userToBeEdited;

  return (
    <Form
      name="basic"
      layout="vertical"
      initialValues={userToBeEdited}
      onFinish={onFinish}
    >
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
          className="float-right"
          type="primary"
          htmlType="submit"
        >
          {editMode ? "Save" : "Create"}
        </Button>
        <Button
          onClick={() => {
            setVisible(false);

            if (editMode) unsetUserToBeEdited();
          }}
          className="right-margin-10 float-right"
        >
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;

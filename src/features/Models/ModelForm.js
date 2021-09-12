import { Form, Input, Button, message } from "antd";

import { setDoc, serverTimestamp } from "../../firebase";
import useLoading from "../../hooks/useLoading";
import uuid from "../../utils/uuid";

const ModelForm = ({
  setVisible,
  unsetModelToBeEdited,
  modelToBeEdited,
  fetchModelList,
}) => {
  const { loading: createLoading, func: createModel } = useLoading(
    async (values) => {
      await setDoc("/models/" + uuid(), values);
      fetchModelList();
      setVisible(false);
      message.success("Model created successfully");
    }
  );

  const { loading: updateLoading, func: updateModel } = useLoading(
    async (values) => {
      await setDoc("/models/" + modelToBeEdited.id, {
        ...values,
        createdAt: modelToBeEdited.createdAt,
      });
      fetchModelList();
      message.success("Model updated successfully");
    }
  );

  const loading = createLoading || updateLoading;

  const onFinish = (values) => {
    console.log("Success:", values);
    if (editMode) updateModel(values);
    else createModel({ ...values, createdAt: serverTimestamp() });
  };

  const editMode = !!modelToBeEdited;

  return (
    <Form name="basic" initialValues={modelToBeEdited} onFinish={onFinish}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Required!" }]}
      >
        <Input />
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

            if (editMode) unsetModelToBeEdited();
          }}
          className="right-margin-10 float-right"
        >
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ModelForm;

import { Form, Input, Button, message } from "antd";
import { setDoc } from "../../firebase";
import useLoading from "../../hooks/useLoading";
import uuid from "../../utils/uuid";

const ColorForm = ({
  setVisible,
  unsetColorToBeEdited,
  colorToBeEdited,
  fetchColorList,
}) => {
  const { loading: createLoading, func: createColor } = useLoading(
    async (values) => {
      await setDoc("/colors/" + uuid(), values);
      fetchColorList();
      setVisible(false);
      message.success("Color created successfully");
    }
  );

  const { loading: updateLoading, func: updateColor } = useLoading(
    async (values) => {
      await setDoc("/colors/" + colorToBeEdited.id, values);
      // unsetColorToBeEdited({ colorId: colorToBeEdited.id });
      fetchColorList();
      message.success("Color updated successfully");
    }
  );

  const loading = createLoading || updateLoading;

  const onFinish = (values) => {
    console.log("Success:", values);
    if (editMode) updateColor(values);
    else createColor(values);
  };

  const editMode = !!colorToBeEdited;

  return (
    <Form name="basic" initialValues={colorToBeEdited} onFinish={onFinish}>
      {/* todo: replace color name with correct color picker */}
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
          Submit
        </Button>
        <Button
          onClick={() => {
            setVisible(false);

            if (editMode) unsetColorToBeEdited();
          }}
          className="right-margin-10 float-right"
        >
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ColorForm;

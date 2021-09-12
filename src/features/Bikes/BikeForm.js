import { Form, Input, Button, message, Select, Checkbox } from "antd";

import { setDoc, serverTimestamp } from "../../firebase";
import useLoading from "../../hooks/useLoading";
import uuid from "../../utils/uuid";

const BikeForm = ({
  setVisible,
  unsetBikeToBeEdited,
  bikeToBeEdited,
  fetchBikeList,
  modelList,
  locationList,
  colorList,
}) => {
  const { loading: createLoading, func: createBike } = useLoading(
    async (values) => {
      await setDoc("/bikes/" + uuid(), values);
      fetchBikeList();
      setVisible(false);
      message.success("Bike created successfully");
    }
  );

  const { loading: updateLoading, func: updateBike } = useLoading(
    async (values) => {
      await setDoc("/bikes/" + bikeToBeEdited.id, {
        ...values,
        createdAt: bikeToBeEdited.createdAt,
      });
      fetchBikeList();
      message.success("Bike updated successfully");
    }
  );

  const loading = createLoading || updateLoading;

  const onFinish = (values) => {
    console.log("Success:", values);
    if (editMode) updateBike(values);
    else createBike({ ...values, createdAt: serverTimestamp() });
  };

  const editMode = !!bikeToBeEdited;

  return (
    <Form
      name="basic"
      initialValues={bikeToBeEdited}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Required!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Model"
        name="modelId"
        rules={[{ required: true, message: "Required!" }]}
      >
        <Select
          placeholder="Select a model"
          options={modelList.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          allowClear
        />
      </Form.Item>
      <Form.Item
        label="Color"
        name="colorId"
        rules={[{ required: true, message: "Required!" }]}
      >
        <Select
          placeholder="Select a color"
          options={colorList.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          allowClear
        />
      </Form.Item>
      <Form.Item
        label="Location"
        name="locationId"
        rules={[{ required: true, message: "Required!" }]}
      >
        <Select
          placeholder="Select a Location"
          options={locationList.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          allowClear
        />
      </Form.Item>
      <Form.Item name="available" valuePropName="checked">
        <Checkbox>Is Available</Checkbox>
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

            if (editMode) unsetBikeToBeEdited();
          }}
          className="right-margin-10 float-right"
        >
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BikeForm;

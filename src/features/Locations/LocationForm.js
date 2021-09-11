import { Form, Input, Button, message } from "antd";

import { setDoc, serverTimestamp } from "../../firebase";
import useLoading from "../../hooks/useLoading";
import uuid from "../../utils/uuid";

const LocationForm = ({
  setVisible,
  unsetLocationToBeEdited,
  locationToBeEdited,
  fetchLocationList,
}) => {
  const { loading: createLoading, func: createLocation } = useLoading(
    async (values) => {
      await setDoc("/locations/" + uuid(), values);
      fetchLocationList();
      setVisible(false);
      message.success("Location created successfully");
    }
  );

  const { loading: updateLoading, func: updateLocation } = useLoading(
    async (values) => {
      await setDoc("/locations/" + locationToBeEdited.id, {
        ...values,
        createdAt: locationToBeEdited.createdAt,
      });
      fetchLocationList();
      message.success("Location updated successfully");
    }
  );

  const loading = createLoading || updateLoading;

  const onFinish = (values) => {
    console.log("Success:", values);
    if (editMode) updateLocation(values);
    else createLocation({ ...values, createdAt: serverTimestamp() });
  };

  const editMode = !!locationToBeEdited;

  return (
    <Form name="basic" initialValues={locationToBeEdited} onFinish={onFinish}>
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

            if (editMode) unsetLocationToBeEdited();
          }}
          className="right-margin-10 float-right"
        >
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LocationForm;

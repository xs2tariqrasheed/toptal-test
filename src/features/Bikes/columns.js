import { Button, Popconfirm, Tag } from "antd";

export const getBikesColumns = ({
  setBikeToBeEdited,
  dispatch,
  deleteBike,
}) => {
  return [
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      render: (value) => <span className="capital">{value}</span>,
    },
    {
      title: "Model",
      dataIndex: ["model", "name"],
      key: "modelName",
      render: (value) => <span className="capital">{value}</span>,
    },
    {
      title: "Color",
      dataIndex: ["color", "name"],
      key: "colorName",
      render: (value) => <span className="capital">{value}</span>,
    },
    {
      title: "Location",
      dataIndex: ["location", "name"],
      key: "locationName",
      render: (value) => <span className="capital">{value}</span>,
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "available",
      render: (value) =>
        value ? <Tag color="success">YES</Tag> : <Tag color="error">NO</Tag>,
    },
    {
      align: "center",
      title: "ACTIONS",
      dataIndex: "actions",
      key: "actions",
      render: (_, obj) => (
        <>
          <Button
            className="right-margin-10"
            size="small"
            onClick={() => {
              dispatch(setBikeToBeEdited({ bikeId: obj.id }));
            }}
            type="text"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete it?"
            onConfirm={() => deleteBike(obj.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" type="text" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
};

import { Button, Popconfirm } from "antd";

export const getColorsColumns = ({
  setColorToBeEdited,
  dispatch,
  deleteColor,
}) => {
  return [
    {
      title: "NAME",
      dataIndex: "name",
      width: "40%",
      key: "name",
      render: (value) => <span className="capital">{value}</span>,
    },
    {
      title: "Color",
      dataIndex: "name",
      width: "30%",
      key: "color",
      render: (value) => (
        <div
          style={{
            backgroundColor: `${value}`,
            height: 20,
            width: 50,
          }}
        />
      ),
    },
    {
      align: "center",
      title: "ACTIONS",
      dataIndex: "actions",
      width: "30%",
      key: "actions",
      render: (_, obj) => (
        <>
          <Button
            className="right-margin-10"
            size="small"
            onClick={() => {
              dispatch(setColorToBeEdited({ colorId: obj.id }));
            }}
            type="text"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete it?"
            onConfirm={() => deleteColor(obj.id)}
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

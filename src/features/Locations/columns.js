import { Button, Popconfirm } from "antd";

export const getLocationsColumns = ({
  setLocationToBeEdited,
  dispatch,
  deleteLocation,
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
              dispatch(setLocationToBeEdited({ locationId: obj.id }));
            }}
            type="text"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete it?"
            onConfirm={() => deleteLocation(obj.id)}
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

import { Button, Popconfirm } from "antd";

export const getModelsColumns = ({
  setModelToBeEdited,
  dispatch,
  deleteModel,
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
              dispatch(setModelToBeEdited({ modelId: obj.id }));
            }}
            type="text"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete it?"
            onConfirm={() => deleteModel(obj.id)}
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

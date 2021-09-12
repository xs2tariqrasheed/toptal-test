import { Button, Popconfirm, Tag } from "antd";
import { REGULAR } from "../../constants";

export const getBikesColumns = ({ user, cancelBooking }) => {
  const cols = [
    {
      title: "BIKE NAME",
      dataIndex: ["bike", "name"],
      key: "name",
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      key: "endDate",
    },

    {
      title: "Model",
      dataIndex: ["bike", "model", "name"],
      key: "modelName",
    },
    {
      title: "Color",
      dataIndex: ["bike", "color", "name"],
      key: "colorName",
    },
    {
      title: "Location",
      dataIndex: ["bike", "location", "name"],
      key: "locationName",
    },
  ];

  if (user.type === REGULAR) {
    cols.push({
      align: "center",
      title: "ACTIONS",
      dataIndex: "actions",
      key: "actions",
      render: (_, obj) => (
        <>
          <Popconfirm
            title="Are you sure you want to cancel it?"
            onConfirm={() => cancelBooking(obj)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" type="text" danger>
              Cancel
            </Button>
          </Popconfirm>
        </>
      ),
    });
  }

  return cols;
};

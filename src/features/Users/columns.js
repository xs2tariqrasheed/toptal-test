import { Button, Popconfirm } from "antd";
import { REGULAR } from "../../constants";

export const getUsersColumns = ({
  setUserToBeEdited,
  dispatch,
  deleteUser,
  userType,
  setUserToGetBikes,
}) => {
  const cols = [
    {
      title: "FIRST NAME",
      dataIndex: "firstName",
      key: "firstName",
    },

    {
      title: "LAST NAME",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
    },
  ];

  if (userType === REGULAR) {
    cols.push({
      align: "center",
      title: "Bookings",
      dataIndex: "Bookings",
      key: "Bookings",
      render: (_, obj) => (
        <Button
          onClick={() => {
            dispatch(setUserToGetBikes({ userId: obj.userId }));
          }}
          type="link"
        >
          Bookings
        </Button>
      ),
    });
  }

  return cols.concat([
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
              dispatch(setUserToBeEdited({ userId: obj.id }));
            }}
            type="text"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete it?"
            onConfirm={() => deleteUser(obj.id)}
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
  ]);
};

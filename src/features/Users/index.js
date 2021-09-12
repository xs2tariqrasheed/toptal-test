import { message, Table, Modal, Radio, Card, Divider, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import showNewlyAddedRowFeedback from "../../utils/showNewlyAddedRowFeedback";
import TableCard from "../../components/TableCard";
import useLoading from "../../hooks/useLoading";
import { getUsersColumns } from "./columns";
import { deleteDoc } from "../../firebase";
import UserForm from "./UserForm";
import {
  setSearch,
  fetchUsers,
  selectUsers,
  setUserToBeEdited,
  selectUsersLoading,
  unsetUserToBeEdited,
  selectUserToBeEdited,
  setShouldShowNewlyAddedRowFeedback,
  SelectShouldShowNewlyAddedRowFeedback,
  selectUserToGetBikes,
  setUserToGetBikes,
  unsetUserToGetBikes,
} from "./usersSlice";
import { useHistory } from "react-router";
import { MANAGER, REGULAR } from "../../constants";
import Bikes from "../BikesWithBookings";
import {
  fetchBookings,
  selectBookings,
  selectBookingsLoading,
} from "../Bookings/bookingsSlice";

function Users({ userType }) {
  const users = useSelector(selectUsers);
  const listLoading = useSelector(selectUsersLoading);
  const userToBeEdited = useSelector(selectUserToBeEdited);
  const shouldShowNewlyAddedRowFeedback = useSelector(
    SelectShouldShowNewlyAddedRowFeedback
  );
  const userToGetBikes = useSelector(selectUserToGetBikes);

  // bookings
  const bookings = useSelector(selectBookings);
  const bookingsLoading = useSelector(selectBookingsLoading);

  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [onlyWithBookings, setOnlyWithBookings] = useState(false);

  const history = useHistory();

  const { loading: deleteLoading, func: deleteUser } = useLoading(
    async (id) => {
      await deleteDoc("/users/" + id);
      await fetchUserList();
      message.success("User deleted successfully");
    }
  );

  function fetchUserList() {
    dispatch(fetchBookings());
    dispatch(fetchUsers());
  }

  useEffect(() => {
    fetchUserList();
  }, []);

  useEffect(() => {
    if (shouldShowNewlyAddedRowFeedback) {
      showNewlyAddedRowFeedback();
      dispatch(setShouldShowNewlyAddedRowFeedback({ value: false }));
    }
  }, [dispatch, shouldShowNewlyAddedRowFeedback]);

  const hideModal = () => {
    setVisible(false);
    dispatch(unsetUserToBeEdited({ userId: userToBeEdited?.id }));
  };

  const onSearch = ({ target: { value } }) =>
    dispatch(setSearch({ search: value }));

  const editMode = !!userToBeEdited;

  const hideBikesModal = () => {
    dispatch(unsetUserToGetBikes({ userId: userToGetBikes.userId }));
  };

  let usersList = users;
  console.log(userType === REGULAR && onlyWithBookings, onlyWithBookings);
  if (userType === REGULAR && onlyWithBookings) {
    usersList = usersList.filter((user) =>
      bookings.some((b) => b.renterId === user.userId)
    );
  }
  return (
    <>
      <Modal
        destroyOnClose
        onCancel={hideBikesModal}
        visible={!!userToGetBikes}
        title={null}
        footer={null}
        width="80%"
        centered
      >
        {userToGetBikes?.userId ? <Bikes userId={userToGetBikes.userId} /> : ""}
      </Modal>
      <Modal
        destroyOnClose
        onCancel={hideModal}
        visible={visible || !!userToBeEdited}
        title={editMode ? "Update User" : "Create new User"}
        footer={null}
      >
        <UserForm
          userType={userType}
          fetchUserList={fetchUserList}
          unsetUserToBeEdited={hideModal}
          userToBeEdited={userToBeEdited}
          setVisible={setVisible}
        />
      </Modal>
      <TableCard
        title="Manage Users"
        onSearch={onSearch}
        loading={listLoading || bookingsLoading}
        onCreateClick={() => {
          setVisible(true);
        }}
        onRefreshClick={() => {
          fetchUserList();
        }}
        extra={
          <>
            {userType === REGULAR ? (
              <Checkbox
                checked={onlyWithBookings}
                onChange={({ target: { checked } }) =>
                  setOnlyWithBookings(checked)
                }
              >
                Only With Bookings
              </Checkbox>
            ) : (
              ""
            )}
            <Radio.Group
              style={{ marginRight: 10 }}
              defaultValue={userType}
              onChange={({ target: { value } }) =>
                history.push("/admin/users/" + value)
              }
            >
              <Radio.Button value={REGULAR}>Regular</Radio.Button>
              <Radio.Button value={MANAGER}>Manager</Radio.Button>
            </Radio.Group>
          </>
        }
      >
        <Table
          rowClassName={(record, index) =>
            index === 0 ? "newly-added-todo" : ""
          }
          pagination={{
            hideOnSinglePage: true,
            pageSize: 15,
          }}
          rowKey="id"
          loading={listLoading || deleteLoading}
          size="small"
          columns={getUsersColumns({
            userType,
            setUserToBeEdited,
            dispatch,
            deleteUser,
            setUserToGetBikes,
          })}
          dataSource={usersList.filter((item) => item.type === userType)}
        />
      </TableCard>
    </>
  );
}

export default Users;

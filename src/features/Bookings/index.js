import { Table } from "antd";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import TableCard from "../../components/TableCard";
import { getBookingsColumns } from "./columns";
import {
  setSearch,
  fetchBookings,
  selectBookings,
  selectBookingsLoading,
} from "./bookingsSlice";
import { selectBikes, selectBikesLoading } from "../Bikes/bikesSlice";

function Bookings() {
  const bookings = useSelector(selectBookings);
  const listLoading = useSelector(selectBookingsLoading);

  // bikes
  const bikes = useSelector(selectBikes);
  const bikesLoading = useSelector(selectBikesLoading);

  const dispatch = useDispatch();

  function fetchBookingList() {
    dispatch(fetchBookings());
  }

  useEffect(() => {
    fetchBookingList();
  }, []);

  const onSearch = ({ target: { value } }) =>
    dispatch(setSearch({ search: value }));

  // const bookingWithBikes

  return (
    <>
      <TableCard
        hideCreateBtn
        title="Manage Bookings"
        onSearch={onSearch}
        loading={listLoading}
        onRefreshClick={() => {
          fetchBookingList();
        }}
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
          loading={listLoading}
          size="small"
          columns={getBookingsColumns({})}
          dataSource={bookings}
        />
      </TableCard>
    </>
  );
}

export default Bookings;

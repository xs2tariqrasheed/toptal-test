import { Table, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import TableCard from "../../components/TableCard";
import { getBikesColumns } from "./columns";
import {
  setSearch,
  fetchBikes,
  selectBikes,
  selectBikesLoading,
} from "./bikesWithBookingsSlice";
import {
  fetchModels,
  selectModels,
  selectModelsLoading,
} from "../Models/modelsSlice";
import {
  fetchLocations,
  selectLocations,
  selectLocationsLoading,
} from "../Locations/locationsSlice";
import {
  fetchColors,
  selectColors,
  selectColorsLoading,
} from "../Colors/colorsSlice";
import { selectUser } from "../App/appSlice";
import {
  fetchBookings,
  selectBookings,
  selectBookingsLoading,
} from "../Bookings/bookingsSlice";

const { RangePicker } = DatePicker;

function Bikes({ userId }) {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  // bikes
  const bikes = useSelector(selectBikes);
  const listLoading = useSelector(selectBikesLoading);

  // models
  const modelList = useSelector(selectModels);
  const modelListLoading = useSelector(selectModelsLoading);

  // locations
  const locationList = useSelector(selectLocations);
  const locationListLoading = useSelector(selectLocationsLoading);

  // colors
  const colorList = useSelector(selectColors);
  const colorListLoading = useSelector(selectColorsLoading);

  // bookings
  const bookings = useSelector(selectBookings);
  const bookingsLoading = useSelector(selectBookingsLoading);

  const [dateFilter, setDateFilter] = useState(["", ""]);

  function fetchBikeList() {
    dispatch(fetchModels());
    dispatch(fetchColors());
    dispatch(fetchLocations());
    dispatch(fetchBookings());
    dispatch(fetchBikes());
  }

  useEffect(() => {
    fetchBikeList();
  }, []);

  const onSearch = ({ target: { value } }) =>
    dispatch(setSearch({ search: value }));

  const dataLoading =
    modelListLoading ||
    locationListLoading ||
    colorListLoading ||
    bookingsLoading;

  const bikeList = bikes.map((item) => ({
    ...item,
    color: colorList.find((color) => color.id === item.colorId),
    location: locationList.find((location) => location.id === item.locationId),
    model: modelList.find((model) => model.id === item.modelId),
  }));

  let bookingList = bookings.map((item) => ({
    ...item,
    bike: bikeList.find((bike) => bike.id === item.bikeId),
  }));

  if (dateFilter[0] && dateFilter[1]) {
    const startFilter = moment(dateFilter[0]);
    const endFilter = moment(dateFilter[1]);
    bookingList = bookingList.filter((item) => {
      const bookingStart = moment(item.startDate);
      const bookingEnd = moment(item.endDate);
      return bookingStart >= startFilter && endFilter >= bookingEnd;
    });
  }

  return (
    <>
      <TableCard
        hideCreateBtn
        title="Bikes"
        onSearch={onSearch}
        loading={listLoading || dataLoading}
        onRefreshClick={() => {
          fetchBikeList();
        }}
        extra={
          <RangePicker
            style={{ marginRight: 10 }}
            onChange={(_, dates) => {
              setDateFilter(dates);
            }}
          />
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
          loading={listLoading}
          size="small"
          columns={getBikesColumns({})}
          dataSource={bookingList.filter((item) => item.renterId === userId)}
        />
      </TableCard>
    </>
  );
}

export default Bikes;

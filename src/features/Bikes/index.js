import {
  message,
  Table,
  Modal,
  List,
  Card,
  Button,
  Form,
  DatePicker,
  Select,
  Divider,
  Popover,
  Rate,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import showNewlyAddedRowFeedback from "../../utils/showNewlyAddedRowFeedback";
import TableCard from "../../components/TableCard";
import useLoading from "../../hooks/useLoading";
import { getBikesColumns } from "./columns";
import { deleteDoc, setDoc } from "../../firebase";
import BikeForm from "./BikeForm";
import {
  setSearch,
  fetchBikes,
  selectBikes,
  setBikeToBeEdited,
  selectBikesLoading,
  unsetBikeToBeEdited,
  selectBikeToBeEdited,
  setShouldShowNewlyAddedRowFeedback,
  selectShouldShowNewlyAddedRowFeedback,
  selectBikeToBeBooked,
  unsetBikeToBeBooked,
  setBikeToBeBooked,
  selectRatings,
  selectRatingLoading,
  fetchRatings,
} from "./bikesSlice";
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
import uuid from "../../utils/uuid";
import { MANAGER, REGULAR } from "../../constants";

const { RangePicker } = DatePicker;

function Bikes({ userId }) {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  // bikes
  const bikes = useSelector(selectBikes);
  const listLoading = useSelector(selectBikesLoading);

  const bikeToBeEdited = useSelector(selectBikeToBeEdited);
  const shouldShowNewlyAddedRowFeedback = useSelector(
    selectShouldShowNewlyAddedRowFeedback
  );

  const bikeToBeBooked = useSelector(selectBikeToBeBooked);

  // models
  const modelList = useSelector(selectModels);
  const modelListLoading = useSelector(selectModelsLoading);

  // locations
  const locationList = useSelector(selectLocations);
  const locationListLoading = useSelector(selectLocationsLoading);

  // colors
  const colorList = useSelector(selectColors);
  const colorListLoading = useSelector(selectColorsLoading);

  // ratings
  const ratings = useSelector(selectRatings);
  const ratingListLoading = useSelector(selectRatingLoading);

  const [visible, setVisible] = useState(false);

  // filters
  const [modelIdFilter, setModelIdFilter] = useState(null);
  const [colorIdFilter, setColorIdFilter] = useState(null);
  const [locationIdFilter, setLocationIdFilter] = useState(null);
  const [ratingFilter, setRatingFilter] = useState(null);

  const { loading: deleteLoading, func: deleteBike } = useLoading(
    async (id) => {
      await deleteDoc("/bikes/" + id);
      fetchBikeList();
      message.success("Bike deleted successfully");
    }
  );

  const hideModalBookModal = () => {
    dispatch(unsetBikeToBeBooked({ bikeId: bikeToBeBooked?.id }));
  };

  const { loading: bookingLoading, func: createBooking } = useLoading(
    async (values) => {
      await setDoc("/bookings/" + uuid(), values);
      await setDoc("/bikes/" + bikeToBeBooked.id, {
        ...bikeToBeBooked,
        shouldEdit: false,
        shouldBook: false,
        available: false,
      });
      hideModalBookModal();
      fetchBikeList();
      message.success("Bike is booked successfully");
    }
  );

  const { loading: ratingLoading, func: rateBike } = useLoading(
    async (data) => {
      await setDoc("/ratings/" + user.userId + data.id, {
        bikeId: data.id,
        rating: data.rating,
      });
      message.success("Rating saved!");
      fetchBikeList();
    }
  );

  function fetchBikeList() {
    dispatch(fetchModels());
    dispatch(fetchColors());
    dispatch(fetchLocations());
    dispatch(fetchRatings());
    dispatch(fetchBikes());
  }

  useEffect(() => {
    fetchBikeList();
  }, []);

  useEffect(() => {
    if (shouldShowNewlyAddedRowFeedback) {
      showNewlyAddedRowFeedback();
      dispatch(setShouldShowNewlyAddedRowFeedback({ value: false }));
    }
  }, [dispatch, shouldShowNewlyAddedRowFeedback]);

  const hideModal = () => {
    setVisible(false);
    dispatch(unsetBikeToBeEdited({ bikeId: bikeToBeEdited?.id }));
  };

  const onSearch = ({ target: { value } }) =>
    dispatch(setSearch({ search: value }));

  const editMode = !!bikeToBeEdited;

  const dataLoading =
    modelListLoading || locationListLoading || colorListLoading;

  const bikeList = bikes.map((item) => ({
    ...item,
    color: colorList.find((color) => color.id === item.colorId),
    location: locationList.find((location) => location.id === item.locationId),
    model: modelList.find((model) => model.id === item.modelId),
    rating: (() => {
      const bikeRatings = ratings.filter((r) => r.bikeId === item.id);
      if (bikeRatings.length) {
        let sum = 0;
        bikeRatings.forEach((r) => {
          sum += r.rating;
        });
        console.log(sum);
        return Math.round(sum / bikeRatings.length);
      }
      return 0;
    })(),
  }));

  console.log(ratings, "???? ratings");

  return (
    <>
      {/* regular */}
      {user?.type === REGULAR ? (
        <>
          <Modal
            destroyOnClose
            onCancel={hideModalBookModal}
            visible={!!bikeToBeBooked}
            title={userId ? "Bikes" : `Book ${bikeToBeBooked?.name} bike`}
            footer={null}
          >
            <Form
              layout="vertical"
              name="bookingForm"
              onFinish={(values) =>
                createBooking({
                  startDate: values.bookingDates[0].format("YYYY-MM-DD"),
                  endDate: values.bookingDates[1].format("YYYY-MM-DD"),
                  renterId: user.userId,
                  bikeId: bikeToBeBooked.id,
                })
              }
            >
              <Form.Item
                label="Booking Dates"
                name="bookingDates"
                rules={[{ required: true, message: "Required!" }]}
              >
                <RangePicker
                  disabledDate={(current) =>
                    current &&
                    current < moment().subtract(1, "days").endOf("day")
                  }
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 50 }}>
                <Button
                  size="large"
                  block
                  loading={bookingLoading}
                  className="float-right"
                  type="primary"
                  htmlType="submit"
                >
                  BOOK THIS BIKE
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <TableCard
            hideCreateBtn
            title="Bikes"
            onSearch={onSearch}
            loading={listLoading || dataLoading}
            onCreateClick={() => {
              setVisible(true);
            }}
            onRefreshClick={() => {
              fetchBikeList();
            }}
            extra={
              <>
                <Select
                  onSelect={(modelId) => setModelIdFilter(modelId)}
                  onClear={() => setModelIdFilter(null)}
                  dropdownMatchSelectWidth={false}
                  style={{ width: 150, marginRight: 10 }}
                  placeholder="Model"
                  options={modelList.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  allowClear
                />
                <Select
                  onSelect={(colorId) => setColorIdFilter(colorId)}
                  onClear={() => setColorIdFilter(null)}
                  dropdownMatchSelectWidth={false}
                  style={{ width: 150, marginRight: 10 }}
                  placeholder="Color"
                  options={colorList.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  allowClear
                />
                <Select
                  onSelect={(locationId) => setLocationIdFilter(locationId)}
                  onClear={() => setLocationIdFilter(null)}
                  dropdownMatchSelectWidth={false}
                  style={{ width: 150, marginRight: 10 }}
                  placeholder="Location"
                  options={locationList.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  allowClear
                />
                <Select
                  onSelect={(ratingValue) => setRatingFilter(ratingValue)}
                  onClear={() => setRatingFilter(null)}
                  dropdownMatchSelectWidth={false}
                  style={{ width: 150, marginRight: 10 }}
                  placeholder="Average Rating"
                  options={new Array(5).fill(0).map((_, index) => ({
                    label: index + 1,
                    value: index + 1,
                  }))}
                  allowClear
                />
              </>
            }
          >
            <List
              loading={
                listLoading || dataLoading || ratingLoading || ratingListLoading
              }
              grid={{ gutter: 16, column: 4 }}
              dataSource={(() => {
                let list = bikeList;
                if (modelIdFilter) {
                  list = list.filter((item) => item.model.id === modelIdFilter);
                }
                if (colorIdFilter) {
                  list = list.filter((item) => item.color.id === colorIdFilter);
                }
                if (locationIdFilter) {
                  list = list.filter(
                    (item) => item.location.id === locationIdFilter
                  );
                }
                if (ratingFilter) {
                  list = list.filter((item) => item.rating === ratingFilter);
                }
                return list;
              })()}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    title={item.name}
                    extra={
                      <Popover
                        trigger="click"
                        content={
                          <Rate
                            onChange={(value) => {
                              rateBike({ ...item, rating: value });
                            }}
                          />
                        }
                      >
                        <Button size="small" type="primary">
                          Rate this Bike
                        </Button>
                      </Popover>
                    }
                  >
                    <List
                      size="small"
                      header={null}
                      footer={null}
                      bordered
                      dataSource={[
                        `${item?.color?.name} Color`,
                        `${item?.model?.name} Model`,
                        `${item?.location?.name} Location`,
                      ]}
                      renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                      Average Rating <Rate disabled value={item.rating} />
                    </div>
                    <Divider />
                    <Button
                      disabled={!item.available}
                      block
                      ghost
                      onClick={() =>
                        dispatch(setBikeToBeBooked({ bikeId: item.id }))
                      }
                      type="primary"
                    >
                      {!item.available ? "Not Available" : "BOOK"}
                    </Button>
                  </Card>
                </List.Item>
              )}
            />
          </TableCard>
        </>
      ) : (
        ""
      )}
      {/* manager */}
      {user.type === MANAGER ? (
        <>
          <Modal
            destroyOnClose
            onCancel={hideModal}
            visible={visible || !!bikeToBeEdited}
            title={editMode ? "Update Bike" : "Create new Bike"}
            footer={null}
          >
            <BikeForm
              colorList={colorList}
              locationList={locationList}
              modelList={modelList}
              fetchBikeList={fetchBikeList}
              unsetBikeToBeEdited={hideModal}
              bikeToBeEdited={bikeToBeEdited}
              setVisible={setVisible}
            />
          </Modal>
          <TableCard
            hideCreateBtn={!!userId}
            title="Manage Bikes"
            onSearch={onSearch}
            loading={listLoading || dataLoading}
            onCreateClick={() => {
              setVisible(true);
            }}
            onRefreshClick={() => {
              fetchBikeList();
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
              loading={listLoading || deleteLoading}
              size="small"
              columns={getBikesColumns({
                setBikeToBeEdited,
                dispatch,
                deleteBike,
              })}
              dataSource={bikeList}
            />
          </TableCard>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default Bikes;

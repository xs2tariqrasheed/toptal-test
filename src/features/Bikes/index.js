import {
  message,
  Table,
  Modal,
  List,
  Card,
  Button,
  Form,
  DatePicker,
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

const { RangePicker } = DatePicker;

function Bikes() {
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

  const [visible, setVisible] = useState(false);

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

  function fetchBikeList() {
    dispatch(fetchModels());
    dispatch(fetchColors());
    dispatch(fetchLocations());
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
  }));

  console.log(bikeToBeBooked, "?????????????");

  return (
    <>
      {/* regular */}
      <Modal
        destroyOnClose
        onCancel={hideModalBookModal}
        visible={!!bikeToBeBooked}
        title={`Book ${bikeToBeBooked?.name} bike`}
        footer={null}
      >
        <Form
          layout="vertical"
          name="bookingForm"
          onFinish={(values) =>
            createBooking({
              startDate: values.bookingDates[0].format("DD-MM-YYYY"),
              endDate: values.bookingDates[1].format("DD-MM-YYYY"),
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
                current && current < moment().subtract(1, "days").endOf("day")
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
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={bikeList.filter((item) => item.available)}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={item.name}
              extra={
                <Button
                  onClick={() =>
                    dispatch(setBikeToBeBooked({ bikeId: item.id }))
                  }
                  size="small"
                  type="primary"
                >
                  Book
                </Button>
              }
            >
              <List
                size="small"
                header={null}
                footer={null}
                bordered
                dataSource={[
                  `${item.color.name} Color`,
                  `${item.model.name} Model`,
                  `${item.location.name} Location`,
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Card>
          </List.Item>
        )}
      />
      {/* manager */}
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
  );
}

export default Bikes;

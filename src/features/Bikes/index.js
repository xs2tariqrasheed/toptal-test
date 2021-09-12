import { message, Table, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import showNewlyAddedRowFeedback from "../../utils/showNewlyAddedRowFeedback";
import TableCard from "../../components/TableCard";
import useLoading from "../../hooks/useLoading";
import { getBikesColumns } from "./columns";
import { deleteDoc } from "../../firebase";
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

function Bikes() {
  const dispatch = useDispatch();

  // bikes
  const bikes = useSelector(selectBikes);
  const listLoading = useSelector(selectBikesLoading);
  const bikeToBeEdited = useSelector(selectBikeToBeEdited);
  const shouldShowNewlyAddedRowFeedback = useSelector(
    selectShouldShowNewlyAddedRowFeedback
  );

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

  function fetchBikeList() {
    dispatch(fetchBikes());
  }

  useEffect(() => {
    dispatch(fetchModels());
    dispatch(fetchColors());
    dispatch(fetchLocations());
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
  return (
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

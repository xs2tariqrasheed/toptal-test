import { message, Table, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import showNewlyAddedRowFeedback from "../../utils/showNewlyAddedRowFeedback";
import TableCard from "../../components/TableCard";
import useLoading from "../../hooks/useLoading";
import { getLocationsColumns } from "./columns";
import { deleteDoc } from "../../firebase";
import LocationForm from "./LocationForm";
import {
  setSearch,
  fetchLocations,
  selectLocations,
  setLocationToBeEdited,
  selectLocationsLoading,
  unsetLocationToBeEdited,
  selectLocationToBeEdited,
  setShouldShowNewlyAddedRowFeedback,
  SelectShouldShowNewlyAddedRowFeedback,
} from "./locationsSlice";

function Locations() {
  const locations = useSelector(selectLocations);
  const listLoading = useSelector(selectLocationsLoading);
  const locationToBeEdited = useSelector(selectLocationToBeEdited);
  const shouldShowNewlyAddedRowFeedback = useSelector(
    SelectShouldShowNewlyAddedRowFeedback
  );
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const { loading: deleteLoading, func: deleteLocation } = useLoading(
    async (id) => {
      await deleteDoc("/locations/" + id);
      await fetchLocationList();
      message.success("Location deleted successfully");
    }
  );

  function fetchLocationList() {
    dispatch(fetchLocations());
  }

  useEffect(() => {
    fetchLocationList();
  }, []);

  useEffect(() => {
    if (shouldShowNewlyAddedRowFeedback) {
      showNewlyAddedRowFeedback();
      dispatch(setShouldShowNewlyAddedRowFeedback({ value: false }));
    }
  }, [dispatch, shouldShowNewlyAddedRowFeedback]);

  const hideModal = () => {
    setVisible(false);
    dispatch(unsetLocationToBeEdited({ locationId: locationToBeEdited?.id }));
  };

  const onSearch = ({ target: { value } }) =>
    dispatch(setSearch({ search: value }));

  const editMode = !!locationToBeEdited;

  return (
    <>
      <Modal
        destroyOnClose
        onCancel={hideModal}
        visible={visible || !!locationToBeEdited}
        title={editMode ? "Update Location" : "Create new Location"}
        footer={null}
      >
        <LocationForm
          fetchLocationList={fetchLocationList}
          unsetLocationToBeEdited={hideModal}
          locationToBeEdited={locationToBeEdited}
          setVisible={setVisible}
        />
      </Modal>
      <TableCard
        title="Manage Locations"
        onSearch={onSearch}
        loading={listLoading}
        onCreateClick={() => {
          setVisible(true);
        }}
        onRefreshClick={() => {
          fetchLocationList();
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
          columns={getLocationsColumns({
            setLocationToBeEdited,
            dispatch,
            deleteLocation,
          })}
          dataSource={locations}
        />
      </TableCard>
    </>
  );
}

export default Locations;

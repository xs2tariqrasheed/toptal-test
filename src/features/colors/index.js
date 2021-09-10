import { message, Table, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import showNewlyAddedRowFeedback from "../../utils/showNewlyAddedRowFeedback";
import TableCard from "../../components/TableCard";
import useLoading from "../../hooks/useLoading";
import { getColorsColumns } from "./columns";
import { deleteDoc } from "../../firebase";
import ColorForm from "./ColorForm";
import {
  setSearch,
  fetchColors,
  selectColors,
  setColorToBeEdited,
  selectColorsLoading,
  unsetColorToBeEdited,
  selectColorToBeEdited,
  setShouldShowNewlyAddedRowFeedback,
  SelectShouldShowNewlyAddedRowFeedback,
} from "./colorsSlice";

function Colors() {
  const colors = useSelector(selectColors);
  const listLoading = useSelector(selectColorsLoading);
  const colorToBeEdited = useSelector(selectColorToBeEdited);
  const shouldShowNewlyAddedRowFeedback = useSelector(
    SelectShouldShowNewlyAddedRowFeedback
  );
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const { loading: deleteLoading, func: deleteColor } = useLoading(
    async (id) => {
      await deleteDoc("/colors/" + id);
      await fetchColorList();
      message.success("Color deleted successfully");
    }
  );

  function fetchColorList() {
    dispatch(fetchColors());
  }

  useEffect(() => {
    fetchColorList();
  }, []);

  useEffect(() => {
    if (shouldShowNewlyAddedRowFeedback) {
      showNewlyAddedRowFeedback();
      dispatch(setShouldShowNewlyAddedRowFeedback({ value: false }));
    }
  }, [dispatch, shouldShowNewlyAddedRowFeedback]);

  const hideModal = () => {
    setVisible(false);
    dispatch(unsetColorToBeEdited({ colorId: colorToBeEdited?.id }));
  };

  const onSearch = ({ target: { value } }) =>
    dispatch(setSearch({ search: value }));

  const editMode = !!colorToBeEdited;

  return (
    <>
      {/* <pre>{visible.toString()}</pre> */}
      {/* <pre>{JSON.stringify(colors, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(colorToBeEdited, null, 2)}</pre> */}
      <Modal
        destroyOnClose
        onCancel={hideModal}
        visible={visible || !!colorToBeEdited}
        title={editMode ? "Update Color" : "Create new Color"}
        footer={null}
      >
        <ColorForm
          fetchColorList={fetchColorList}
          unsetColorToBeEdited={hideModal}
          colorToBeEdited={colorToBeEdited}
          setVisible={setVisible}
        />
      </Modal>
      <TableCard
        title="Manage Colors"
        onSearch={onSearch}
        loading={listLoading}
        onCreateClick={() => {
          setVisible(true);
        }}
        onRefreshClick={() => {
          fetchColorList();
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
          columns={getColorsColumns({
            setColorToBeEdited,
            dispatch,
            deleteColor,
          })}
          dataSource={colors}
        />
      </TableCard>
    </>
  );
}

export default Colors;

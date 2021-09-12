import { message, Table, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import showNewlyAddedRowFeedback from "../../utils/showNewlyAddedRowFeedback";
import TableCard from "../../components/TableCard";
import useLoading from "../../hooks/useLoading";
import { getModelsColumns } from "./columns";
import { deleteDoc } from "../../firebase";
import ModelForm from "./ModelForm";
import {
  setSearch,
  fetchModels,
  selectModels,
  setModelToBeEdited,
  selectModelsLoading,
  unsetModelToBeEdited,
  selectModelToBeEdited,
  setShouldShowNewlyAddedRowFeedback,
  selectShouldShowNewlyAddedRowFeedback,
} from "./modelsSlice";

function Models() {
  const models = useSelector(selectModels);
  const listLoading = useSelector(selectModelsLoading);
  const modelToBeEdited = useSelector(selectModelToBeEdited);
  const shouldShowNewlyAddedRowFeedback = useSelector(
    selectShouldShowNewlyAddedRowFeedback
  );
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const { loading: deleteLoading, func: deleteModel } = useLoading(
    async (id) => {
      await deleteDoc("/models/" + id);
      await fetchModelList();
      message.success("Model deleted successfully");
    }
  );

  function fetchModelList() {
    dispatch(fetchModels());
  }

  useEffect(() => {
    fetchModelList();
  }, []);

  useEffect(() => {
    if (shouldShowNewlyAddedRowFeedback) {
      showNewlyAddedRowFeedback();
      dispatch(setShouldShowNewlyAddedRowFeedback({ value: false }));
    }
  }, [dispatch, shouldShowNewlyAddedRowFeedback]);

  const hideModal = () => {
    setVisible(false);
    dispatch(unsetModelToBeEdited({ modelId: modelToBeEdited?.id }));
  };

  const onSearch = ({ target: { value } }) =>
    dispatch(setSearch({ search: value }));

  const editMode = !!modelToBeEdited;

  return (
    <>
      <Modal
        destroyOnClose
        onCancel={hideModal}
        visible={visible || !!modelToBeEdited}
        title={editMode ? "Update Model" : "Create new Model"}
        footer={null}
      >
        <ModelForm
          fetchModelList={fetchModelList}
          unsetModelToBeEdited={hideModal}
          modelToBeEdited={modelToBeEdited}
          setVisible={setVisible}
        />
      </Modal>
      <TableCard
        title="Manage Models"
        onSearch={onSearch}
        loading={listLoading}
        onCreateClick={() => {
          setVisible(true);
        }}
        onRefreshClick={() => {
          fetchModelList();
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
          columns={getModelsColumns({
            setModelToBeEdited,
            dispatch,
            deleteModel,
          })}
          dataSource={models}
        />
      </TableCard>
    </>
  );
}

export default Models;

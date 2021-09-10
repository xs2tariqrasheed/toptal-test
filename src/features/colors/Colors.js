import { Button, Card, message, Popconfirm, Table, Modal } from "antd";
import { SyncOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectColors,
  selectColorsLoading,
  fetchColors,
  selectColorToBeEdited,
  setColorToBeEdited,
  unsetColorToBeEdited,
} from "./colorsSlice";
import AppLayout from "../../components/Layout";
import useLoading from "../../hooks/useLoading";
import { deleteDoc } from "../../firebase";
import ColorForm from "./ColorForm";

export function Colors() {
  const colors = useSelector(selectColors);
  const listLoading = useSelector(selectColorsLoading);
  const colorToBeEdited = useSelector(selectColorToBeEdited);
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

  const hideModal = () =>
    dispatch(unsetColorToBeEdited({ colorId: colorToBeEdited?.id }));

  return (
    <AppLayout>
      {/* <pre>{visible.toString()}</pre> */}
      {/* <pre>{JSON.stringify(colors, null, 2)}</pre> */}
      <pre>{JSON.stringify(colorToBeEdited, null, 2)}</pre>
      <Modal
        destroyOnClose
        onCancel={hideModal}
        visible={visible || !!colorToBeEdited}
        title="Create new Color"
        footer={null}
      >
        <ColorForm
          fetchColorList={fetchColorList}
          unsetColorToBeEdited={hideModal}
          colorToBeEdited={colorToBeEdited}
          setVisible={setVisible}
        />
      </Modal>
      <Card
        style={{ border: "0px", padding: 0 }}
        title="Manage Colors"
        extra={
          <>
            <Button
              disabled={listLoading}
              type="primary"
              ghost
              onClick={() => {
                fetchColorList();
              }}
            >
              <SyncOutlined spin={listLoading} /> Refresh
            </Button>
            <Button
              style={{ marginLeft: 10 }}
              disabled={listLoading}
              type="primary"
              onClick={() => {
                setVisible(true);
              }}
            >
              <PlusOutlined /> Create
            </Button>
          </>
        }
      >
        <Table
          rowKey="id"
          loading={listLoading || deleteLoading}
          pagination={false}
          size="small"
          columns={[
            {
              title: "NAME",
              dataIndex: "name",
              width: "40%",
              key: "name",
            },
            {
              title: "Color",
              dataIndex: "name",
              width: "30%",
              key: "color",
              render: (value) => (
                <div
                  style={{
                    backgroundColor: `${value}`,
                    height: 20,
                    width: 50,
                  }}
                />
              ),
            },
            {
              align: "center",
              title: "ACTIONS",
              dataIndex: "actions",
              width: "30%",
              key: "actions",
              render: (_, obj) => (
                <>
                  <Button
                    className="right-margin-10"
                    size="small"
                    onClick={() => {
                      dispatch(setColorToBeEdited({ colorId: obj.id }));
                    }}
                    type="text"
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to delete it?"
                    onConfirm={() => deleteColor(obj.id)}
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
          ]}
          dataSource={colors}
        />
      </Card>
    </AppLayout>
  );
}

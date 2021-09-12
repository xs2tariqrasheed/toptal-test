import { Button, Card, Input } from "antd";
import { SyncOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";

function TableCard(props) {
  const {
    title,
    onSearch,
    loading,
    onCreateClick,
    onRefreshClick,
    hideCreateBtn,
    extra,
  } = props;

  return (
    <Card
      style={{ border: "0px", padding: 0 }}
      title={title}
      extra={
        <>
          {extra ? extra : ""}
          <Input
            suffix={<SearchOutlined />}
            placeholder="Input search text"
            onChange={onSearch}
            style={{ width: 200, marginRight: 10 }}
          />
          <Button
            disabled={loading}
            type="primary"
            ghost
            onClick={onRefreshClick}
          >
            <SyncOutlined spin={loading} /> Refresh
          </Button>
          {!hideCreateBtn ? (
            <Button
              style={{ marginLeft: 10 }}
              disabled={loading}
              type="primary"
              onClick={onCreateClick}
            >
              <PlusOutlined /> Create
            </Button>
          ) : (
            ""
          )}
        </>
      }
    >
      {props.children}
    </Card>
  );
}

export default TableCard;

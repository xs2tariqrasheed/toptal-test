import { Button, Popconfirm, Tag } from "antd";

export const getBikesColumns = ({}) => {
  return [
    {
      title: "BIKE NAME",
      dataIndex: ["bike", "name"],
      key: "name",
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      key: "endDate",
    },

    {
      title: "Model",
      dataIndex: ["bike", "model", "name"],
      key: "modelName",
    },
    {
      title: "Color",
      dataIndex: ["bike", "color", "name"],
      key: "colorName",
    },
    {
      title: "Location",
      dataIndex: ["bike", "location", "name"],
      key: "locationName",
    },
  ];
};

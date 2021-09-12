export const getBookingsColumns = () => {
  return [
    {
      title: "START DATE",
      dataIndex: "startDate",
      width: "40%",
      key: "startDate",
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      width: "40%",
      key: "endDate",
    },
  ];
};

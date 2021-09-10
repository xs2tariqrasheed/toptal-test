export const constructSearchText = (obj) => {
  let text = "";
  Object.values(obj).forEach((value) => {
    text += String(value).trim().toLowerCase() + "|";
  });
  return text;
};

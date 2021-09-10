// sleep time expects milliseconds
const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export default sleep;

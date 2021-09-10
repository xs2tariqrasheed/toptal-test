import sleep from "./sleep";

const showNewlyAddedRowFeedback = async () => {
  document
    .getElementsByClassName("newly-added-todo")[0]
    .classList.add("animate-color");
  await sleep(500);
  document
    .getElementsByClassName("newly-added-todo")[0]
    .classList.remove("animate-color");
};

export default showNewlyAddedRowFeedback;

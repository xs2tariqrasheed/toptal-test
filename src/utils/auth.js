import { message } from "antd";
import { MANAGER, REGULAR } from "../constants";
import { setUser } from "../features/App/appSlice";
import {
  setDoc,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  getDoc,
  deleteUser as _deleteUser,
  deleteDoc,
} from "../firebase";
export const registerUser = async (data) => {
  try {
    const auth = getAuth();
    const { user } = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    await setDoc("/profiles/" + user.uid, { userId: user.uid, ...data });
    let feedbackMessage = "";
    feedbackMessage =
      data.type === REGULAR && "Regular user is created successfully";
    feedbackMessage =
      data.type === MANAGER && "Manager is created successfully";
    message.success(feedbackMessage);
  } catch (error) {
    console.error(error.message);
    message.error(error.message);
  }
};

export const login = async (data, dispatch) => {
  try {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, data.email, data.password);
    const profile = await getDoc("profiles", auth.currentUser.uid);
    const user = { ...data, ...profile };
    dispatch(setUser(user));
    localStorage.setItem("user", JSON.stringify(user));
    message.success("Login successfully!");
  } catch (error) {
    console.error(error.message);
    message.error(error.message);
  }
};

// todo: delete with admin sdk
export const deleteUser = async ({ email, password }) => {
  try {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
    await deleteDoc("/profiles/" + auth.currentUser.uid);
    await _deleteUser(auth.currentUser);

    const currentUser = JSON.parse(localStorage.getItem("user"));
    await signInWithEmailAndPassword(
      auth,
      currentUser.email,
      currentUser.password
    );
    message.success("User deleted successfully!");
  } catch (error) {
    console.error(error.message);
  }
};

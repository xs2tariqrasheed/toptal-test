import { message } from "antd";
import { MANAGER, REGULAR } from "../constants";
import { setUser } from "../features/App/appSlice";
import {
  setDoc,
  fetchDocs,
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  signInWithEmailAndPassword,
  getDoc,
  getByUniqueField,
} from "../firebase";
import uuid from "./uuid";
export const registerUser = async (data) => {
  try {
    const auth = getAuth();
    const { user } = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    await setDoc("/profiles/" + uuid(), { userId: user.uid, ...data });
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
    const profile = await getByUniqueField(
      "profiles",
      "userId",
      auth.currentUser.uid
    );
    const user = { ...data, ...profile };
    dispatch(setUser(user));
    localStorage.setItem("user", JSON.stringify(user));
    message.success("Login successfully!");
  } catch (error) {
    console.error(error.message);
    message.error(error.message);
  }
};

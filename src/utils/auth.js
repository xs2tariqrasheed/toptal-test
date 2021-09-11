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
  updateEmail,
  updatePassword,
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
    console.log(
      data.type === REGULAR,
      "data.type === REGULAR",
      data.type,
      REGULAR
    );
    if (data.type === REGULAR) {
      feedbackMessage = "Regular user is created successfully";
    } else if (data.type === MANAGER) {
      feedbackMessage = "Manager user is created successfully";
    }
    message.success(feedbackMessage);
    return user;
  } catch (error) {
    console.error(error.message);
    if (error.code === "auth/email-already-in-use") {
      message.error("User already exists, try with different email!");
    } else {
      message.error(error.code);
    }
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
    console.error(error);
    if (error.code === "auth/user-not-found") {
      message.error("User not found, please enter valid email/password!");
    } else {
      message.error(error.code);
    }
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
export const updateUser = async ({ oldEmail, oldPassword, data }) => {
  try {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, oldEmail, oldPassword);
    await updatePassword(auth.currentUser, data.password);
    await updateEmail(auth.currentUser, data.email);

    await setDoc("/profiles/" + auth.currentUser.uid, data);

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

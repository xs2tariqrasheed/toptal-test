import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
import Colors from "./features/Colors";
import "./App.css";
import { DatePicker } from "antd";
import AppLayout from "./components/Layout";
import {
  fetchDocs,
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  signInWithEmailAndPassword,
  getDoc,
} from "./firebase";
import { login, registerUser } from "./utils/auth";
import { MANAGER } from "./constants";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function name(params) {
      // const a = await fetchDocs("bikes");
      // console.log(a);

      // const auth = getAuth();
      // registerUser({
      //   email: "manage2@bikes.com",
      //   password: "admin123",
      //   type: MANAGER,
      //   firstName: "Tariq",
      //   lastName: "Rasheed",
      // });
      // console.log(auth.currentUser, "***");
      // signInWithEmailAndPassword(auth, "test@test.com", "admin123")
      //   .then((userCredential) => {
      //     // Signed in
      //     const user = userCredential.user;
      //     console.log(user, "????");
      //     // ...
      //   })
      //   .catch((error) => {
      //     const errorCode = error.code;
      //     const errorMessage = error.message;
      //   });
      try {
        login(
          {
            email: "manage2@bikes.com",
            password: "admin123",
          },
          dispatch
        );
        // const data = await getDoc(
        //   "profiles",
        //   "6481701e-b8d4-4833-b890-d3ed32c005dc"
        // );
        // console.log(data, "data");
        // await createUserWithEmailAndPassword(auth, "test@test.com", "admin123");
        // await signInWithEmailAndPassword(auth, "test@test.com", "admin123");
        // await updateProfile(auth.currentUser, {
        //   displayName: "Jane Q. User",
        //   photoURL: "https://example.com/jane-q-user/profile.jpg",
        // });
        // console.log(auth.currentUser, "currentUser");
      } catch (error) {
        console.log(error.message);
      }

      //
      // createUserWithEmailAndPassword(auth, "test@test.com", "admin123")
      //   .then((userCredential) => {
      //     // Signed in
      //     const user = userCredential.user;
      //     console.log(user, "????");
      //     // ...
      //   })
      //   .catch((error) => {
      //     const errorCode = error.code;
      //     const errorMessage = error.message;
      //     console.log(error, errorMessage);
      //     // ..
      //   });
    }
    name();
  }, []);

  return (
    <Router>
      <AppLayout>
        <Colors />
        {/* <div className="App">
        <DatePicker />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Counter />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <span>
            <span>Learn </span>
            <a
              className="App-link"
              href="https://reactjs.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              React
            </a>
            <span>, </span>
            <a
              className="App-link"
              href="https://redux.js.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redux
            </a>
            <span>, </span>
            <a
              className="App-link"
              href="https://redux-toolkit.js.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redux Toolkit
            </a>
            ,<span> and </span>
            <a
              className="App-link"
              href="https://react-redux.js.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Redux
            </a>
          </span>
        </header>
      </div>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>

        <hr />

      </div> */}
        {/* <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
      </Switch> */}
      </AppLayout>
    </Router>
  );
}

export default App;

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return <h2>Dashboard</h2>;
}

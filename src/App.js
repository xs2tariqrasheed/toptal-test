import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Colors from "./features/Colors";
import "./App.css";
import AppLayout from "./components/Layout";
import { useSelector } from "react-redux";
import { selectUser } from "./features/App/appSlice";
import { getAuth } from "@firebase/auth";
import Login from "./features/Login";
import sleep from "./utils/sleep";
import SignUp from "./features/SignUp";

function App(props) {
  const user = useSelector(selectUser);
  const history = useHistory();
  const auth = getAuth();

  useEffect(() => {
    async function _(params) {
      // const auth = getAuth();
      await sleep(2000);
      console.log(auth.currentUser, "??? test");
    }
    _();
  }, [auth]);

  useEffect(() => {
    console.log(props, "??? history");
  }, [props]);

  console.log(user, "????");

  if (!user) {
    // if (
    //   history.location.pathname !== "/auth/login" ||
    //   history.location.pathname !== "/auth/register"
    // ) {
    //   return (
    //     <Redirect
    //       to={{
    //         pathname: "/auth/login",
    //       }}
    //     />
    //   );
    // }
    return (
      <Router>
        <Switch>
          <Route exact path="/auth/login">
            <Login />
          </Route>
          <Route exact path="/auth/register">
            <SignUp />
          </Route>
          <Route
            path="/"
            render={({ location }) =>
              location.pathname !== "/auth/login" ||
              location.pathname !== "/auth/register" ? (
                <Redirect
                  to={{
                    pathname: "/auth/login",
                  }}
                />
              ) : null
            }
          />
        </Switch>
      </Router>
    );
  }

  return (
    <Router>
      <AppLayout>
        <Colors />
        {/* <div className="App">
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

import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { login } from "./utils/auth";
import Login from "./features/Login";
import SignUp from "./features/SignUp";
import Colors from "./features/Colors";
import AppLayout from "./components/Layout";
import { selectUser } from "./features/App/appSlice";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Locations from "./features/Locations";
import Models from "./features/Models";
import Bikes from "./features/Bikes";
import { MANAGER, REGULAR } from "./constants";
import Users from "./features/Users";
import Bookings from "./features/Bookings";

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function _() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        await login(user, dispatch);
      }
      setLoading(false);
    }
    _();
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 200 }}>
        <Spin size="large" spinning tip="Please wait..." />
      </div>
    );
  }
  if (!user) {
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
      <AppLayout user={user}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/admin/colors">
            <Colors />
          </Route>
          <Route path="/admin/models">
            <Models />
          </Route>
          <Route path="/admin/bikes">
            <Bikes />
          </Route>
          <Route path="/admin/locations">
            <Locations />
          </Route>{" "}
          <Route path="/admin/bookings">
            <Bookings />
          </Route>
          <Route path="/admin/users/regular">
            <Users userType={REGULAR} />
          </Route>
          <Route path="/admin/users/manager">
            <Users userType={MANAGER} />
          </Route>
          <Route path="/" render={({ location }) => "404"} />
        </Switch>
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

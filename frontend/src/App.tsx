import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import * as ROUTE from "~/constants/routes";
import NavBar from "./components/shared/NavBar";
import Preloader from "./components/shared/Preloader";
import PageNotFound from "./pages/error/PageNotFound";
import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Register from "./pages/register";
import { loginSuccess } from "./redux/action/authActions";
import ProfileRoute from "./routers/ProfileRoute";
import ProtectedRoute from "./routers/ProtectedRoute";
import PublicRoute from "./routers/PublicRoute";
import { checkAuthSession } from "./services/api";

function App() {
  const [isCheckingSession, setCheckingSession] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const { auth } = await checkAuthSession();

        dispatch(loginSuccess(auth));
        setCheckingSession(false);
      } catch (e) {
        console.log('ERROR', e);
        setCheckingSession(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isCheckingSession ? (
    <Preloader />
  ) : (
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <main className="min-h-screen">
            <Switch>
              <ProtectedRoute path={ROUTE.HOME} exact component={Home} />
              <PublicRoute path={ROUTE.REGISTER} component={Register} />
              <PublicRoute path={ROUTE.LOGIN} component={Login} />
              <ProfileRoute path={ROUTE.PROFILE} component={Profile} />
              <Route component={PageNotFound} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
}

export default App;

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as ROUTE from "~/constants/routes";
import NavBar from "./components/shared/NavBar";
import Preloader from "./components/shared/Preloader";
import PageNotFound from "./pages/error/PageNotFound";
import Home from "./pages/home";
import Login from "./pages/login";
import Post from "./pages/post";
import Profile from "./pages/profile";
import Register from "./pages/register";
import { loginSuccess } from "./redux/action/authActions";
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
          <ToastContainer
            position="bottom-left"
            autoClose={5000}
            transition={Slide}
            draggable={false}
            hideProgressBar={true}
            bodyStyle={{ paddingLeft: '15px' }}
          />
          <NavBar />
          <main className="min-h-screen">
            <Switch>
              <ProtectedRoute path={ROUTE.HOME} exact component={Home} />
              <ProtectedRoute path={ROUTE.POST} component={Post} />
              <PublicRoute path={ROUTE.REGISTER} component={Register} />
              <PublicRoute path={ROUTE.LOGIN} component={Login} />
              <ProtectedRoute path={ROUTE.PROFILE} component={Profile} />
              <Route component={PageNotFound} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
}

export default App;

import { createBrowserHistory } from 'history';
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Router, Switch } from "react-router-dom";
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as ROUTE from "~/constants/routes";
import Chats from './components/main/Chats';
import NavBar from "./components/shared/NavBar";
import Preloader from "./components/shared/Preloader";
import PageNotFound from "./pages/error/PageNotFound";
import Home from "./pages/home";
import Login from "./pages/login";
import Post from "./pages/post";
import Profile from "./pages/profile";
import Register from "./pages/register";
import Search from "./pages/search";
import { loginSuccess } from "./redux/action/authActions";
import ProtectedRoute from "./routers/ProtectedRoute";
import PublicRoute from "./routers/PublicRoute";
import { checkAuthSession } from "./services/api";
import socket from './socket/socket';

export const history = createBrowserHistory();

function App() {
  const [isCheckingSession, setCheckingSession] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const { auth } = await checkAuthSession();

        dispatch(loginSuccess(auth));

        socket.on('connect', () => {
          socket.emit('userConnect', auth.id);
          console.log('Client connected to socket.');
        });

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
      <Router history={history}>
        <main className="min-h-screen">
          <ToastContainer
            position="bottom-left"
            autoClose={5000}
            transition={Slide}
            draggable={false}
            hideProgressBar={true}
            bodyStyle={{ paddingLeft: '15px' }}
          />
          <NavBar />
          <Switch>
            <PublicRoute path={ROUTE.REGISTER} component={Register} />
            <PublicRoute path={ROUTE.LOGIN} component={Login} />
            <ProtectedRoute path={ROUTE.SEARCH} exact component={Search} />
            <ProtectedRoute path={ROUTE.HOME} exact component={Home} />
            <ProtectedRoute path={ROUTE.POST} component={Post} />
            <ProtectedRoute path={ROUTE.PROFILE} component={Profile} />
            <Route component={PageNotFound} />
          </Switch>
          <Chats />
        </main>
      </Router>
    );
}

export default App;

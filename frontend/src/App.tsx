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
import Chat from './pages/chat';
import PageNotFound from "./pages/error/PageNotFound";
import Home from "./pages/home";
import Login from "./pages/login";
import Post from "./pages/post";
import Profile from "./pages/profile";
import SocialAuthFailed from './pages/redirects/SocialAuthFailed';
import Register from "./pages/register";
import Search from "./pages/search";
import SuggestedPeople from './pages/suggested_people';
import { loginSuccess } from "./redux/action/authActions";
import ProtectedRoute from "./routers/ProtectedRoute";
import PublicRoute from "./routers/PublicRoute";
import { checkAuthSession } from "./services/api";
import socket from './socket/socket';

export const history = createBrowserHistory();

function App() {
  const [isCheckingSession, setCheckingSession] = useState(true);
  const dispatch = useDispatch();
  const isNotMobile = window.screen.width >= 800;

  useEffect(() => {
    (async () => {
      try {
        const { auth } = await checkAuthSession();

        dispatch(loginSuccess(auth));

        socket.on('connect', () => {
          socket.emit('userConnect', auth.id);
          console.log('Client connected to socket.');
        });

        // Try to reconnect again
        socket.on('error', function () {
          socket.emit('userConnect', auth.id);
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
        <main className="relative min-h-screen">
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
            <Route path={ROUTE.HOME} exact render={(props: any) => <Home key={Date.now()} {...props} />} />
            <ProtectedRoute path={ROUTE.POST} component={Post} />
            <ProtectedRoute path={ROUTE.PROFILE} component={Profile} />
            <ProtectedRoute path={ROUTE.CHAT} component={Chat} />
            <ProtectedRoute path={ROUTE.SUGGESTED_PEOPLE} component={SuggestedPeople} />
            <Route path={ROUTE.SOCIAL_AUTH_FAILED} component={SocialAuthFailed} />
            <Route component={PageNotFound} />
          </Switch>
          {isNotMobile && <Chats />}
        </main>
      </Router>
    );
}

export default App;

import { createBrowserHistory } from 'history';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Router, Switch } from "react-router-dom";
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Chats } from '~/components/main';
import { NavBar, Preloader } from "~/components/shared";
import * as ROUTE from "~/constants/routes";
import * as pages from '~/pages';
import { ProtectedRoute, PublicRoute } from "~/routers";
import { loginSuccess } from "./redux/action/authActions";
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
          <PublicRoute path={ROUTE.REGISTER} component={pages.Register} />
          <PublicRoute path={ROUTE.LOGIN} component={pages.Login} />
          <ProtectedRoute path={ROUTE.SEARCH} component={pages.Search} />
          <Route path={ROUTE.HOME} exact render={(props: any) => <pages.Home key={Date.now()} {...props} />} />
          <ProtectedRoute path={ROUTE.POST} component={pages.Post} />
          <ProtectedRoute path={ROUTE.PROFILE} component={pages.Profile} />
          <ProtectedRoute path={ROUTE.CHAT} component={pages.Chat} />
          <ProtectedRoute path={ROUTE.SUGGESTED_PEOPLE} component={pages.SuggestedPeople} />
          <Route path={ROUTE.SOCIAL_AUTH_FAILED} component={pages.SocialAuthFailed} />
          <Route component={pages.PageNotFound} />
        </Switch>
        {isNotMobile && <Chats />}
      </main>
    </Router>
  );
}

export default App;

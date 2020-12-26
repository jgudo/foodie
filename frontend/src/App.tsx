import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import NavBar from "./components/shared/NavBar";
import Preloader from "./components/shared/Preloader";
import PageNotFound from "./pages/error/PageNotFound";
import Home from "./pages/home";
import Login from "./pages/login";
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
        const user = await checkAuthSession();

        console.log(user);
        dispatch(loginSuccess(user.id, user.username));
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
              <ProtectedRoute path="/" exact component={Home} />
              <PublicRoute path="/register" component={Register} />
              <PublicRoute path="/login" component={Login} />
              <Route component={PageNotFound} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
}

export default App;

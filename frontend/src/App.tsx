import { useSelector } from "react-redux";
import { BrowserRouter, Switch } from "react-router-dom";
import { IRootReducer } from "~/types/types";
import NavBar from "./components/shared/NavBar";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import ProtectedRoute from "./routers/ProtectedRoute";
import PublicRoute from "./routers/PublicRoute";

function App() {
  const auth = useSelector((state: IRootReducer) => state.auth);

  console.log(auth);

  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Switch>
          <ProtectedRoute path="/" exact component={Home} />
          <PublicRoute path="/register" component={Register} />
          <PublicRoute path="/login" component={Login} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

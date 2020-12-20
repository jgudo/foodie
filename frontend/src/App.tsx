import { useSelector } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { IRootReducer } from "~/types/types";
import NavBar from "./components/shared/NavBar";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  const auth = useSelector((state: IRootReducer) => state.auth);

  console.log(auth);

  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

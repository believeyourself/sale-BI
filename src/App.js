import { HashRouter, Route } from "react-router-dom";
import Login from "./views/login";
import Home from "./views/home";
import Invite from "./views/invite";
import CashInfo from "./views/cashInfo";
import Download from "./views/download";

function App() {
  return (
    <HashRouter>
      <Route exact path="/login/:userInfo?" component={Login}></Route>
      <Route exact path="/home/:userInfo?" component={Home}></Route>
      <Route exact path="/invite/:shareUrl" component={Invite}></Route>
      <Route
        exact
        path="/cashInfo/:stage/:userCampaignId"
        component={CashInfo}
      ></Route>
      <Route exact path="/download/:game" component={Download}></Route>
    </HashRouter>
  );
}

export default App;

import { HashRouter, Route } from "react-router-dom";
import { Login, Home, Invite, CashInfo, Download, Redeem } from "./views";

function App() {
  return (
    <HashRouter>
      <Route exact path="/redeem/:userInfo?" component={Redeem}></Route>
      <Route exact path="/login/:userInfo?" component={Login}></Route>
      <Route exact path="/home/:userInfo?" component={Home}></Route>
      <Route exact path="/invite/:shareUrl/:from?" component={Invite}></Route>
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

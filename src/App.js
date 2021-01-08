import { useEffect } from "react";
import { HashRouter, Route } from "react-router-dom";
import { Login, Home, Invite, CashInfo, Download, Redeem } from "./views";

function App() {
  //加载fb SDK
  useEffect(() => {
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");

    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: "1026987934476519",
        cookie: true,
        xfbml: true,
        version: "v9.0",
      });
    };
  }, []);

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

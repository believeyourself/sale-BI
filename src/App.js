import { useEffect } from "react";
import { HashRouter, Route } from "react-router-dom";
import {createStore,applyMiddleware,compose,combineReducers} from "redux"
import { Provider } from "react-redux";
import * as reducers from "./reducers"
import thunk from "redux-thunk"
import { Login, Home, Invite, CashInfo, Download, Redeem } from "./views";

//redux缓存避免页面刷新数据丢失
import {persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {PersistGate} from 'redux-persist/integration/react';

const rootReducer = persistReducer({
  key: 'root',
  storage
}, combineReducers(reducers));
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
const persistor = persistStore(store);

//store状态监听
store.subscribe(() => {
  console.log("==========",store.getState());
});

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
<Provider store={store}>
<PersistGate loading={null} persistor={persistor}>
<HashRouter>
      <Route exact path="/redeem/:userInfo?" component={Redeem}></Route>
      <Route exact path="/login/:userInfo?" component={Login}></Route>
      <Route exact path="/home" component={Home}></Route>
      <Route exact path="/invite/:from?" component={Invite}></Route>
      <Route
        exact
        path="/cashInfo/:stage/:userCampaignId"
        component={CashInfo}
      ></Route>
      <Route exact path="/download/:game" component={Download}></Route>
    </HashRouter>
          </PersistGate>
    
    </Provider>
  );
}

export default App;

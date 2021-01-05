import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Toast,
  WhiteSpace,
  ActivityIndicator,
} from "antd-mobile";
import { Redirect } from "react-router-dom";
import iconUrl from "../../assets/icon.png";
import loginUrl from "../../assets/login.png";
import "./index.css";
import request from "../../utils/request";

export default function Login(props) {
  let { params } = props.match;
  let base64UserInfo = params.userInfo
    ? decodeURIComponent(params.userInfo)
    : "";
  const [loading, setLoading] = useState(false);
  const [firstIn, setFirstIn] = useState(true);
  const [isRedeem, setIsRedeem] = useState(false);
  const [data, setData] = useState({ assets: [] });
  const [isLogin, setIsLogin] = useState(false);
  const [userInfo, setUserInfo] = useState({});
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

    window.analytics.logEvent("enter_login_page");
  }, []);

  const queryData = async () => {
    if (!base64UserInfo) {
      Toast.fail("invalid params!");
      return;
    }

    let { data } = await request.post("/marketing/infoVerify", base64UserInfo);
    data.redeemType = 1;
    if (data?.redeemType == 1) {
      setIsRedeem(true);
      setData(data);
    } else {
      if (data?.facebookBound) {
        setIsLogin(true);
      }

      setUserInfo({
        accountId: data.accountId,
        platform: data.platform,
      });
    }
    setFirstIn(false);
  };

  useEffect(() => {
    if (params.userInfo && firstIn) {
      queryData();
    }
  }, []);

  function handleFbLogin() {
    setLoading(true);
    window.analytics.logEvent("click_fb_login");
    window.FB?.login(
      function ({ authResponse, status }) {
        if (status === "connected") {
          let params = {
            userEmail: "",
            accountId: userInfo.accountId,
            userId: authResponse.userID,
            type: "Facebook",
            appId: "1026987934476519",
            token: authResponse.accessToken,
            userName: "",
            platform: userInfo.platform,
            boundDevice: userInfo.platform,
            originalMessage: JSON.stringify(authResponse),
          };
          window.FB.api(
            "/me?fields=email,id,name&access_token=" + authResponse.accessToken,
            async (response) => {
              params.userName = response.name;
              params.userEmail = response.email;
              let { data } = await request.post("/thirdPartyUser/bind", params);
              if (data.accountId) {
                window.analytics.logEvent("click_fb_login_success");
                setIsLogin(true);
              }
            }
          );
        } else {
          window.analytics.logEvent("click_fb_login_failed");
          Toast.Fail("facebook login failed!");
        }
        setLoading(false);
      },
      { scope: "public_profile,email" }
    );
  }

  if (firstIn && base64UserInfo !== "") {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" text="loading..."></ActivityIndicator>
      </div>
    );
  }

  //跳转体现页面
  if (isRedeem) {
    return <Redirect to={`/redeem/${btoa(JSON.stringify(data))}`} />;
  }

  //已经绑定了facebook就跳过登录
  if (isLogin) {
    return <Redirect to={`/home/${base64UserInfo}`} />;
  }

  return (
    <Flex align="center" justify="center" className="login" direction="column">
      <img alt="" height="120" src={iconUrl} />
      <WhiteSpace size="xl"></WhiteSpace>
      <h2>INVITE AND</h2>
      <h1>RECEIVE</h1>
      <h1 className="money">CASH PRIZE</h1>
      <p>
        Invite 3 friends for <span style={{ color: "#116aad" }}>$1</span>.<br />
        10 friends for <span style={{ color: "#116aad" }}>$4</span>.
      </p>
      <Button
        style={{
          width: "70vw",
          backgroundImage: `url(${loginUrl})`,
          backgroundSize: "100% 100%",
        }}
        onClick={handleFbLogin}
        disabled={loading}
        loading={loading}
      ></Button>
    </Flex>
  );
}

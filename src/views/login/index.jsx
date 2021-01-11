import { connect } from "react-redux";
import React, { useEffect } from "react";
import { Button, Flex, WhiteSpace, ActivityIndicator } from "antd-mobile";
import { Redirect } from "react-router-dom";
import iconUrl from "../../assets/icon.png";
import loginUrl from "../../assets/login.png";
import "./index.css";
import { infoVerify, bindUser } from "../../actions/user";

function Login(props) {
  let { params } = props.match;
  let {
    loading,
    handleLogin,
    infoVerify,
    userInfo,
    cachedBase64UserInfo,
  } = props;
  let base64UserInfo = params.userInfo
    ? decodeURIComponent(params.userInfo)
    : null;

  //缓存数据与参数不一致时不适用缓存
  if (base64UserInfo != cachedBase64UserInfo) {
    userInfo = {};
  }
  useEffect(() => {
    window.analytics.logEvent("enter_login_page");
    if (params.userInfo && isNaN(userInfo?.redeemType)) {
      infoVerify(params.userInfo);
    }
  }, []);

  if (isNaN(userInfo?.redeemType) && !base64UserInfo) {
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
  if (userInfo?.redeemType == 1) {
    return <Redirect to={`/redeem/${btoa(JSON.stringify(userInfo))}`} />;
  }

  //未传玩家数据直接跳转主页
  if (!params.userInfo) {
    return <Redirect to="/home" />;
  }

  //已经绑定了facebook就跳过登录
  if (userInfo?.facebookBound) {
    return <Redirect to={`/home`} />;
  }

  return (
    <Flex align="center" justify="center" className="login" direction="column">
      <img alt="" height="120" src={iconUrl} />
      <WhiteSpace size="xl"></WhiteSpace>
      <h2>INVITE AND</h2>
      <h1>RECEIVE</h1>
      <h1 className="money">CASH PRIZE</h1>
      <p>
        Invite friends for <span style={{ color: "#116aad" }}>$50</span>.
      </p>
      <WhiteSpace size="xl"></WhiteSpace>
      <Button
        style={{
          width: "70vw",
          backgroundImage: `url(${loginUrl})`,
          backgroundSize: "100% 100%",
        }}
        onClick={() => handleLogin(userInfo)}
        disabled={loading}
        loading={loading}
      ></Button>
    </Flex>
  );
}

const mapStateToProps = ({ user }, ownProps) => ({
  userInfo: user.userInfo,
  cachedBase64UserInfo: user.base64UserInfo,
  loading: user.loading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleLogin: (userInfo) => {
    dispatch(bindUser(userInfo));
  },
  infoVerify: (base64Info) => {
    dispatch(infoVerify(base64Info));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

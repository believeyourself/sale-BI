import { connect } from "react-redux";
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
import { infoVerify,bindUser } from "../../actions/login"
import request from "../../utils/request"

function Login(props) {
  console.log(props)
  let { params } = props.match;
  const {loading,handleLogin,infoVerify,useInfo} = props;
  let base64UserInfo = params.userInfo
    ? decodeURIComponent(params.userInfo)
    : "";
  useEffect(() => {
    window.analytics.logEvent("enter_login_page");
  }, []);

  useEffect(() => {
    if (params.userInfo && isNaN(useInfo?.redeemType)) {
      infoVerify(params.userInfo);
    }
  }, [params.userInfo]);

  if (isNaN(useInfo?.redeemType) && base64UserInfo !== "") {
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
  if (useInfo?.redeemType == 1) {
    return <Redirect to={`/redeem/${btoa(JSON.stringify(useInfo))}`} />;
  }

  //未传玩家数据直接跳转主页
  if (!params.userInfo) {
    return <Redirect to="/home" />;
  }

  //已经绑定了facebook就跳过登录
  if (useInfo?.facebookBound) {
      return <Redirect to={`/home/${base64UserInfo}`} />
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
        onClick={() =>handleLogin(useInfo)}
        disabled={loading}
        loading={loading}
      ></Button>
    </Flex>
  );
}

const mapStateToProps = (state, ownProps) => ({
  useInfo: state.useInfo,
  loading: state.loading
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleLogin: (userInfo) => {
      dispatch(bindUser(userInfo))
  },
  infoVerify: (base64Info) => {
      dispatch(infoVerify(base64Info))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login)


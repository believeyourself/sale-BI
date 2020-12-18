import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import { Button, Flex, Toast, WhiteSpace } from "antd-mobile";
import { Redirect } from "react-router-dom";
import iconUrl from "../../assets/icon.png";
import loginUrl from "../../assets/login.png";
import "./index.css";
import { infoVerify } from "../../actions/login"


function Login(props) {
    let { match, useInfo, loading, infoVerify } = props;
    let base64UserInfo = decodeURIComponent(match.params?.userInfo);
    useEffect(() => {
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

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

    const queryData = () => {
        if (!base64UserInfo) {
            Toast.fail("invalid params!");
            return;
        }
        infoVerify(base64UserInfo)
    };

    useEffect(() => {
        queryData();
    }, []);



    function handleFbLogin() {
        props.login();
        // window.analytics.logEvent("click_fb_login");
        // window.FB?.login(function ({ authResponse, status }) {
        //     if (status === 'connected') {
        //         let params = {
        //             accountId: userInfo.accountId,
        //             userId: authResponse.userID,
        //             type: "Facebook",
        //             appId: "1026987934476519",
        //             token: authResponse.accessToken,
        //             userName: "",
        //             platform: userInfo.platform,
        //             boundDevice: userInfo.platform,
        //             originalMessage: JSON.stringify(authResponse)
        //         }
        //         console.log(authResponse)
        //         window.FB.api('/me', async (response) => {
        //             params.userName = response.name;
        //             let { data } = await request.post("/thirdPartyUser/bind", params);
        //             console.log(response)
        //             if (data.accountId) {
        //                 window.analytics.logEvent("click_fb_login_success");
        //                 setIsLogin(true);
        //             }
        //         });
        //     } else {
        //         window.analytics.logEvent("click_fb_login_failed");
        //         Toast.Fail('facebook login failed!');
        //     }
        // }, { scope: 'public_profile,email' });
    }

    //已经绑定了facebook就跳过登录
    if (useInfo.facebookBound) {
        return <Redirect to={`/home/${base64UserInfo}`} />
    }

    return (
        <Flex align="center" justify="center" className="login" direction="column">
            <img alt="" height="120" src={iconUrl} />
            <WhiteSpace size="xl"></WhiteSpace>
            <h2>INVITE AND</h2>
            <h1>RECEIVE</h1>
            <h1 className="money">CASH PRIZE</h1>
            <p>Invite 3 friends for <span style={{ color: "#116aad" }}>$1</span>.<br />10 friends for <span style={{ color: "#116aad" }}>$4</span>.</p>
            <Button
                style={{
                    width: "70vw",
                    backgroundImage: `url(${loginUrl})`,
                    backgroundSize: "100% 100%"
                }}
                onClick={handleFbLogin}
                disabled={loading}
                loading={loading}>
            </Button>
        </Flex>
    )
}

const mapStateToProps = (state, ownProps) => ({
    useInfo: state.useInfo,
    loading: state.loading
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    login: () => {
        dispatch({ type: "LOGIN" })
    },
    infoVerify: (base64Info) => {
        dispatch(infoVerify(base64Info))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login)
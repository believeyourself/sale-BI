import React, { useState, useEffect } from "react";
import { Button, Flex, Toast, WhiteSpace } from "antd-mobile";
import { Redirect } from "react-router-dom";
import iconUrl from "../../assets/icon.png";
import loginUrl from "../../assets/login.png";
import "./index.css";
import request from "../../utils/request";

export default function Login(props) {
    let { match } = props;
    let base64UserInfo = decodeURIComponent(match.params?.userInfo);
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [userInfo, setUserInfo] = useState({});
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
    }, []);

    const queryData = async () => {
        setLoading(true);
        if (!base64UserInfo) {
            Toast.fail("invalid params!");
            return;
        }

        let { data } = await request.post("https://fkz3gphuoa.execute-api.us-west-2.amazonaws.com/Prod/marketing/infoVerify", base64UserInfo);

        if (data?.facebookBound) {
            setIsLogin(true);
        }
        setUserInfo({
            accountId: data.accountId,
            platform: data.platform
        });
        setLoading(false);
    };

    useEffect(() => {
        queryData();
    }, []);



    function handleFbLogin() {
        setLoading(true);
        window.FB?.login(function ({ authResponse, status }) {
            if (status === 'connected') {
                let params = {
                    accountId: userInfo.accountId,
                    userId: authResponse.userID,
                    type: "Facebook",
                    appId: "1026987934476519",
                    token: authResponse.accessToken,
                    userName: "",
                    platform: userInfo.platform,
                    boundDevice: userInfo.platform,
                    originalMessage: JSON.stringify(authResponse)

                }
                window.FB.api('/me', async (response) => {
                    params.userName = response.name;
                    let { data } = await request.post("https://fkz3gphuoa.execute-api.us-west-2.amazonaws.com/Prod/thirdPartyUser/bind", params);
                    if (data.accountId) {
                        setIsLogin(true);
                    }
                });
            } else {
                Toast.Fail('facebook login failed!');
            }
            setLoading(false);
        }, { scope: 'public_profile,email' });
    }

    //已经绑定了facebook就跳过登录
    if (isLogin) {
        return <Redirect to={`/home/${base64UserInfo}`} />
    }

    return (
        <Flex align="center" justify="center" className="login" direction="column">
            <img alt="" height="120" src={iconUrl} />
            <WhiteSpace size="xl"></WhiteSpace>
            <h2>INVITE AND</h2>
            <h1>RECEIVE</h1>
            <h1 className="money">$1</h1>
            <p>Invite 5 friends to download our game and receive $1</p>
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
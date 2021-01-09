import request from "../utils/request";
import {Toast} from "antd-mobile"
export const login = () => ({
  type: "LOGIN_SUCCESS",
  useInfo: "test",
});

export const infoVerify = (base64UserInfo) => {
  return async (dispatch) => {
    dispatch({
      type: "INFO_VERIFY",
      loading: true,
    });
    let { data } = await request.post("/marketing/infoVerify", base64UserInfo);
    dispatch({
      type: "INFO_VERIFY_SUCCESS",
      loading: false,
      useInfo: data,
    });
  };
};

export const bindUser = (userInfo) => {
  console.log("=========",userInfo)
  return async (dispatch) => {
    dispatch({
      type: "BIND_USER",
      loading: true,
    });
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
                userInfo.facebookBound = true;
                dispatch({
                  type:"BIND_USER_SUCCESS",
                  loading:false,
                  userInfo
                })
              }
            }
          );
        } else {
          window.analytics.logEvent("click_fb_login_failed");
          Toast.Fail("facebook login failed!");
          dispatch({
            type:"BIND_USER_FAIL",
            loading:false
          })
        }
      },
      { scope: "public_profile,email" }
    );
  };
};


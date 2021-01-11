import request from "../utils/request";
import { Toast } from "antd-mobile";

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
      userInfo: data,
      base64UserInfo,
    });
  };
};

export const bindUser = (userInfo) => {
  return async (dispatch) => {
    dispatch({
      type: "BIND_USER",
      loading: true,
    });
    window.analytics.logEvent("click_fb_login");
    await new Promise((resolve) => {
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
              "/me?fields=email,id,name&access_token=" +
                authResponse.accessToken,
              async (response) => {
                params.userName = response.name;
                params.userEmail = response.email;
                let { data } = await request.post(
                  "/thirdPartyUser/bind",
                  params
                );
                console.log(data);
                if (data.accountId) {
                  window.analytics.logEvent("click_fb_login_success");
                  userInfo.facebookBound = true;
                  dispatch({
                    type: "BIND_USER_SUCCESS",
                    loading: false,
                    userInfo,
                  });
                }
                resolve();
              }
            );
          } else {
            window.analytics.logEvent("click_fb_login_failed");
            Toast.Fail("facebook login failed!");
            dispatch({
              type: "BIND_USER_FAIL",
              loading: false,
            });
            resolve();
          }
        },
        { scope: "public_profile,email" }
      );
    });
  };
};

export const getUserCampaign = (userInfo) => {
  return async (dispatch) => {
    dispatch({
      type: "GET_USER_CAMPAIGNS",
      loading: true,
    });
    Toast.loading("Loading...", 30);
    let { data } = await request.get(
      `/marketing/campaigns?accountId=${userInfo.accountId}&appName=${userInfo.appName}`
    );

    dispatch({
      type: "GET_USER_CAMPAIGNS_SUCCESS",
      loading: false,
      inviteInfo: data,
    });
    Toast.hide();
  };
};

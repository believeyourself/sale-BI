import request from "../utils/request";
export const login = () => ({
  type: "LOGIN_SUCCESS",
  useInfo: "test",
});

export const infoVerify = (base64UserInfo) => {
  return async (dispatch) => {
    let { data } = await request.post("/marketing/infoVerify", base64UserInfo);
    dispatch({
      type: "INFO_VERIFY_SUCCESS",
      useInfo: data,
    });
  };
};

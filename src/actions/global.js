import request from "../utils/request";
import config from "../config/config"

export const getConfig = () => {
  return async (dispatch) => {
    dispatch({
        type:"GET_CONFIG",
        loading:true
    })
    let data = await request.get(`${config.gameResourceUrl}config.json`);
    dispatch({
      type:"GET_CONFIG_SUCCESS",
      loading:false,
      ...data
    })
  };
};

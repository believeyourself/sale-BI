export const GlobalReducer = (state = {}, action) => {
    switch (action.type) {
      case "GET_CONFIG":
        return Object.assign({}, state, action);
      case "GET_CONFIG_SUCCESS":
        return Object.assign({}, state, action);
      default:
        return state;
    }
  };
  
export const reducer = (state = {}, action) => {
  switch (action.type) {
    case "LOGIN":
      return Object.assign({}, state, action);
    case "LOGIN_SUCCESS":
      return Object.assign({}, state, action);
    case "INFO_VERIFY": {
      return Object.assign({}, state, action);
    }
    case "INFO_VERIFY_SUCCESS": {
      return Object.assign({}, state, action);
    }
    default:
      return state;
  }
};

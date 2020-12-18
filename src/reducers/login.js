export const reducer = (state = {}, action) => {
  switch (action.type) {
    case "LOGIN":
      return Object.assign({ loading: true }, state, action);
    case "LOGIN_SUCCESS":
      return Object.assign({ loading: false }, state, action);
    case "INFO_VERIFY": {
      return Object.assign({ loading: true }, state, action);
    }
    case "INFO_VERIFY_SUCCESS": {
      return Object.assign({ loading: false }, state, action);
    }
    default:
      return state;
  }
};

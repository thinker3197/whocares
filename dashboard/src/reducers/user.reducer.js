const initialState = {
  loggedIn: false,
  user: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        loggedIn: true,
        user: action.user
      };

    default:
      return state;
  }
};

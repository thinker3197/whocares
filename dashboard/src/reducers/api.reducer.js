const initialState = {
  campaigns: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_ALL_CAMPAIGN_SUCCESS":
      return Object.assign({}, state, {
        campaigns: action.campaigns
      });

    default:
      return state;
  }
};

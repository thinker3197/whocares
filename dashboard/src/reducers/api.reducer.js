const initialState = {
  campaigns: [],
  currentCampaigns: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_ALL_CAMPAIGN_SUCCESS":
      return Object.assign({}, state, {
        campaigns: action.campaigns
      });

    case "FETCH_CURRENT_CAMPAIGN_SUCCESS":
      return Object.assign({}, state, {
        currentCampaigns: action.currentCampaigns
      });

    default:
      return state;
  }
};

const initialState = {
  campaigns: [],
  currentCampaigns: [],
  rankings: [],
  activeCampaign: undefined,
  activeStats: undefined
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

    case "FETCH_RANKINGS_SUCCESS":
      return Object.assign({}, state, {
        rankings: action.rankings
      });

    case "FETCH_CAMPAIGN_DETAILS_SUCCESS":
      return Object.assign({}, state, {
        activeCampaign: action.activeCampaign,
        activeStats: action.activeStats
      });

    default:
      return state;
  }
};

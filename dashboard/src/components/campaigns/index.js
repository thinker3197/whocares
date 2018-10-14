import React, { Component } from "react";
import { Badge, Modal, Icon } from "antd";
import { connect } from "react-redux";
import { capitalize } from "underscore.string";

import { fecthAllCampaigns } from "../../actions";
import { GRADIENTS } from "../../constants";

import marketing from "../../assets/marketing.jpg";
import "./styles.less";

class Campaigns extends Component {
  state = {
    activeCampaigns: undefined
  };

  componentDidMount() {
    const { fecthAllCampaigns } = this.props;

    fecthAllCampaigns();
  };

  componentWillReceiveProps(nextProps) {
    if(this.props.campaigns !== nextProps.campaigns) {
      this.setState({
        activeCampaigns: nextProps.campaigns
          .filter(campaign => campaign.active)
          .map((campaign, index) => {
            campaign.gradient = GRADIENTS[index];

            return campaign;
          })
      });
    }
  };

  handleClickJoin = (campaign) => {
    Modal.confirm({
      title: "Sure you want to join this campaign?",
      content: `${capitalize(campaign.name)} created by ${campaign.owner}`,
      okText: "Yes",
      cancelText: "No"
    });
  };

  handleClickCreate = (e) => {

  };

  render() {
    const { activeCampaigns } = this.state;
    const { campaigns, user } = this.props;

    return (
      <div className="campaigns">
        <div className="campaigns--active">
          <p>Active campaigns</p>
          <ul className="campaigns__active-list">
            {
              activeCampaigns && activeCampaigns.map((ac, index) => (
                <li key={`campaign-active-key-${index}`} style={{ background: `url(${marketing})`, backgroundSize: "cover"}}>
                  <img style={{ background: `linear-gradient(${ac.gradient.a}, ${ac.gradient.b})`}} />
                  <div className="campaigns__stats">
                    <span className="stats-tag">
                      <Badge status="success" />
                      <p>{ ac.users ? ac.users.length : 0 }</p>
                    </span>
                    <span className="stats-tag">
                      <p>{ (ac.stats.clicks / ac.constraints.clicks) * 100 }% complete</p>
                    </span>
                  </div>
                  <div className="campaigns__meta">
                    <h3>{capitalize(ac.name)}</h3>
                    <p>Hacktoberfest is a month-long celebration of open source</p>
                  </div>
                  <a>More details</a>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="campaigns--all">
          <p>All campaigns</p>
          <ul className="campaigns__all-title">
            <li>Name</li>
            <li>Brand</li>
            <li>Type</li>
            <li>Created at</li>
            <li>Ending at</li>
            <li>Goal</li>
            <li>Status</li>
          </ul>
          <ul className="campaigns__all-list">
            {
              !!campaigns.length && campaigns.map((c, index) => {
                const type = Object.keys(c.constraints)[0];

                return (
                  <li key={`campaign-all-key-${index}`} style={{ background: !c.active ? "#FFE0E0" : "#C6DBF9" }} onClick={(e) => this.handleClickJoin(c)}>
                    <div className="list-data">
                      <h3>{capitalize(c.name)}</h3>
                      <p>Hacktoberfest is a month-long celebration of open source</p>
                    </div>
                    <p>{capitalize(c.owner)}</p>
                    <p>{capitalize(type)}</p>
                    <p>12th October, 2018</p>
                    <p>14th October, 2018</p>
                    <p>{`${c.constraints[type]} ${type}`}</p>
                    <p>{ c.active ? (
                      <span>
                        <Badge status="processing" />
                        Active
                      </span>
                    ) : (
                      <span>
                        <Badge status="error" />
                        Ended
                      </span>
                    )}
                    </p>
                  </li>
                );
              })
            }
          </ul>
        </div>
        {
          user.brand && (
            <div onClick={this.handleClickCreate} className="campaigns__create-btn">
              <Icon type="plus" />
            </div>
          )
        }
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    campaigns: state.api.campaigns,
    user: state.user.user
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fecthAllCampaigns: () => dispatch(fecthAllCampaigns())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Campaigns);

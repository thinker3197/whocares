import React, { Component } from "react";
import { Badge, Modal, Icon } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { capitalize } from "underscore.string";

import CreateCampaignModal from "./createCampaignModal";
import { fetchAllCampaigns, fetchCurrentCampaigns, createCampaign, joinCampaign } from "../../actions";
import { GRADIENTS, LOCAL_SERVER_IP } from "../../constants";
import adcam from "../../utils/contract";
import { copyToClipboard } from "../../utils";
import marketing from "../../assets/marketing.jpg";
import "./styles.less";

class Campaigns extends Component {
  state = {
    visible: false,
    name: undefined,
    description: undefined,
    type: undefined,
    constraints: undefined,
    url: undefined,
    reserve: undefined,
    activeCampaigns: undefined
  };

  componentDidMount() {
    const { fetchAllCampaigns, fetchCurrentCampaigns } = this.props;

    fetchAllCampaigns();
    fetchCurrentCampaigns();
  };

  componentWillReceiveProps(nextProps) {
    if(this.props.currentCampaigns !== nextProps.currentCampaigns) {
      this.setState({
        activeCampaigns: nextProps.currentCampaigns
          .map((campaign, index) => {
            campaign.gradient = GRADIENTS[index % GRADIENTS.length];

            return campaign;
          })
      });
    }
    if(this.props.web3 !== nextProps.web3) {
      console.log(nextProps.web3);
    }
  };

  handleChangeField = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleOkJoinCampaign = (name) => {
    if(name) {
      this.props.joinCampaign(name);
    }
  };

  handleClickJoin = (campaign) => {
    const { user } = this.props;

    if(!user.brand && campaign.active) {
      Modal.confirm({
        title: "Sure you want to join this campaign?",
        content: `${capitalize(campaign.name)} created by ${campaign.owner}`,
        okText: "Yes",
        cancelText: "No",
        onOk: (e) => this.handleOkJoinCampaign(campaign.name)
      });
    }
  };

  handleClickCreate = (e) => {
    this.setState({
      visible: true
    });
  };

  onOk = async (e) => {
    // const {web3} = this.props.web3;
    // const accounts=await web3.eth.getAccounts();
    // adcam.methods.fundCampaign(this.state.name).send({
    //    from:accounts[0],
    //    value:web3.utils.toWei(""+this.state.reserve,"ether")
    // }).on("receipt",(receipt)=>{
    //      console.log(receipt);
    // })

    const { name, description, type, constraints, url, reserve } = this.state;
    const { createCampaign } = this.props;

    createCampaign({
      name,
      desc: description,
      type,
      constraints: {
        clicks: constraints
      },
      redirect_url: url,
      reserve
    });

    this.onCancel();
  };

  onCancel = (e) => {
    this.setState({
      visible: false,
      name: undefined,
      type: undefined,
      constraints: undefined,
      url: undefined,
      reserve: undefined,
    });
  };

  render() {
    const { activeCampaigns, visible, name, description, type, constraints, url, reserve } = this.state;
    const { campaigns, user } = this.props;

    return (
      <div className="campaigns">
        <div className="campaigns--active">
          <p>Active campaigns</p>
          <ul className="campaigns__active-list">
            {
              activeCampaigns && activeCampaigns.map((ac, index) =>{
                let referral;

                if(!user.brand) {
                  referral = `${LOCAL_SERVER_IP.slice(7)}${ac.users.filter(u => u.username === user.username)[0].url}`;
                }

                return (
                  <li key={`campaign-active-key-${index}`}>
                    <div style={{ background: `url(${marketing})`, backgroundSize: "cover"}} className="campaigns__active-item">
                      <img style={{ background: `linear-gradient(${ac.gradient.a}, ${ac.gradient.b})`}} />
                      <div className="campaigns__stats">
                        <span className="stats-tag">
                          <Badge status="success" />
                          <p>{ ac.users ? ac.users.length : 0 }</p>
                        </span>
                        <span className="stats-tag">
                          <p>{ ((ac.stats.clicks / ac.constraints.clicks) * 100).toFixed(1) }% complete</p>
                        </span>
                      </div>
                      <div className="campaigns__meta">
                        <h3>{capitalize(ac.name)}</h3>
                        <p>{capitalize(ac.desc)}</p>
                      </div>
                      <Link to={`/campaigns/${ac.name}`}>More details</Link>
                    </div>
                    {
                      !user.brand && (
                        <div className="campaigns__url">
                          <a onClick={(e) => copyToClipboard(`http://${referral}`)}>{referral}</a>
                          <Icon type="copy" />
                        </div>
                      )
                    }
                  </li>
                );
              })
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
                      <p>{capitalize(c.desc)}</p>
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
        <CreateCampaignModal
          visible={visible}
          handleOk={this.onOk}
          handleCancel={this.onCancel}
          name={name}
          description={description}
          type={type}
          constraints={constraints}
          url={url}
          reserve={reserve}
          handleChangeField={this.handleChangeField}
        />
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    web3: state.web3Red.web3,
    campaigns: state.api.campaigns,
    user: state.user.user,
    currentCampaigns: state.api.currentCampaigns
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllCampaigns: () => dispatch(fetchAllCampaigns()),
    fetchCurrentCampaigns: () => dispatch(fetchCurrentCampaigns()),
    createCampaign: (data) => dispatch(createCampaign(data)),
    joinCampaign: (name) => dispatch(joinCampaign(name))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Campaigns);

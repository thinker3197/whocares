import React, { Component } from "react";
import { Row, Col, Tag, Divider, Button } from "antd";
import { connect } from "react-redux";
import { capitalize } from "underscore.string";
import { PieChart, Pie, Tooltip } from "recharts";

import { fetchRankings, fecthCampaignDetails } from "../../actions";
import adcam from "../../utils/contract";
import getWeb3 from "../../utils/getWeb3";

import trophy from "../../assets/trophy.svg";
import ethLogo from "../../assets/eth-logo.png";
import "./styles.less";

class CampaignStats extends Component {
  componentDidMount() {
    const { match, user, fetchRankings, fecthCampaignDetails } = this.props;

    if(user.brand) {
      fetchRankings(match.params.name);
    }

    fecthCampaignDetails(match.params.name);
  };

  handleClickVerify = async(eth, name) => {
    console.log(eth);
    if(eth && name) {
      // do you thing here
      const web3 = getWeb3;
      const accounts=await web3.eth.getAccounts();
      adcam.methods.payOutBounty(eth,name).send({
          from:accounts[0]
      }).on("receipt",(rec)=>{
        console.log(rec);
      })
      
    }
  };

  render() {
    const { activeCampaign, activeStats, user, rankings } = this.props;
    let browser = [], platform = [];

    if(activeStats && activeStats.browser) {
      for(let b in activeStats.browser) {
        browser.push({
          name: b,
          value: activeStats.browser[b]
        });
      }
    }

    if(activeStats && activeStats.platform) {
      for(let p in activeStats.platform) {
        platform.push({
          name: p,
          value: activeStats.platform[p]
        });
      }
    }

    return (
      <Row gutter={16} className="stats">
        <Col span={12}>
          <div style={{ height: 400, background: "#fafafa" }}></div>
          {
            activeCampaign && (
              <div className="stats__original">
                <div className="stats__head">
                  <h2>{capitalize(activeCampaign.name)}</h2>
                  <Tag color={activeCampaign.active ? "green" : "red"}>{activeCampaign.active ? "Active" : "Ended"}</Tag>
                </div>
                <p>{capitalize(activeCampaign.desc)}</p>
                <Divider />
                <ul>
                  <li className="stats__original-item">
                    <h4>Owner</h4>
                    <p>{activeCampaign.owner}</p>
                  </li>
                  <li className="stats__original-item">
                    <h4>Goal</h4>
                    <p>{activeCampaign.constraints.clicks} clicks</p>
                  </li>
                  {
                    !user.brand && (
                      <li className="stats__original-item">
                        <h4>Referral code</h4>
                        <p>{activeCampaign.users.filter(u => u.username === user.username)[0].url.slice(1)}</p>
                      </li>
                    )
                  }
                  <li className="stats__original-item">
                    <h4>Redirect URL</h4>
                    <p>{activeCampaign.redirect_url}</p>
                  </li>
                </ul>
                <Divider />
                <div className="stats__original-reserve">
                  <img src={ethLogo} />
                  <span>{activeCampaign.reserve} ETH</span>
                </div>
              </div>
            )
          }
        </Col>
        <Col span={12}>
          {
            user.brand && (
              <div>
                <h2>Ranking</h2>
                <ul style={{listStyle: "none", padding: 0}}>
                  {
                    rankings && rankings.map(rank => (
                      <li className="stats__ranking">
                        <div className="stats__ranking-item">
                          <div>
                            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17.3096 1.73581C17.0474 1.44373 16.6651 1.27628 16.2606 1.27628H14.9331V0.882881C14.9331 0.396071 14.515 0 14.0012 0H4.99874C4.48485 0 4.06685 0.396071 4.06685 0.882846V1.27624H2.73919C2.33473 1.27624 1.95235 1.44373 1.69021 1.73577C1.43074 2.02479 1.3186 2.40441 1.38261 2.77724C1.73144 4.80928 3.0813 6.60447 4.99707 7.58916C5.17212 7.98787 5.37036 8.36552 5.59112 8.71736C6.29628 9.84149 7.17291 10.6184 8.13783 10.9941C8.23562 11.9308 7.5777 12.8182 6.58688 13.0296C6.58476 13.0301 6.58328 13.0308 6.5812 13.0313C6.38783 13.075 6.24388 13.2394 6.24388 13.436V15.3472H5.42799C4.70057 15.3472 4.10879 15.9078 4.10879 16.597V17.5834C4.10879 17.8135 4.30565 18 4.54853 18H14.4934C14.7363 18 14.9331 17.8135 14.9331 17.5834V16.597C14.9331 15.9078 14.3413 15.3472 13.6139 15.3472H12.798V13.436C12.798 13.2391 12.6535 13.0744 12.4596 13.031C12.4578 13.0306 12.456 13.0301 12.4542 13.0296C11.4559 12.8168 10.7968 11.9205 10.9048 10.9767C11.8529 10.5949 12.7142 9.82496 13.4089 8.71743C13.6297 8.36555 13.8279 7.98787 14.003 7.58909C15.9186 6.60436 17.2684 4.80921 17.6173 2.77724C17.6813 2.40441 17.5691 2.02483 17.3096 1.73581ZM2.25068 2.64347C2.22782 2.51034 2.26667 2.37966 2.36011 2.27553C2.45493 2.16992 2.59305 2.10938 2.73915 2.10938H4.06681V2.87586C4.06681 4.07771 4.22872 5.24188 4.53558 6.30652C3.32967 5.40374 2.49939 4.0923 2.25068 2.64347ZM13.6139 16.1805C13.8564 16.1805 14.0537 16.3673 14.0537 16.5971V17.1669H4.98824V16.5971C4.98824 16.3673 5.18552 16.1805 5.42799 16.1805H13.6139ZM11.9185 13.8526V15.3472H7.12345V13.8526H11.9185ZM8.2767 13.0195C8.38539 12.9061 8.48477 12.7833 8.57365 12.6517C8.8667 12.2179 9.02052 11.7251 9.02742 11.2218C9.18361 11.2419 9.34125 11.2527 9.50023 11.2527C9.6732 11.2527 9.84457 11.2401 10.0143 11.2163C10.0243 11.8927 10.3022 12.5329 10.7694 13.0194H8.2767V13.0195ZM14.0536 2.87589C14.0536 4.92828 13.5561 6.85169 12.6528 8.29169C11.7922 9.66384 10.6725 10.4195 9.50016 10.4195C8.32761 10.4195 7.20787 9.66387 6.34712 8.29176C5.4438 6.85172 4.94631 4.92832 4.94631 2.87596V0.882846C4.94631 0.855424 4.96984 0.83317 4.99871 0.83317H14.0011C14.0301 0.83317 14.0536 0.855459 14.0536 0.882846V2.87589ZM16.7492 2.64347C16.5005 4.0922 15.6703 5.4036 14.4644 6.30645C14.7712 5.24181 14.9331 4.07771 14.9331 2.87589V2.10941H16.2606C16.4068 2.10941 16.5449 2.16999 16.6397 2.27556C16.7331 2.37966 16.772 2.51034 16.7492 2.64347Z" fill="#FFC714"/>
                              <path d="M12.1697 4.27703C12.118 4.12628 11.9804 4.01638 11.8147 3.99353L10.4878 3.81086L9.89437 2.67172C9.82026 2.52955 9.66741 2.43951 9.50005 2.43951C9.33265 2.43951 9.17979 2.52955 9.10572 2.67172L8.5123 3.81086L7.18535 3.99353C7.01969 4.01631 6.88209 4.12624 6.83036 4.27706C6.77866 4.42792 6.82178 4.59344 6.94165 4.70414L7.90185 5.59082L7.67515 6.84284C7.64684 6.99915 7.71464 7.15707 7.85009 7.25031C7.98546 7.3435 8.16503 7.35577 8.31318 7.28202L9.50005 6.69093L10.6869 7.28202C10.7512 7.31404 10.8215 7.32983 10.8914 7.32983C10.9826 7.32983 11.0733 7.303 11.1499 7.25027C11.2854 7.15703 11.3532 6.99911 11.3249 6.84281L11.0982 5.59079L12.0584 4.70411C12.1783 4.59344 12.2214 4.42789 12.1697 4.27703ZM10.3188 5.14704C10.2152 5.24274 10.1679 5.38062 10.1924 5.5158L10.3075 6.15178L9.70463 5.85151C9.64062 5.81958 9.57029 5.80369 9.50001 5.80369C9.42972 5.80369 9.35944 5.81965 9.29539 5.85151L8.69255 6.15178L8.80766 5.5158C8.83215 5.38066 8.78484 5.24277 8.68119 5.14704L8.19353 4.69669L8.86752 4.60388C9.01072 4.58419 9.13456 4.49894 9.19861 4.37599L9.50005 3.79739L9.80145 4.37599C9.86554 4.49894 9.9893 4.58416 10.1325 4.60388L10.8065 4.69669L10.3188 5.14704Z" fill="#FFC714"/>
                            </svg>
                          </div>
                          <p>{rank.username}</p>
                          <span>{rank.stats[Object.keys(rank.stats)[0]].clicks} clicks</span>
                          <div>
                            {
                              activeCampaign && (
                                <span>
                                  {
                                    `${((rank.stats[Object.keys(rank.stats)[0]].clicks / activeCampaign.constraints.clicks) * 100).toFixed(2)}% complete`
                                  }
                                </span>
                              )
                            }
                          </div>
                        </div>
                        {
                          ((rank.stats[Object.keys(rank.stats)[0]].clicks / activeCampaign.constraints.clicks) * 100).toFixed(2) > 100.0 && (
                            <Button type="primary" onClick={(e) => this.handleClickVerify(rank.eth, activeCampaign.name)}>Verify campaign complete</Button>
                          )
                        }
                      </li>
                    ))
                  }
                </ul>
              </div>
            )
          }
          {
            activeStats && (
              <div className="stats__charts">
                <div className="stats__charts-head">
                  <h1>Total engagements</h1>
                  <div>{activeStats.clicks}</div>
                </div>
                <div style={{background: "#fafafa", borderRadius: 4}}>
                  {
                    !!browser.length ? (
                      <PieChart width={580} height={300}>
                        <Pie data={browser} cx={150} cy={150} outerRadius={80} fill="#8884d8" label/>
                        <Pie data={platform} cx={450} cy={150} innerRadius={40} outerRadius={80} fill="#82ca9d"/>
                        <Tooltip/>
                      </PieChart>
                    ) : <p>No data exists</p>
                  }
                </div>
              </div>
            )
          }
        </Col>
      </Row>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    rankings: state.api.rankings,
    activeCampaign: state.api.activeCampaign,
    activeStats: state.api.activeStats,
    user: state.user.user,
    Web3:state.Web3Red
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRankings: (name) => dispatch(fetchRankings(name)),
    fecthCampaignDetails: (name) => dispatch(fecthCampaignDetails(name))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignStats);

import React from "react";
import { Modal, Result } from "antd-mobile";
import "./index.css";
import config from "../../config/config";

export default function Redeem({ match }) {
  const { userInfo } = match.params;
  let gameInfo = null;
  let assetNods = [];

  const checked = () => {
    Modal.alert(
      "tips",
      "Almost there! Get more Coins or Tokens to cash out! ",
      [{ text: "confirm" }]
    );
  };

  try {
    let user = JSON.parse(atob(userInfo));
    let { appName: gameName, assets } = user;
    for (let i = 0; i < config.hotGames.length; ++i) {
      let game = config.hotGames[i];
      if (gameName.toLowerCase() === game.name.toLowerCase()) {
        gameInfo = game;
        break;
      }
    }

    if (gameName && gameInfo) {
      for (let i = 0; i < assets.length; ++i) {
        let code = Number(assets[i].code);
        assetNods.push(
          <div key={code} className="jss3">
            <div className="jss5 item-wbg">
              <img
                alt="icon"
                src={gameInfo.assets[code]?.default}
                className="jss4"
              />
              <div className="jss7">
                <p className="jss8">
                  {assets[i].targetValue} = ${assets[i].award}
                </p>
                <div className="jss9">
                  <span className="user_coins">{assets[i].value}</span> /{" "}
                  {assets[i].targetValue}
                </div>
              </div>
            </div>
            <div className="jss6 item-paypal-bg" onClick={checked}>
              <p className="jss10">${assets[i].award}</p>
            </div>
          </div>
        );
      }
    }
  } catch (err) {
    console.log(err);
    return <Result title="something went wrong!"></Result>;
  }

  return (
    <div id="root">
      <header className="jss12">
        <div className="jss13"></div>
        <div className="jss16">
          <div className="jss17">
            <img alt="icon" src={gameInfo?.icon.default} />
          </div>
          <span className="jss15">Cash Out</span>
        </div>
        <div className="jss13">
          {/* <a
            id="transaction"
            href="transactions.html?coins=1.88&amp;tokens=8000"
          >
            <img alt="right-btn" src={rightBtn} className="jss14" />
          </a> */}
        </div>
      </header>
      <div className="jss2">{assetNods}</div>
    </div>
  );
}

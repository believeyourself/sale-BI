import React, { useEffect, useState } from "react";
import { Modal, Result } from "antd-mobile";
import "./index.css";
import config from "../../config/config";
import Axios from "axios";

export default function Redeem({ match }) {
  const { userInfo } = match.params;
  let gameInfo = null;
  let assetNods = [];
  const [hotGames, setHotGames] = useState([]);

  const checked = () => {
    Modal.alert(
      "tips",
      "Almost there! Get more Coins or Tokens to cash out! ",
      [{ text: "confirm" }]
    );
  };

  useEffect(() => {
    Axios.get(`${config.gameResourceUrl}config.json`).then(({ data }) => {
      setHotGames(data?.hotGames);
    });
  });
  try {
    let user = JSON.parse(atob(userInfo));
    let { appName: gameName, assets } = user;
    for (let i = 0; i < hotGames.length; ++i) {
      let game = hotGames[i];
      if (gameName.toLowerCase() === game.name.toLowerCase()) {
        gameInfo = game;
        break;
      }
    }

    if (gameName && gameInfo) {
      for (let i = 0; i < assets.length; ++i) {
        let code = assets[i].code;
        let assetIconUrl = `${config.gameResourceUrl}${gameName}/assets_${code}.png`;
        assetNods.push(
          <div key={code} className="jss3">
            <div className="jss5 item-wbg">
              <img alt="icon" src={assetIconUrl} className="jss4" />
              <div className="jss7">
                <p className="jss8">
                  {assets[i].targetValue} = ${assets[i].reward}
                </p>
                <div className="jss9">
                  <span className="user_coins">{assets[i].value}</span> /{" "}
                  {assets[i].targetValue}
                </div>
              </div>
            </div>
            <div className="jss6 item-paypal-bg" onClick={checked}>
              <p className="jss10">${assets[i].reward}</p>
            </div>
          </div>
        );
      }
    }
  } catch (err) {
    console.log(err);
    return <Result title="something went wrong!"></Result>;
  }

  let iconUrl =
    gameInfo &&
    `${config.gameResourceUrl}${gameInfo.name?.toLowerCase()}/icon.png`;
  return (
    <div id="root">
      <header className="jss12">
        <div className="jss13"></div>
        <div className="jss16">
          <div className="jss17">
            <img alt="icon" src={iconUrl} />
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

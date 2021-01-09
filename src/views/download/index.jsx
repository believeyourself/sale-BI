import React from "react";
import { Button, NavBar } from "antd-mobile";
import backImg from "../../assets/back.png";
import config from "../../config/config";
import "./index.css";

const Download = (props) => {
  let { game = "" } = props.match.params;
  let gameName = game?.toLocaleLowerCase();
  let downloadUrl = "";
  for (let i = 0; i < config.hotGames.length; ++i) {
    if (config.hotGames[i].appName?.toLocaleLowerCase() === gameName) {
      downloadUrl = config.hotGames[i].downloadUrl;
      break;
    }
  }

  let posterUrl = `${config.gameResourceUrl}${gameName}/poster.jpg`;
  return (
    <div className="download_container">
      <NavBar
        icon={<img className="back" alt="back" src={backImg}></img>}
        style={{ backgroundColor: "#FFF" }}
        onLeftClick={() => window.history.back(-1)}
      />
      <img className="poster" alt="" src={posterUrl}></img>
      <Button type="link" href={downloadUrl} className="download_btn">
        Download
      </Button>
    </div>
  );
};

export default Download;

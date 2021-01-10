import React from "react";
import {connect} from "react-redux"
import { Button, NavBar } from "antd-mobile";
import backImg from "../../assets/back.png";
import "./index.css";
import config from "../../config/config"

const Download = ({match,hotGames}) => {
  console.log(hotGames)
  let { game = "" } = match.params;
  let gameName = game?.toLocaleLowerCase();
  let downloadUrl = "";
  for (let i = 0; i < hotGames.length; ++i) {
    if (hotGames[i].appName?.toLocaleLowerCase() === gameName) {
      downloadUrl = hotGames[i].downloadUrl;
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

const mapStateToProps = ({global,user},ownProps)=>({
  userInfo:user.userInfo,
  hotGames:global.hotGames || [],
})

export default connect(mapStateToProps)(Download);

import React from "react";
import { Button, NavBar } from "antd-mobile";
import backImg from "../../assets/back.png";
import config from "../../config/config";
import slotsGo_bg from "../../assets/slotsGo_bg.jpg";

import "./index.css";

const Download = (props) => {
    let { game } = props.match.params;
    let downloadUrl = "";
    for (let i = 0; i < config.hotGames.length; ++i) {
        if (config.hotGames[i].appName.toLocaleLowerCase() === game.toLocaleLowerCase()) {
            downloadUrl = config.hotGames[i].downloadUrl;
            break;
        }
    }
    return (
        <div>
            <NavBar
                icon={<img className="back" alt="back" src={backImg}></img>}
                style={{ backgroundColor: "#FFF" }}
                onLeftClick={() => window.history.back(-1)}
            />
            <div className="download_bg" style={{ backgroundImage: `url(${slotsGo_bg})` }}>

                <Button type="link" href={downloadUrl} className="download_btn">Download</Button>
            </div>
        </div>
    )
}

export default Download;
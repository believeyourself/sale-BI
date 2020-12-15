import React from "react";
import { Button, NavBar } from "antd-mobile";
import backImg from "../../assets/back.png";
import config from "../../config/config";
import slotsGo_bg from "../../assets/slotsgo_bg.jpg";
import plinkoGo_bg from "../../assets/plinkogo_poster.jpg";
import plinkoMania_bg from "../../assets/plinkomania_poster.jpg";
import candyPusher_bg from "../../assets/candypusher_poster.jpg";
import arcadePusher_bg from "../../assets/arcadepusher_poster.jpg";
import binggo_bg from "../../assets/binggo_poster.jpg";

import "./index.css";

const GAME_BG = {
    slotsgo: slotsGo_bg,
    plinkogo: plinkoGo_bg,
    plinkomania: plinkoMania_bg,
    candypusher: candyPusher_bg,
    arcadepusher: arcadePusher_bg,
    binggooo: binggo_bg,
};

const Download = (props) => {
    let { game = "" } = props.match.params;
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
            <div className="download_bg" style={{ backgroundImage: `url(${GAME_BG[game.toLowerCase()]})` }}>

                <Button type="link" href={downloadUrl} className="download_btn">Download</Button>
            </div>
        </div>
    )
}

export default Download;
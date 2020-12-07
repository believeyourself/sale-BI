import React from "react";
import { Button, Toast, NavBar } from "antd-mobile";
import copy from "copy-to-clipboard";
import backImg from "../../assets/back.png"
import "./index.css";

const info = [
    "Invite friends to download, gain cash right now!",
    "Help! Without you, I can't cash out $1 for free.",
    "$1 is waiting for you, download right now!",
    "Funny Game, and gain $1 easily.",
    "An easy way to earn $1.",
    "Just for 1 minute and gain $1!",
    "The most fastest way to earn $1!",
    "Hey guys, a quick way to earn $1,download this funny game.",
    "OMG, $1 is so easy to get，I'm about to cash out, don't you wanna have a try!",
    "Everyone is playing, everyone is withdrawing, what are you waiting for, hurry up and download right now~",
];

const Invite = (props) => {
    const emailContent = `Hi,How is it going？I'm playing the so funny game ArcadePusher and need you help right now!Just help me download this game thorough the link and I can gain $1 immediately!%0dClick the link！👇👇👇(If link is not clickable, please copy and paste it into the address bar)%0d`;
    const shareUrl = atob(props.match.params.shareUrl);
    const randomIndex = Math.floor(Math.random() * info.length);
    const emailTitleIndex = Math.floor(Math.random() * 8);
    const randomInfo = info[randomIndex];
    const randomEmailTitle = info[emailTitleIndex];

    const copyUrl = () => {
        window.analytics.logEvent("click_copy_url");
        copy(`${randomInfo} Click the link！👇👇👇\n${shareUrl}`);
        Toast.success("Copy Success!Invite your best friends and win real money!");
    }

    return (
        <React.Fragment>
            <NavBar
                icon={<img className="back" alt="back" src={backImg}></img>}
                style={{ backgroundColor: "#FFF" }}
                onLeftClick={() => window.history.back(-1)}
            />
            <div className="invite"></div>
            <Button onClick={copyUrl} className="copy_link">Copy Link</Button>
            <Button
                type="link"
                onClick={window.analytics.logEvent("click_share_with_email")}
                href={`mailto:?subject=${randomEmailTitle}&body=${emailContent}${shareUrl}`} className="copy_link">
                Share With Email
            </Button>
        </React.Fragment >
    )
}

export default Invite;
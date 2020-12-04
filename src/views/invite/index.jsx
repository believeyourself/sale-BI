import React from "react";
import { Button, Toast, NavBar } from "antd-mobile";
import copy from "copy-to-clipboard";
import backImg from "../../assets/back.png"
import "./index.css";

const Invite = (props) => {
    let shareUrl = atob(props.match.params.shareUrl);

    const copyUrl = () => {
        copy(shareUrl);
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
        </React.Fragment>
    )
}

export default Invite;
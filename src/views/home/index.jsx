import React, { useState, useEffect } from "react";
import { WhiteSpace, Button, Flex, Toast } from "antd-mobile";
import ContactUs from "../../components/contactUs";
import request from "../../utils/request";


//图片
import inviteBannerUrl from "../../assets/invite_banner.jpg";
import userUrl from "../../assets/user.jpg"
import fbUrl from "../../assets/facebook.png"
import inviteUrl from "../../assets/invite.png"
import ArcadePusher_assets_0 from "../../assets/ArcadePusher_assets_0.png"
import ArcadePusher_assets_1 from "../../assets/ArcadePusher_assets_1.png"
import ArcadePusher_assets_2 from "../../assets/ArcadePusher_assets_2.png"
import arcadePusherUrl from "../../assets/arcadePusher.png"
import slotsGoUrl from "../../assets/slotsGo.png";
import slotsGoBannerUrl from "../../assets/slotsGo_banner.jpg";
import "./index.css";

const ASSETS_IMAGE = {
    ArcadePusher_assets_0,
    ArcadePusher_assets_1,
    ArcadePusher_assets_2
}

export default function Home(props) {
    let { match } = props;
    let base64UserInfo = match.params?.userInfo;
    const [userInfo, setUserInfo] = useState({
        appName: "ArcadePusher",
        assets: []
    });
    const [processInfo, setProcessInfo] = useState({
        currentValue: 0,
        name: "--",
    });

    const queryData = async () => {
        if (!base64UserInfo) {
            Toast.fail("invalid params!");
            return;
        }

        Toast.loading("Loading...", 30);
        let { data: userInfo } = await request.post("https://fkz3gphuoa.execute-api.us-west-2.amazonaws.com/Prod/marketing/infoVerify", base64UserInfo);

        let { data: processInfo } = await request.get(`https://fkz3gphuoa.execute-api.us-west-2.amazonaws.com/Prod/marketing/campaigns?accountId=${userInfo.accountId}&appName=${userInfo.appName}`);

        setUserInfo(userInfo);
        setProcessInfo(processInfo);
        Toast.hide();
    };

    useEffect(() => {
        queryData();
    }, []);

    const goToInvite = () => {
        window.analytics.logEvent("click_invite");
        window.location.hash = `#/invite/${btoa(processInfo.promotionalLink)}`;
    }
    const goToDownload = (appName) => {
        window.analytics.logEvent(`click_${appName}_download`);
        window.location.hash = `#/download/${appName}`;
    }

    //拉新进度展示
    let avatars = [];
    for (let i = 0; i < processInfo?.currentValue; ++i) {
        avatars.push(<img key={"avatar" + i} alt="" className="avatar" src={userUrl} />)
    }

    for (let i = 0; i < 5 - processInfo?.currentValue; ++i) {
        avatars.push(<img onClick={goToInvite} key={"invite" + i} alt="" className="avatar" src={inviteUrl} />)
    }

    //游戏资产
    let assets = [];
    for (let i = 0; i < userInfo.assets.length; ++i) {
        let asset = userInfo.assets[i];
        // let button = (<Button className="play_button" size="small">Play</Button>);
        let button = (<Button disabled className="cash_out_button" size="small">CASH OUT</Button>);
        if (asset.currentValue >= asset.targetValue) {
            button = (<Button className="cash_out_button" size="small">CASH OUT</Button>);
        }

        assets.push((<Flex key={`${userInfo.appName}_assets_${asset.code}`} justify="start">
            <Flex.Item>
                <Flex>
                    <img alt="" src={ASSETS_IMAGE[`${userInfo.appName}_assets_${asset.code}`]}></img>
                    <span style={{ marginLeft: "8px" }}>{asset.value} / {asset.targetValue}</span>
                </Flex>
            </Flex.Item>
            {button}
        </Flex>));
    }

    return (
        <div className="home">
            <img onClick={goToInvite} alt="" src={inviteBannerUrl} />
            <WhiteSpace></WhiteSpace>
            <section className="process">
                {avatars}
            </section>
            <h3 style={{ paddingLeft: "15px", textAlign: "left" }}>My Games</h3>
            <Flex className="user_game" justify="start">
                <img alt="" className="avatar" src={arcadePusherUrl} />
                <Flex.Item>
                    <span>{userInfo.appName}</span>
                </Flex.Item>
                {
                    processInfo.currentValue >= processInfo.finalValue ?
                        <Button type="link" href={`#/cashInfo/${processInfo.userCampaignId}`} size="small" className="cash_out_button">CASH OUT</Button>
                        :
                        <Button onClick={goToInvite} size="small" className="play_button">INVITE</Button>
                }
            </Flex>
            <WhiteSpace></WhiteSpace>
            <section className="user">
                <Flex justify="start">
                    <img alt="" className="avatar" src={fbUrl} />
                    <Flex.Item>
                        <span>{processInfo.name}</span>
                    </Flex.Item>
                </Flex>
                <WhiteSpace></WhiteSpace>
                {assets}
            </section>
            <h3 style={{ paddingLeft: "15px", textAlign: "left" }}>Hot Games</h3>
            <section className="hot_game_banner_container">
                <img onClick={() => goToDownload("slotsGo")} alt="" src={slotsGoBannerUrl} />
            </section>
            <WhiteSpace></WhiteSpace>
            <Flex className="user_game" justify="start">
                <img alt="" className="avatar" src={slotsGoUrl} />
                <Flex.Item>
                    <p>SlotsGo - Spin to Win</p>
                    <p>the best game to play</p>
                </Flex.Item>
                <Button size="small" onClick={() => goToDownload("slotsGo")} className="play_button">PLAY NOW</Button>
            </Flex>
            <ContactUs></ContactUs>
        </div >
    )
}
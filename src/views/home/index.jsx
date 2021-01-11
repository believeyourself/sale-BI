import React, { useState, useEffect, useRef } from "react";
import {
  WhiteSpace,
  Button,
  Flex,
  Toast,
  Carousel,
  Progress,
  Modal,
} from "antd-mobile";
import ContactUs from "../../components/contactUs";
import request from "../../utils/request";

//图片
import inviteBannerUrl from "../../assets/invite_banner.jpg";
import playImg from "../../assets/play.png";
import fbUrl from "../../assets/facebook.png";
import gift_card from "../../assets/gift_card.png";
import videoMp4 from "../../assets/redeem.mp4";
import "./index.css";
import config from "../../config/config";
import Axios from "axios";

export default function Home(props) {
  let { match } = props;
  let base64UserInfo = match.params?.userInfo;
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [randomBanner, setRandomBanner] = useState(null);
  const [hotGames, setHotGames] = useState([]);
  const [envelopStatus, setEnvelopStatus] = useState(ENVELOP_STATUS.closed);
  const [userInfo, setUserInfo] = useState({
    appName: "",
    assets: [],
  });
  const [processInfo, setProcessInfo] = useState({
    currentValue: 0,
    name: "--",
  });
  const userGameName = userInfo.appName?.toLowerCase();

  useEffect(() => {
    if (base64UserInfo) {
      const queryData = async () => {
        Toast.loading("Loading...", 30);
        let { data: userInfo } = await request.post(
          "/marketing/infoVerify",
          base64UserInfo
        );

        let { data: processInfo } = await request.get(
          `/marketing/campaigns?accountId=${userInfo.accountId}&appName=${userInfo.appName}`
        );

        if (processInfo.theFirst) {
          setEnvelopStatus(ENVELOP_STATUS.pending);
        }

        setUserInfo(userInfo);
        setProcessInfo(processInfo);
        Toast.hide();
      };

      let randomNum = Math.ceil(Math.random() * 100);
      if (randomNum < 40) {
        window.analytics.logEvent("cashout_invite_show");
        setRandomBanner(
          <div className="random_banner">
            <img alt="gift" src={gift_card} />
            <p>You received $50</p>
            <Button
              onClick={() => goToInvite("click_cashout_invite", 1)}
              size="small"
              type="primary"
            >
              Cash out
            </Button>
          </div>
        );
      }
      queryData();
    }

    Axios.get(`${config.gameResourceUrl}config.json`).then(({ data }) => {
      setHotGames(data?.hotGames);
    });
  }, [base64UserInfo]);

  const goToInvite = (event_name = "click_invite", from = 0) => {
    window.analytics.logEvent(event_name);
    window.location.hash = `#/invite/${btoa(
      processInfo.promotionalLink
    )}/${from}`;
  };
  const goToDownload = (appName) => {
    window.analytics.logEvent(`click_${appName}_download`);
    window.location.hash = `#/download/${appName}`;
  };

  const showVideo = () => {
    videoContainerRef.current.style.display = "block";
    videoRef.current.play();
  };

  const hideVideo = () => {
    videoContainerRef.current.style.display = "none";
    videoRef.current.pause();
  };
  //游戏资产
  let assets = [];
  for (let i = 0; i < userInfo.assets.length; ++i) {
    let asset = userInfo.assets[i];
    let gameName = userInfo.appName?.toLowerCase();
    let assetIconUrl = `${config.gameResourceUrl}${gameName}/assets_${asset.code}.png`;
    let button = (
      <Button disabled className="cash_out_button" size="small">
        CASH OUT
      </Button>
    );
    if (asset.currentValue >= asset.targetValue) {
      button = (
        <Button
          onClick={() =>
            (window.location.hash = `/cashInfo/${processInfo.stage}/:${processInfo.userCampaignId}`)
          }
          className="cash_out_button"
          size="small"
        >
          CASH OUT
        </Button>
      );
    }

    assets.push(
      <Flex key={`${userInfo.appName}_assets_${asset.code}`} justify="start">
        <Flex.Item>
          <Flex>
            <img alt="" src={assetIconUrl}></img>
            <span style={{ marginLeft: "8px" }}>
              {asset.value} / {asset.targetValue}
            </span>
          </Flex>
        </Flex.Item>
        {button}
      </Flex>
    );
  }

  //hot games
  let hotGamesNode = [];
  let banners = [];
  for (let i = 0; i < hotGames.length; ++i) {
    let game = hotGames[i];
    let gameName = game.name?.toLowerCase();
    let iconUrl = `${config.gameResourceUrl}${gameName}/icon.png`;
    let bannerUrl = `${config.gameResourceUrl}${gameName}/banner.jpg`;
    if (gameName !== userGameName) {
      banners.push(
        <img
          key={game.name}
          onClick={() => goToDownload(game.name)}
          alt=""
          src={bannerUrl}
        />
      );
      hotGamesNode.push(
        <React.Fragment key={game.name}>
          <WhiteSpace></WhiteSpace>
          <Flex className="user_game" justify="start">
            <img alt="" className="avatar" src={iconUrl} />
            <Flex.Item>
              <p>{game.name}</p>
              <p>{game.text}</p>
            </Flex.Item>
            <Button
              size="small"
              onClick={() => goToDownload(game.name)}
              className="play_button"
            >
              PLAY NOW
            </Button>
          </Flex>
        </React.Fragment>
      );
    }
  }

  let iconUrl =
    userGameName != ""
      ? `${config.gameResourceUrl}${userGameName}/icon.png`
      : null;
  let inviteNodes = (
    <React.Fragment>
      {randomBanner}
      <img className="play_video_btn" onClick={showVideo} src={playImg} />
      <div ref={videoContainerRef} className="redeem_video">
        <span onClick={hideVideo} className="close_icon">
          X
        </span>
        <video controls ref={videoRef} src={videoMp4}></video>
      </div>
      <img onClick={goToInvite} alt="" src={inviteBannerUrl} />
      <WhiteSpace></WhiteSpace>
      <div>
        <Progress
          position="normal"
          percent={processInfo.currentValue / processInfo.finalValue}
        />
        <WhiteSpace></WhiteSpace>${processInfo.currentValue} / $
        {processInfo.finalValue / 100}
      </div>
      <h3 style={{ paddingLeft: "15px", textAlign: "left" }}>My Games</h3>
      <Flex className="user_game" justify="start">
        <img alt="" className="avatar" src={iconUrl} />
        <Flex.Item>
          <span>{userInfo.appName}</span>
        </Flex.Item>
        {processInfo.canCashOut ? (
          <Button
            type="link"
            href={`#/cashInfo/${processInfo.stage}/${processInfo.userCampaignId}`}
            size="small"
            className="cash_out_button"
          >
            CASH OUT
          </Button>
        ) : (
          <Button onClick={goToInvite} size="small" className="cash_out_button">
            CASH OUT
          </Button>
        )}
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
      <WhiteSpace></WhiteSpace>
    </React.Fragment>
  );

  return (
    <div className="home">
      {base64UserInfo && inviteNodes}
      <Carousel className="hot_game_banner_container" autoplay infinite>
        {banners}
      </Carousel>
      {hotGamesNode}
      <ContactUs></ContactUs>
      <Modal
        className="envelop_container"
        transparent={true}
        onClose={() => setEnvelopStatus(ENVELOP_STATUS.closed)}
        slide={true}
        maskCloseable={true}
        visible={envelopStatus === ENVELOP_STATUS.pending}
      >
        <div className="envelop">
          <Button
            onClick={() => setEnvelopStatus(ENVELOP_STATUS.received)}
            className="open_envelop"
            size="small"
            type="primary"
          >
            OPEN
          </Button>
        </div>
      </Modal>
      <Modal
        className="envelop_container"
        transparent={true}
        slide={true}
        onClose={() => setEnvelopStatus(ENVELOP_STATUS.closed)}
        maskCloseable={true}
        visible={envelopStatus === ENVELOP_STATUS.received}
      >
        <div className="paypal">
          <p className="paypal_value">$30</p>
          <Button
            className="envelop_cashout cash_out_button"
            size="small"
            type="link"
            onClick={goToInvite}
          >
            CASH OUT
          </Button>
        </div>
      </Modal>
    </div>
  );
}

const ENVELOP_STATUS = {
  pending: 1, //领取中
  received: 2, //已领取
  closed: 3, //关闭领取
};

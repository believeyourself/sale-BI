import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  WhiteSpace,
  Button,
  Flex,
  Carousel,
  Progress,
  Modal,
  NoticeBar,
} from "antd-mobile";
import ContactUs from "../../components/contactUs";
import { getUserCampaign } from "../../actions/user";
import { getConfig } from "../../actions/global";

//图片
import inviteBannerUrl from "../../assets/invite_banner.jpg";
import playImg from "../../assets/play.png";
import fbUrl from "../../assets/facebook.png";
import gift_card from "../../assets/gift_card.png";

import videoMp4 from "../../assets/redeem.mp4";
import "./index.css";
import config from "../../config/config";

const DEFAULT_INVITE_INFO = {};

function Home(props) {
  let {
    inviteInfo,
    userInfo = {},
    getUserCampaign,
    hotGames,
    getConfig,
  } = props;
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [randomBanner, setRandomBanner] = useState(null);
  const [envelopStatus, setEnvelopStatus] = useState(ENVELOP_STATUS.closed);
  const userGameName = userInfo.appName?.toLowerCase();

  useEffect(() => {
    if (userInfo) {
      getUserCampaign(userInfo);
      getConfig();
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
    }
  }, [userInfo]);

  useEffect(() => {
    if (inviteInfo.theFirst) {
      setEnvelopStatus(ENVELOP_STATUS.pending);
    }
  }, [inviteInfo]);

  const goToInvite = (event_name = "click_invite", from = 0) => {
    window.analytics.logEvent(event_name);
    window.location.hash = `#/invite/${from}`;
  };

  const goToCashOut = (canCashout) => {
    window.analytics.logEvent("click_cash_out");
    if (canCashout) {
      window.location.hash = `#/cashInfo/${inviteInfo.stage}/${inviteInfo.userCampaignId}`;
    } else {
      Modal.alert(
        "Not engouh balance to request payout",
        "Invite friends now!",
        [
          {
            text: "CANCEL",
            onPress: () => console.log("cancel"),
            style: "default",
          },
          { text: "INVITE", onPress: goToInvite },
        ]
      );
    }
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

  if (Array.isArray(userInfo.assets)) {
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
              (window.location.hash = `/cashInfo/${inviteInfo?.stage}/:${inviteInfo?.userCampaignId}`)
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
    userGameName !== ""
      ? `${config.gameResourceUrl}${userGameName}/icon.png`
      : null;
  let inviteNodes = (
    <React.Fragment>
      <NoticeBar marqueeProps={{ loop: true, style: { padding: "0 7.5px" } }}>
        Dear all players, the last invitation activity is completed. A new huge
        invitation activity for $50 is luanched, join us!!
      </NoticeBar>
      <WhiteSpace></WhiteSpace>
      {randomBanner}
      <img
        alt=""
        className="play_video_btn"
        onClick={showVideo}
        src={playImg}
      />
      <div ref={videoContainerRef} className="redeem_video">
        <span onClick={hideVideo} className="close_icon">
          X
        </span>
        <video controls ref={videoRef} src={videoMp4}></video>
      </div>
      <img onClick={goToInvite} alt="" src={inviteBannerUrl} />
      <WhiteSpace></WhiteSpace>
      <h3 style={{ textAlign: "left" }}>Redeem Process</h3>
      <Flex className="user_game">
        <Flex.Item>
          <Progress
            position="normal"
            percent={(inviteInfo?.currentValue / inviteInfo?.finalValue) * 100}
          />
        </Flex.Item>
        <Flex.Item>
          ${(inviteInfo?.currentValue / 100)?.toFixed(2)} / $
          {inviteInfo?.finalValue / 100}
        </Flex.Item>
        <Button
          onClick={() => goToCashOut(inviteInfo.canCashout)}
          size="small"
          className="cash_out_button"
        >
          CASH OUT
        </Button>
      </Flex>
      <h3 style={{ textAlign: "left" }}>My Games</h3>
      <Flex className="user_game" justify="start">
        <img alt="" className="avatar" src={iconUrl} />
        <Flex.Item>
          <span>{userInfo.appName}</span>
        </Flex.Item>
        <Button onClick={goToInvite} size="small" className="play_button">
          INVITE
        </Button>
      </Flex>
      <WhiteSpace></WhiteSpace>
      <section className="user">
        <Flex justify="start">
          <img alt="" className="avatar" src={fbUrl} />
          <Flex.Item>
            <span>{inviteInfo.name}</span>
          </Flex.Item>
        </Flex>
        <WhiteSpace></WhiteSpace>
        {assets}
      </section>
      <h3 style={{ textAlign: "left" }}>Hot Games</h3>
      <WhiteSpace></WhiteSpace>
    </React.Fragment>
  );

  return (
    <div className="home">
      {userInfo && inviteNodes}
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
          <p className="paypal_value">${inviteInfo?.currentValue / 100}</p>
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

const mapStateToProps = ({ user, global }, ownProps) => ({
  userInfo: user.userInfo,
  inviteInfo: user.inviteInfo || DEFAULT_INVITE_INFO,
  hotGames: global.hotGames || [],
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  getUserCampaign: (useInfo) => dispatch(getUserCampaign(useInfo)),
  getConfig: () => dispatch(getConfig()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

import React, { useState, useEffect, useRef } from "react";
import { WhiteSpace, Button, Flex, Toast, Badge, Carousel } from "antd-mobile";
import ContactUs from "../../components/contactUs";
import request from "../../utils/request";

//图片
import inviteBannerUrl from "../../assets/invite_banner.jpg";
import playImg from "../../assets/play.png";
import userUrl from "../../assets/user.jpg";
import fbUrl from "../../assets/facebook.png";
import inviteUrl from "../../assets/invite.png";
import arcadepusher_assets_0 from "../../assets/arcadepusher_assets_0.png";
import arcadepusher_assets_1 from "../../assets/arcadepusher_assets_1.png";
import arcadepusher_assets_2 from "../../assets/arcadepusher_assets_2.png";
import bingooo_assets_02 from "../../assets/binggo_assets_0.png";
import bingooo_assets_01 from "../../assets/binggo_assets_1.png";
import slotsgo_assets_01 from "../../assets/slotsgo_assets_01.png";
import slotsgo_assets_02 from "../../assets/slotsgo_assets_02.png";
import arcadePusherIcon from "../../assets/arcadePusher.png";
import slotsGoIcon from "../../assets/slotsgo_icon.png";
import plinkoGoIcon from "../../assets/plinkogo_icon.png";
import bingGoIcon from "../../assets/binggo_icon.png";
import candyPusherIcon from "../../assets/candypusher_icon.png";
import plinkoManiaIcon from "../../assets/plinkomania_icon.png";
import slotsGoBanner from "../../assets/slotsgo_banner.jpg";
import arcadePusherBanner from "../../assets/arcadepusher_banner.jpg";
import plinkoGoBanner from "../../assets/plinkogo_banner.jpg";
import bingGoBanner from "../../assets/binggo_banner.jpg";
import plinkomaniaBanner from "../../assets/plinkomania_banner.jpg";
import candyPusherBanner from "../../assets/candypusher_banner.jpg";
import gift_card from "../../assets/gift_card.png";
import videoMp4 from "../../assets/redeem.mp4";
import "./index.css";

const ASSETS_IMAGE = {
  arcadepusher_assets_0,
  arcadepusher_assets_1,
  arcadepusher_assets_2,
  bingooo_assets_02,
  bingooo_assets_01,
  slotsgo_assets_01,
  slotsgo_assets_02,
};

const GAME_ICON = {
  arcadepusher: arcadePusherIcon,
  slotsgo: slotsGoIcon,
  plinkomania: plinkoManiaIcon,
  plinkogo: plinkoGoIcon,
  bingooo: bingGoIcon,
};

const HOT_GAMES = [
  {
    icon: arcadePusherIcon,
    name: "arcadePusher",
    banner: arcadePusherBanner,
    text: "",
  },
  {
    icon: slotsGoIcon,
    name: "slotsGo",
    banner: slotsGoBanner,
    text: "",
  },
  {
    icon: candyPusherIcon,
    name: "candyPusher",
    banner: candyPusherBanner,
    text: "",
  },
  {
    icon: plinkoManiaIcon,
    name: "plinkoMania",
    banner: plinkomaniaBanner,
    text: "",
  },
  {
    icon: plinkoGoIcon,
    name: "plinkoGo",
    banner: plinkoGoBanner,
    text: "",
  },
  {
    icon: bingGoIcon,
    name: "bingooo",
    banner: bingGoBanner,
    text: "",
  },
];

export default function Home(props) {
  let { match } = props;
  let base64UserInfo = match.params?.userInfo;
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [randomBanner, setRandomBanner] = useState(null);
  const [userInfo, setUserInfo] = useState({
    appName: "",
    assets: [],
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
    let { data: userInfo } = await request.post(
      "/marketing/infoVerify",
      base64UserInfo
    );

    let { data: processInfo } = await request.get(
      `/marketing/campaigns?accountId=${userInfo.accountId}&appName=${userInfo.appName}`
    );

    setUserInfo(userInfo);
    setProcessInfo(processInfo);
    Toast.hide();
  };

  useEffect(() => {
    if (base64UserInfo) {
      let randomNum = Math.ceil(Math.random() * 100);
      if (randomNum < 40) {
        window.analytics.logEvent("cashout_invite_show");
        setRandomBanner(
          <div className="random_banner">
            <img src={gift_card} />
            <p>You received $4</p>
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
  }, []);

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

  //拉新进度展示
  let avatars = [];
  let avatarNode = null;
  let invites = [];
  let avatarCount = processInfo.currentValue;
  for (let i = 0; i < avatarCount; ++i) {
    if (i < 6) {
      avatars.push(
        <img
          key={"avatar" + i}
          alt=""
          className="avatar user_invited"
          src={userUrl}
        />
      );
    } else {
      invites.push(
        <img key={"avatar" + i} alt="" className="avatar" src={userUrl} />
      );
    }
  }

  if (avatars.length > 0) {
    avatarNode = (
      <Badge
        style={{
          position: "absolute",
          right: -3 * avatars.length + "px",
          top: "1px",
        }}
        text={avatars.length}
      >
        <div className="invited_avatar">{avatars}</div>
      </Badge>
    );
  }

  let inviteCount = 10 - avatarCount;
  let inviteImgCount = avatarCount > 0 ? 4 : 5;
  for (let i = 0; i < inviteCount && i < inviteImgCount; ++i) {
    invites.push(
      <img
        onClick={goToInvite}
        key={"invite" + i}
        alt=""
        className="avatar user_invite"
        src={inviteUrl}
      />
    );
  }

  //游戏资产
  let assets = [];

  for (let i = 0; i < userInfo.assets.length; ++i) {
    let asset = userInfo.assets[i];
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
            <img
              alt=""
              src={
                ASSETS_IMAGE[
                  `${userInfo.appName.toLowerCase()}_assets_${asset.code}`
                ]
              }
            ></img>
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
  let hotGames = [];
  let banners = [];
  for (let i = 0; i < HOT_GAMES.length; ++i) {
    let game = HOT_GAMES[i];
    if (game.name?.toLowerCase() !== userInfo.appName?.toLowerCase()) {
      banners.push(
        <img
          key={game.name}
          onClick={() => goToDownload("slotsGo")}
          alt=""
          src={game.banner}
        />
      );
      hotGames.push(
        <React.Fragment key={game.name}>
          <WhiteSpace></WhiteSpace>
          <Flex className="user_game" justify="start">
            <img alt="" className="avatar" src={game.icon} />
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

  let inviteNodes = (
    <React.Fragment>
      <img className="play_video_btn" onClick={showVideo} src={playImg} />
      <div ref={videoContainerRef} className="redeem_video">
        <span onClick={hideVideo} className="close_icon">
          X
        </span>
        <video controls ref={videoRef} src={videoMp4}></video>
      </div>
      <img onClick={goToInvite} alt="" src={inviteBannerUrl} />
      <WhiteSpace></WhiteSpace>
      <Flex className="process" justify="around">
        {avatarNode}
        <Flex justify="around">{invites}</Flex>
      </Flex>
      <h3 style={{ paddingLeft: "15px", textAlign: "left" }}>My Games</h3>
      <Flex className="user_game" justify="start">
        <img
          alt=""
          className="avatar"
          src={GAME_ICON[userInfo.appName.toLowerCase()]}
        />
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
          <Button onClick={goToInvite} size="small" className="play_button">
            INVITE
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
      {randomBanner}
      {base64UserInfo && inviteNodes}
      <Carousel className="hot_game_banner_container" autoplay infinite>
        {banners}
      </Carousel>
      {hotGames}
      <ContactUs></ContactUs>
    </div>
  );
}

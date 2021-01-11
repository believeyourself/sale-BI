import React from "react";
import {
  Button,
  InputItem,
  Toast,
  WhiteSpace,
  Flex,
  NavBar,
} from "antd-mobile";
import {connect} from "react-redux"

import backImg from "../../assets/back.png";
import copy from "copy-to-clipboard";
import inviteBanner from "../../assets/invite_banner.jpg";
import emailIcon from "../../assets/email.png";
import facebookIcon from "../../assets/facebook.png";
import telegramIcon from "../../assets/telegram.png";
import whatsappIcon from "../../assets/whatsapp.png";
import moreIcon from "../../assets/more.png";
import "./index.css";

const info = [
  "Invite friends to download, gain cash right now!",
  "Help! Without you, I can't cash out$50 for free.",
  "$50 is waiting for you, download right now!",
  "Funny Game, and gain $50 easily.",
  "An easy way to earn $50.",
  "Just for 1 minute and gain $50!",
  "The most fastest way to earn $50!",
  "Hey guys, a quick way to earn $50,download this funny game.",
  "OMG, $50 is so easy to get，I'm about to cash out, don't you wanna have a try!",
  "Everyone is playing, everyone is withdrawing, what are you waiting for, hurry up and download right now~",
];

const Invite = ({inviteInfo,match}) => {
  const emailContent = `Hi,How is it going？I'm playing the so funny game and need you help right now!Just help me download this game thorough the link and I can gain $50 immediately!%0dClick the link！👇👇👇(If link is not clickable, please copy and paste it into the address bar)%0d`;
  const shareUrl = inviteInfo.promotionalLink;
  const from = match.params.from;
  const randomIndex = Math.floor(Math.random() * info.length);
  const emailTitleIndex = Math.floor(Math.random() * 8);
  const randomInfo = info[randomIndex];
  const randomEmailTitle = info[emailTitleIndex];

  const copyUrl = () => {
    if (from === 1) {
      window.analytics.logEvent("click_copy_url_cashout");
    } else {
      window.analytics.logEvent("click_copy_url");
    }

    copy(`${randomInfo} Click the link！👇👇👇\n${shareUrl}`);
    Toast.success("Copy Success!Invite your best friends and win real money!");
  };

  let share = () => {
    window.FB?.ui(
      {
        method: "share",
        href: shareUrl,
      },
      function (response) {}
    );
  };
  if (window.navigator.share) {
    share = () => {
      navigator
        .share({
          title: randomEmailTitle,
          url: shareUrl,
        })
        .then(() => {});
    };
  }

  return (
    <div>
      <NavBar
        icon={<img className="back" alt="back" src={backImg}></img>}
        style={{ backgroundColor: "#FFF" }}
        onLeftClick={() => window.history.back(-1)}
      />
      <div className="invite_container">
        <h3>INVITE FRIENDS</h3>
        <img alt="404" width="100%" src={inviteBanner} />
        <h3>SHARE INVITE VIA</h3>
        <Flex justify="around" className="share">
          <img alt="facebook" onClick={share} src={facebookIcon} />
          {window.navigator.share && (
            <img alt="telegram" onClick={share} src={telegramIcon} />
          )}
          {window.navigator.share && (
            <img alt="whatsapp" onClick={share} src={whatsappIcon} />
          )}
          <a
            href={`mailto:?subject=${randomEmailTitle}&body=${emailContent}${shareUrl}`}
          >
            <img alt="email" src={emailIcon} />
          </a>
          {window.navigator.share && (
            <img alt="more" onClick={share} src={moreIcon} />
          )}
        </Flex>
        <WhiteSpace size="lg"></WhiteSpace>
        <Flex>
          <InputItem value={shareUrl} className="shareUrl" disabled></InputItem>
          <Flex.Item>
            <Button onClick={copyUrl} type="primary">
              COPY
            </Button>
          </Flex.Item>
        </Flex>
      </div>
    </div>
  );
};

const mapStateToPrpos = ({user},ownProps) =>({
  useInfo:user.useInfo,
  inviteInfo:user.inviteInfo,
})

export default connect(mapStateToPrpos)(Invite);

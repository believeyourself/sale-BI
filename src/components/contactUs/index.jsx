import React from "react";
import facebookUrl from "../../assets/facebook.png";
import whatsAppUrl from "../../assets/whatsapp.png";
import telegramUrl from "../../assets/telegram.png";
import { Flex } from "antd-mobile";
import config from "../../config/config.js";
import "./index.css";

function ContactUs() {

    const redirectTo = (url) => {
        window.location.href = config.contactUs[url];
    }

    return (
        <footer className="contact_us">
            <Flex justify="around">
                <div className="imgContainer">
                    <img alt="" onClick={() => redirectTo("facebook")} src={facebookUrl} />
                </div>
                <div className="imgContainer">
                    <img alt="" onClick={() => redirectTo("telegram")} src={telegramUrl} />
                </div>
                <div className="imgContainer">
                    <img alt="" onClick={() => redirectTo("whatsApp")} src={whatsAppUrl} />
                </div>
            </Flex>
        </footer>
    )
}

export default ContactUs;
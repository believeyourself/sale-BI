import React, { useEffect, useState } from "react";
import { Button, Toast, Flex, InputItem, List, WhiteSpace, NavBar } from "antd-mobile";
import backImg from "../../assets/back.png"
import didabuImg from "../../assets/radiusIcon.png"
import ContactUs from "../../components/contactUs"
import request from "../../utils/request";
import "./index.css";

const CashInfo = (props) => {
    let { userCampaignId } = props.match.params;
    const [paypal, setPaypal] = useState(null);
    const [loading, setLoading] = useState(false);
    const setUserPaypal = async () => {
        setLoading(true);
        if (!paypal) {
            Toast.fail("Please enter your paypal account");
            return;
        }
        let response = await request.post("https://fkz3gphuoa.execute-api.us-west-2.amazonaws.com/Prod/marketing/paypal", {
            userCampaignId,
            paypal
        });
        if (response.code === 200 && response.isSuccessful) {
            Toast.success("save paypal success!");
        } else {
            Toast.fail(`Server internal error:${response.message}`);
        }

        window.analytics.logEvent("set_paypal");
        setLoading(false);
    }

    useEffect(() => {
        window.analytics.logEvent("enter_set_paypal_page");
    }, [])
    return (
        <div>
            <NavBar
                icon={<img className="back" alt="back" src={backImg}></img>}
                style={{ backgroundColor: "#FFF" }}
                onLeftClick={() => window.history.back(-1)}
            />
            <Flex className="cash_info_header" justify="center" align="center">
                <img alt="didabu" src={didabuImg}></img>
            </Flex>
            <List>
                <WhiteSpace size="xl"></WhiteSpace>
                <InputItem clear onChange={setPaypal} value={paypal} placeholder="Paypal Account">Paypal</InputItem>
                <WhiteSpace size="xl"></WhiteSpace>
                <Button loading={loading} onClick={setUserPaypal} type="primary">Done</Button>
            </List>
            <ContactUs />
        </div>
    )
}

export default CashInfo;
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectmagicLinkButtonTapTime, SELECT_MAGIC_LINK_RESEND_GAP } from '../../../../Utils/AppSelectors';
import { isValidElement, isValidNumber } from '../../../../Utils/helpers';

const TimerCountdown = (props) => {
    const [seconds, setSeconds] = useState(0);
    const buttonTapTime = useSelector(selectmagicLinkButtonTapTime);
    let curTime = new Date().getTime();
    let timeDiff = curTime - buttonTapTime?.buttonEnableTime;
    let value = -Math.round(timeDiff / 1000);
    value = value < 10 ? `0${value}` : value;

    const MAGIC_LINK_RESEND_GAP = useSelector(SELECT_MAGIC_LINK_RESEND_GAP);

    useEffect(() => {
        if (isValidElement(MAGIC_LINK_RESEND_GAP)) {
            setSeconds(MAGIC_LINK_RESEND_GAP);
        }
    }, [MAGIC_LINK_RESEND_GAP]);

    useEffect(() => {
        if (isValidElement(buttonTapTime?.buttonEnableTime)) {
            setSeconds(MAGIC_LINK_RESEND_GAP);
        }
    }, [buttonTapTime?.buttonEnableTime, MAGIC_LINK_RESEND_GAP]);
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (seconds > 0) {
                let nxtValue = seconds - 1;
                if (!isValidNumber(nxtValue)) {
                    nxtValue = 0;
                    props.setDisable(false);
                }
                const value = nxtValue < 10 ? `0${nxtValue}` : nxtValue;
                setSeconds(value);
            }
        }, 1000);

        if (buttonTapTime?.buttonEnableTime <= curTime || !isValidNumber(value)) {
            props.setDisable(false);
        }

        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seconds]);

    return <>00:{value}</>;
};
export default TimerCountdown;

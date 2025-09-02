import React from 'react';

/**
 *  We have hosted flags in foodhub assets folder as per below ticket. All country flag is available, send same code that we do in react-native-flags
 *
 *
 * https://touch2success.atlassian.net/browse/FDHB-32112
 * @param style
 * @param code
 * @param size, as of now we dont support size. If needed we can add later.
 * @returns {JSX.Element}
 * @constructor
 */
const T2SFlagsWeb = ({ style, code, size }) => {
    return <img src={`https://assets.foodhub.com/images/country-flags/${code?.toUpperCase() ?? null}.png`} style={style} />;
};

export default T2SFlagsWeb;

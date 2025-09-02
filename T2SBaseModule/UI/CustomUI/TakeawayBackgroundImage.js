import React from 'react';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';
import { isValidImageUrl } from '../../Utils/helpers';
import { Image } from 'react-native';
import { useSelector } from 'react-redux';
import { getDefaultTALogoSmall } from '../../../AppModules/BaseModule/GlobalAppHelper';

const TakeawayBackgroundImage = (props) => {
    const { screenName, id, source, style } = props;
    const appName = useSelector((state) => state?.appState?.initialConfigWeb?.franchise?.name);
    if (isValidImageUrl(source.uri)) {
        return <T2SFastImage {...props} {...setTestId(screenName, id)} />;
    } else {
        return <Image resizeMode="cover" source={getDefaultTALogoSmall(appName)} style={style} />;
    }
};
TakeawayBackgroundImage.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};
export default TakeawayBackgroundImage;

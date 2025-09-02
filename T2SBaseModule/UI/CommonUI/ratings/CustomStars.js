import React from 'react';
import CustomIcon from '../../CustomUI/CustomIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { styles } from './Style/StarStyle';
import PropTypes from 'prop-types';
import T2SView from '../T2SView';
import Colors from '../../../Themes/Colors';
import T2STouchableWithoutFeedback from '../T2STouchableWithoutFeedback';
import { createDynamicListWithNumber } from '../../../Utils/helpers';

//Custom star component without react package
export default class Stars extends React.Component {
    constructor(props) {
        super(props);
        const { totalStars } = props;
        this.state.starsCount = createDynamicListWithNumber(totalStars);
    }

    state = {
        rating: this.props.starValue
    };

    handleRating = (rating) => {
        this.setState({ rating });
    };

    render() {
        const { screenName, id, starContainerStyle } = this.props;
        const { starsCount } = this.state;
        return (
            <T2SView screenName={screenName} id={id} style={starContainerStyle}>
                {starsCount.map((value) => this.renderStar(value))}
            </T2SView>
        );
    }

    renderStar = (value) => {
        const { size, starValue, onPress, activeStarColor, inActiveStarColor } = this.props;
        const color = value <= starValue ? activeStarColor.color : inActiveStarColor.color;
        return (
            <T2STouchableWithoutFeedback
                onPress={() => {
                    onPress(value);
                }}>
                <CustomIcon
                    style={styles.icon}
                    name={value <= starValue ? FONT_ICON.STAR_FILL : FONT_ICON.STAR_STROKE}
                    color={color}
                    size={size}
                />
            </T2STouchableWithoutFeedback>
        );
    };
}

Stars.propTypes = {
    onPress: PropTypes.func.isRequired,
    activeStarColor: PropTypes.string,
    inActiveStarColor: PropTypes.string,
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    size: PropTypes.number
};

Stars.defaultProps = {
    totalStars: 5,
    size: 50,
    activeStarColor: Colors.secondary_color,
    inActiveStarColor: Colors.grey,
    starContainerStyle: styles.starContainerStyle
};

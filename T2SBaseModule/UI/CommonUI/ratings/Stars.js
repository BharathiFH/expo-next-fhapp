import React from 'react';
import CustomIcon from '../../CustomUI/CustomIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { styles } from './Style/StarStyle';
import PropTypes from 'prop-types';
import T2SView from '../T2SView';
import Colors from '../../../Themes/Colors';
import SwipeableRating from 'react-native-swipeable-rating';
import { isValidElement } from '../../../Utils/helpers';
import T2SIcon from '../T2SIcon';

export default class Stars extends React.Component {
    state = {
        rating: this.props.starValue
    };

    handleRating = (rating) => {
        this.setState({ rating });
    };

    render() {
        const {
            screenName,
            id,
            size,
            onPress,
            totalStars,
            starContainerStyle,
            offsetFromLeft,
            emptyStarColor,
            isLandscapeTabletWebDevice,
            starValue
        } = this.props;
        const stars = [];
        stars.push(
            <SwipeableRating
                color={Colors.ratingYellow}
                emptyColor={isValidElement(emptyStarColor) ? emptyStarColor : Colors.textGrey}
                size={size}
                rating={starValue}
                minRating={1}
                maxRating={totalStars}
                xOffset={offsetFromLeft ? offsetFromLeft : 0}
                swipeable={isLandscapeTabletWebDevice ? false : true}
                onPress={(value) => {
                    this.handleRating(value);
                    onPress(value);
                }}
                gap={5}
                filledIcon={this.renderFilledIcon}
                emptyIcon={this.renderEmptyIcon}
            />
        );

        return (
            <T2SView screenName={screenName} id={id} style={starContainerStyle}>
                {stars}
            </T2SView>
        );
    }

    renderFilledIcon(size, gap, color) {
        return <T2SIcon style={{ color: color, marginRight: gap }} name={FONT_ICON.STAR_FILL} size={size} />;
    }

    renderEmptyIcon(size, gap, emptyColor) {
        return <T2SIcon style={{ color: emptyColor, marginRight: gap }} name={FONT_ICON.STAR_STROKE} size={size} />;
    }

    renderStar = ({ value }) => {
        const { size, starValue, onPress, activeStarColor, inActiveStarColor } = this.props;
        const color = value <= starValue ? activeStarColor.color : inActiveStarColor.color;
        return (
            <CustomIcon
                name={value <= starValue ? FONT_ICON.STAR_FILL : FONT_ICON.STAR_STROKE}
                color={color}
                size={size}
                onPress={() => {
                    onPress(value);
                }}
            />
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

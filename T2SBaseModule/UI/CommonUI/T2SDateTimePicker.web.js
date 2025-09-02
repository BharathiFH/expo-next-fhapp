import React, { Component } from 'react';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import Datetime from 'react-datetime';
import { View } from 'react-native';
import Style from './Style/T2SDateTimePickerStyle';
import T2SButton from './T2SButton';
import { LOCALIZATION_STRINGS } from '../../../AppModules/LocalizationModule/Utils/Strings';
import { DATE_FORMAT, DATE_PICKER_CONSTANTS, isDateWithinRange } from 't2sbasemodule/Utils/DateUtil';
import { SCREEN_NAME } from '../../../AppModules/AuthModule/Utils/AuthConstants';
import { VIEW_ID } from '../../Utils/Constants';
import T2SView from './T2SView';
import T2SModalWrapper from './T2SModalWrapper';
import NavigationUseFocus from '../../../CustomerApp/Navigation/NavigationUseFocus';
import { bodyScroll } from '../../Utils/StyleHelper';

class T2SDateTimePicker extends Component {
    constructor(props) {
        super(props);
        let { date = new Date() } = props;
        this.state = {
            selectedDate: date
        };
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }
    onFocus() {
        bodyScroll('hidden');
    }
    onBlur() {
        bodyScroll('unset');
    }
    onCancel() {
        this.setState({ selectedDate: null });
        this.props.onCancel();
    }
    onSave() {
        this.props.onConfirm(this.state.selectedDate);
    }

    validation(currentDate) {
        if (isValidElement(currentDate)) {
            const { mode } = this.props;
            return isDateWithinRange(currentDate, this.props.minimumDate, this.props.maximumDate, mode);
        }
        return true;
    }

    renderButtonContainer() {
        return (
            <View style={Style.buttonsParentViewStyle}>
                <View style={Style.cancelButtonViewStyle}>
                    <T2SButton
                        buttonStyle={Style.cancelButtonStyle}
                        buttonTextStyle={Style.saveButtonTextStyle}
                        onPress={this.onCancel.bind(this)}
                        screenName={SCREEN_NAME.ASSURANCE_MODAL}
                        id={VIEW_ID.CANCEL}
                        mode={'contained'}
                        opacity={0.5}
                        title={LOCALIZATION_STRINGS.CANCEL.toUpperCase()}
                    />
                </View>
                <View style={Style.saveButtonViewStyle}>
                    <T2SButton
                        buttonStyle={Style.saveButtonStyle}
                        buttonTextStyle={Style.saveButtonTextStyle}
                        onPress={this.onSave.bind(this)}
                        screenName={SCREEN_NAME.ASSURANCE_MODAL}
                        id={VIEW_ID.SAVE}
                        title={LOCALIZATION_STRINGS.SAVE.toUpperCase()}
                    />
                </View>
            </View>
        );
    }

    initialViewMode() {
        let { mode } = this.props;
        if (mode === DATE_PICKER_CONSTANTS.TIME) {
            return DATE_PICKER_CONSTANTS.TIME;
        }
        return DATE_PICKER_CONSTANTS.DAYS;
    }
    render() {
        let { isVisible, onCancel, mode, date } = this.props;
        if (isValidElement(isVisible) && isVisible) {
            return (
                <T2SModalWrapper
                    style={Style.dateTimePickerModal}
                    onShow={() => {
                        this.setState({ selectedDate: date });
                    }}
                    isVisible={isVisible}
                    onRequestClose={onCancel}
                    onBackdropPress={onCancel}>
                    <T2SView style={Style.dateTimePickerContainer}>
                        <NavigationUseFocus onFocus={this.onFocus} onBlur={this.onBlur} />
                        <Datetime
                            initialValue={this.state.selectedDate}
                            initialViewMode={this.initialViewMode()}
                            initialViewDate={this.state.selectedDate}
                            input={false}
                            value={this.state.selectedDate}
                            onChange={(date) => this.setState({ selectedDate: date })}
                            isValidDate={this.validation.bind(this)}
                            timeFormat={this.getTimeFormat()}
                            dateFormat={mode === DATE_PICKER_CONSTANTS.TIME ? false : true}
                        />
                        {this.renderButtonContainer()}
                    </T2SView>
                </T2SModalWrapper>
            );
        }
        return null;
    }
    getTimeFormat = () => {
        const { mode, is24Hour } = this.props;
        if (mode === DATE_PICKER_CONSTANTS.TIME || mode === DATE_PICKER_CONSTANTS.DATE_TIME) {
            if (is24Hour) {
                return DATE_FORMAT.HH_mm;
            }
            return true;
        } else {
            return false;
        }
    };
}
export default T2SDateTimePicker;
T2SDateTimePicker.defaultProps = {
    mode: DATE_PICKER_CONSTANTS.DATE,
    is24Hour: false
};

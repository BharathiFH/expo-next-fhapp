import React, { Component } from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class T2SDateTimePicker extends Component {
    render() {
        let { isVisible, minimumDate, maximumDate, onConfirm, onCancel, date, mode = 'date' } = this.props;
        return (
            <DateTimePicker
                date={date}
                isVisible={isVisible}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                onConfirm={onConfirm}
                onCancel={onCancel}
                mode={mode}
                {...this.props}
            />
        );
    }
}

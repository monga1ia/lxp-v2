import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import { useTranslation } from "react-i18next";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {
  formatDate,
  parseDate
} from 'react-day-picker/moment';

const { t } = useTranslation();

class DatePickerInput extends Component {

    constructor(props) {
        super(props)
        this.state = {
            locale: props.locale,
            dateValue: props.value,
            containerHeight: 35
        }
    }
    componentDidUpdate() {
        if (this.state.locale !== this.props.locale) {
            this.setState({
                locale: this.props.locale
            });
        }

        if (this.state.dateValue !== this.props.value) {
            this.setState({
                dateValue: this.props.value,
            })
        }
    }

    onDateChange = (day, a, input) => {
        const inputObj = input.getInput();
        let val = input.input.value;
        if (val && val.length > 0) {
            val = val.trim();
            let numbers = val.match(/\d/g);
            val = numbers.join("");

            let year = val.substring(0, 4);
            let month = val.substring(4, 6);
            let date = val.substring(6, 8);

            let dateVal = year + (month.length > 0 ? ('-' + month) : '') + (date.length > 0 ? ('-' + date) : '');
            this.setState({
                dateValue: dateVal,
                updateView: true
            })
            this.props.onChange(dateVal);
        }
    }

    updateContainer = (isShowing) => {
        let newHeight = 35;
        if (isShowing) {
            newHeight = 270;
        }
        this.setState({
            containerHeight: newHeight
        })
    }

    render() {
        let dateVal = this.state.dateValue;
        let reg = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        let isValidDate = reg.test(dateVal);
        return (
            <div style={{ height: this.state.containerHeight }}>
                <DayPickerInput
                    placeholder={t(this.state.locale).datePickerPlaceholder || ''}
                    onDayChange={(day, a, input) => this.onDateChange(day, a, input)}
                    value={dateVal}
                    hideOnDayClick={true}
                    formatDate={formatDate}
                    format={'YYYY-MM-DD'}
                    parseDate={parseDate}
                    inputProps={{
                        className: isValidDate ? 'form-control m-input' : 'form-control m-input has-error',
                        maxLength: 10
                    }}
                    classNames={{
                        overlay: 'DayPickerInputOverlay'
                    }}
                    dayPickerProps={this.props.dayPickerProps || {}}
                    onDayPickerShow={() => this.updateContainer(true)}
                    onDayPickerHide={() => this.updateContainer(false)}
                />
            </div>
        )
    }
}

DatePickerInput.displayName = 'DatePickerInput';
export default DatePickerInput;
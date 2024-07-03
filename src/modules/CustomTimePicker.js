import React, {Component} from 'react'
import CustomInlineEdit from './CustomInlineEdit'

class CustomTimePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popoverVisible: false,
            value: props.value || '-',
        };
        this.minStep = props.minStep ? props.minStep : 1;
        this.hourStep = props.hourStep ? props.hourStep : 1;
        this.onChange = props.onChange;

        this.handleInputClick = this.handleInputClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    componentDidMount() {
        let height = this.node.clientHeight;
        this.setState({ height });
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.value !== nextProps.value && nextProps?.value?.length > 0) {
            this.setState({
                value: nextProps.value,
            })
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick, false);
    }

    render = () => {
        let hour = '-';
        let minute = '-';
        if (this.state.value && this.state.value.length === 5) {
            hour = this.state.value.substring(0, 2);
            minute = this.state.value.substring(3, 5);
        }
        let inputClassName = `timePickerInput ${this.props.disabled ? 'disabled' : ''} ${this.props.inputClassName}`;
        return (
            <div style={{height: this.state.height, width: '100%', position: 'relative'}}>
                <div
                    className={this.props.className ? "timePickerContainer " + this.props.className : "timePickerContainer"}
                    ref={node => {this.node = node;}}
                >
                    <div
                        className={inputClassName}
                        onClick={!this.props.disabled ? this.handleInputClick : null}
                    >
                        {
                            this.props.value
                                ?   this.props.value
                                :   this.state.value
                                ?   this.state.value
                                :   this.props.placeholder
                        }
                    </div>
                    {this.state.popoverVisible && (
                        <div
                            className={this.props.popoutClassName ? "timePickerPopout " + this.props.popoutClassName : "timePickerPopout"}
                        >
                            <table className='table-borderless'>
                                <tbody>
                                <tr>
                                    <td><div onClick={() =>this.popoverButtonClick('h-increment')}><i className="la la-angle-up"/></div></td>
                                    <td/>
                                    <td><div onClick={() =>this.popoverButtonClick('m-increment')}><i className="la la-angle-up"/></div></td>
                                </tr>
                                <tr>
                                    <td>{hour}</td>
                                    <td>:</td>
                                    <td>{minute}</td>
                                </tr>
                                <tr>
                                    <td><div onClick={() =>this.popoverButtonClick('h-decrement')}><i className="la la-angle-down"/></div></td>
                                    <td/>
                                    <td><div onClick={() =>this.popoverButtonClick('m-decrement')}><i className="la la-angle-down"/></div></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        )
    };

    handleInputClick() {
        if (!this.state.popoverVisible) {
            document.addEventListener('click', this.handleOutsideClick, false);
            this.setState({
                popoverVisible: true,
            })
        }
        let value = this.state.value;
        if (!value) {
            value = '00:00';
            this.setState({
                value,
            })
        } else {
            if (value.length < 5) {
                value = '00:00';
                this.setState({
                    value
                })
            }
        }
        this.onChange(value)
    }

    handleOutsideClick(e) {
        if (this.node.contains(e.target)) {
            return;
        }
        this.setState({
            popoverVisible: false
        });
        document.removeEventListener('click', this.handleOutsideClick, false);
    }

    popoverButtonClick(buttonType) {
        let value = this.state.value;
        let hour = null;
        let minute = null;
        if (value && value.length === 5) {
            hour = Number(value.substring(0, 2));
            minute = Number(value.substring(3, 5));
        }
        switch (buttonType) {
            case 'h-increment':
                hour = hour + this.hourStep;
                if (hour > 23) {
                    hour = hour - 24;
                }
                break;
            case 'm-increment':
                minute = minute + this.minStep;
                if (minute > 59) {
                    minute = minute - 60;
                }
                break;
            case 'h-decrement':
                hour = hour - this.hourStep;
                if (hour < 0) {
                    hour = hour + 24;
                }
                break;
            case 'm-decrement':
                minute = minute - this.minStep;
                if (minute < 0) {
                    minute = minute + 60;
                }
                break;
            default:
                alert('Error');
                break;
        }
        let strHour = hour + '';
        if (strHour.length === 1) {
            strHour = '0' + strHour;
        }
        let strMinute = minute + '';
        if (strMinute.length === 1) {
            strMinute = '0' + strMinute;
        }
        value = strHour + ':' + strMinute;
        this.setState({
            value
        });
        this.onChange(value);
    }
}

export default CustomTimePicker;
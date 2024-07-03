import React, { Component } from 'react'

class CustomInlineEdit extends Component {
    constructor(props){
        super(props);
        this.state = {
            isEditing: false,
            value: props.value || '',
            initVal: props.value || '',
        };
        this.textInput = React.createRef();
        this.onEditFocus = props.onFocus || null;
        this.onEditBlur = props.onBlur || null;
        this.onSave = props.onSaveClick || null;
        this.onDiscard = props.onDiscard || null;
    }

    // componentDidUpdate() {
    //     if (this.state.value !== this.props.value && !this.state.isEditing) {
    //         this.setState({
    //             value: this.props.value || '',
    //             initVal: this.props.value || '',
    //         })
    //     }
    // }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.state.value !== nextProps.value) {
            this.setState({
                value: nextProps.value || '',
                initVal: nextProps.value || '',
            })
        }
    }

    render = () => {
        return (
            <div>
                {
                    this.state.isEditing
                        ?   <div className={this.props?.wrapperClassName}>
                                <input
                                    className={this.props.inputClassName ? this.props.inputClassName : ""}
                                    spellCheck={false}
                                    type={this.props.inputType || 'text'}
                                    onWheel={(e) => e?.target?.blur()}
                                    ref={this.textInput}
                                    onChange={this.inputOnchange}
                                    onBlur={this.onBlur}
                                    value={this.state.value}
                                    onKeyPress={event => this.handleEnterClick(event)}
                                    min={this.props.min || null}
                                    max={this.props.max || null}
                                />
                                {
                                    this.props.buttons
                                        ?   [
                                                <button
                                                    key={'save'}
                                                    className={
                                                        this.props.saveButtonClassName
                                                        ?   "btn btn-outline-publish m-btn m-btn--icon m-btn--icon-only " + this.props.saveButtonClassName
                                                        :   "btn btn-outline-publish m-btn m-btn--icon m-btn--icon-only "
                                                    }
                                                    onMouseDown={this._handleSaveClick}
                                                >
                                                    <i className={this.props.saveButtonIcon || "la la-check"}/>
                                                </button>,
                                                <button
                                                    key={'discard'}
                                                    className={
                                                        this.props.discardButtonClassName
                                                        ?   "btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only " + this.props.discardButtonClassName
                                                        : "btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only "
                                                    }
                                                    onMouseDown={this._handleDiscardClick}
                                                >
                                                    <i className={this.props.discardButtonIcon || "la la-close"}/>
                                                </button>
                                            ]
                                        :   null
                                }
                            </div>
                        :   <label
                                className={this.props.labelClassName ? this.props.labelClassName : ""}
                                onClick={this.labelOnClick}
                            >
                             {this.state.value == null || this.state.value?.toString().trim()?.length === 0 ? '---' : this.state.value}
                            </label>
                }
            </div>
        )
    };

    inputOnchange = (e) => {
        if (this.props.inputType === 'number') {
            if (this.props.min !== undefined && this.props.max !== undefined) {
                const val = e.target.value;
                if (val !== undefined && val?.length > 0) {
                    if (parseFloat(this.props.min) <= parseFloat(val) && parseFloat(val) <= parseFloat(this.props.max)) {
                        this.setState({
                            value: parseFloat(e.target.value)
                        })
                    } else {
                        e.preventDefault();
                    }
                } else {
                    this.setState({
                        value: e.target.value
                    })
                }
            } else {
                this.setState({
                    value: e.target.value
                })
            }
        } else {
            this.setState({
                value: e.target.value
            })
        }
    };

    labelOnClick = () => {
        this.setState({
            isEditing: true,
        }, () => {
            this.textInput.current.focus();
        });
        if (this.onEditFocus && typeof this.onEditFocus === 'function') {
            this.onEditFocus(this.state.value, this.state.initVal);
        }
    };

    _handleSaveClick = () => {
        this.setState({
            isEditing: false,
        });
        if (this.onSave && typeof this.onSave === 'function') {
            this.onSave(this.state.value, this.state.initVal);
        }
    };

    _handleDiscardClick = () => {
        this.setState({
            isEditing: false,
            value: this.state.initVal
        });
        if (this.onDiscard && typeof this.onDiscard === 'function') {
            this.onDiscard(this.state.value, this.state.initVal);
        }
    };

    onBlur = () => {
        if (this.props.buttons) {
            this.setState({
                isEditing: false,
                value: this.state.initVal
            });
        }
        if (this.onEditBlur && typeof this.onEditBlur === 'function') {
            this.onEditBlur(this.state.value, this.state.initVal);
        }
    };

    handleEnterClick(e) {
        if (e.key === 'Enter') {
            this._handleSaveClick();
        }
    }

}
export default CustomInlineEdit

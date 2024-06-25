import React from 'react'
import { connect } from 'react-redux';
import { translations } from "Utilities/translations";
import * as actions from "Actions/action";
import { Link, Navigate, useLocation } from 'react-router-dom'
import { NDropdown as Dropdown } from "Widgets/Dropdown";
import SubHeader from "Src/SubHeader";
import _ from 'lodash';
import withHook from 'Utilities/hoc';
import message from 'Src/message';
import secureLocalStorage from 'react-secure-storage';

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

class edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // locale: props.locale,
            classId: props.location.state.id,
            fetchInit: false,
            showLoader: false,
            teacherList: [],
            schoolShift: [],
            scoreTypeList: [],
            gradeList: [],
            rooms: [],
            fetchSave: false,
            gradeId: null,
            className: '',
            teacherId: null,
            shiftId: null,
            scoreTypeId: null,
            redirect: false,
            roomNumberId: null,
        };
    };

    componentDidMount = () => {
        if (this.props?.location?.state?.id) {
            this.setState({
                fetchInit: true,
                showLoader: true,
            });
            let params = {
                submit: 0,
                class: this.props.location.state.id,
            };
            this.props.classEdit(params);
        } else {
            message(translations(this.props.locale).err.select_group)
            this.setState({ redirect: true })
        }
    };

    componentWillReceiveProps = (nextProps) => {
        // if (locale !== nextProps.locale) {
        //     this.setState({
        //         locale: nextProps.locale
        //     })
        // }
        if (this.state.fetchInit && !nextProps.initLoading) {
            if (nextProps.initSuccess === false) {
                this.setState({
                    fetchInit: false,
                    showLoader: false,
                });
                message(nextProps.initMessage);
            } else {
                this.setState({
                    fetchInit: false,
                    showLoader: false,
                    teacherList: nextProps.teacherList,
                    schoolShift: nextProps.schoolShift,
                    scoreTypeList: nextProps.scoreTypeList,
                    gradeList: nextProps.gradeList,
                    rooms: nextProps.rooms,
                    gradeId: nextProps.classInfo && nextProps.classInfo.grade ? nextProps.classInfo.grade : null,
                    className: nextProps.classInfo && nextProps.classInfo.name ? nextProps.classInfo.name : '',
                    teacherId: nextProps.classInfo && nextProps.classInfo.teacher ? nextProps.classInfo.teacher : null,
                    shiftId: nextProps.classInfo && nextProps.classInfo.shift ? nextProps.classInfo.shift : null,
                    scoreTypeId: nextProps.classInfo && nextProps.classInfo.scoreType ? nextProps.classInfo.scoreType : null,
                    roomNumberId: nextProps.classInfo && nextProps.classInfo.room ? nextProps.classInfo.room : '',
                })
            }
        }
        if (this.state.fetchSave && !nextProps.initLoading) {
            if (nextProps.initSuccess) {
                message(nextProps.initMessage, true);
                this.setState({
                    fetchSave: false,
                    showLoader: false,
                    redirect: true,
                });
            } else {
                this.setState({
                    fetchSave: false,
                    showLoader: false,
                });
                message(nextProps.initMessage);
            }
        }
    };

    render = () => {
        return (
            <div className="m-grid__item m-grid__item--fluid m-wrapper">
                <SubHeader
                    locale={locale}
                    title={translations(locale).group.title || null}
                />
                <div className="m-content">
                    <div className="m-portlet ">
                        <div className="m-portlet__body">
                            <table className='newClassTable mt-4'>
                                <thead>
                                    <tr>
                                        <th style={{ color: '#575962', fontSize: '12px' }} className='text-left pl-4'>
                                            {translations(locale).className.toUpperCase() || null}
                                        </th>
                                        <th style={{ color: '#575962', fontSize: '12px' }} className='text-left pl-4'>
                                            {translations(locale).group.title.toUpperCase() || null}
                                        </th>
                                        <th style={{ color: '#575962', fontSize: '12px' }} className='text-left pl-4'>
                                            {translations(locale).group.class_teacher.toUpperCase() || null}
                                        </th>
                                        <th style={{ color: '#575962', fontSize: '12px' }} className='text-left pl-4'>
                                            {translations(locale).group.school_shift.toUpperCase() || null}
                                        </th>
                                        <th style={{ color: '#575962', fontSize: '12px' }} className='text-left pl-4'>
                                            {translations(locale).group.score_type.toUpperCase() || null}
                                        </th>
                                        <th style={{ color: '#575962', fontSize: '12px' }} className='text-left pl-4'>
                                            {translations(locale).group.classroom.toUpperCase() || null}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <Dropdown
                                                placeholder={'-' + translations(locale).select + '-' || ""}
                                                fluid
                                                selection
                                                additionPosition='bottom'
                                                upward={false}
                                                closeOnChange
                                                selectOnBlur={false}
                                                value={this.state.gradeId}
                                                options={this.state.gradeList}
                                                onChange={this._gradeChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control newClassTableInput"
                                                value={this.state.className}
                                                onChange={this._classNameChange}
                                            />
                                        </td>
                                        <td>
                                            <Dropdown
                                                placeholder={'-' + translations(locale).select + '-' || ""}
                                                fluid
                                                selection
                                                search
                                                clearable
                                                additionPosition='bottom'
                                                upward={false}
                                                closeOnChange
                                                selectOnBlur={false}
                                                options={this.state.teacherList}
                                                value={this.state.teacherId}
                                                onChange={this._teacherChange}
                                            />
                                        </td>
                                        <td>
                                            <Dropdown
                                                placeholder={'-' + translations(locale).select + '-' || ""}
                                                fluid
                                                selection
                                                additionPosition='bottom'
                                                upward={false}
                                                closeOnChange
                                                selectOnBlur={false}
                                                options={this.state.schoolShift}
                                                value={this.state.shiftId}
                                                onChange={this._schoolShiftChange}
                                            />
                                        </td>
                                        <td>
                                            <Dropdown
                                                placeholder={'-' + translations(locale).select + '-' || ""}
                                                fluid
                                                selection
                                                additionPosition='bottom'
                                                upward={false}
                                                closeOnChange
                                                selectOnBlur={false}
                                                value={this.state.scoreTypeId}
                                                options={this.state.scoreTypeList}
                                                onChange={this._scoreTypeChange}
                                            />
                                        </td>
                                        <td>
                                            <Dropdown
                                                placeholder={'-' + translations(locale).select + '-' || ""}
                                                fluid
                                                selection
                                                clearable
                                                additionPosition='bottom'
                                                upward={false}
                                                closeOnChange
                                                selectOnBlur={false}
                                                value={this.state.roomNumberId}
                                                options={this.state.rooms}
                                                onChange={this._classRoomChange}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="m-portlet__foot text-center">
                            <Link
                                to='/school/classes'
                                className="btn btn-link margin-right-5"
                            >
                                {translations(locale).back || null}
                            </Link>
                            <button
                                onClick={this._saveClass}
                                className="btn m-btn--pill btn-success m-btn--wide"
                            >
                                {translations(locale).save.toUpperCase() || null}
                            </button>
                        </div>
                    </div>
                </div>
                {
                    this.state.showLoader
                        ?
                        <div>
                            <div className="blockUI blockOverlay" />
                            <div className="blockUI blockMsg blockPage">
                                <div className="m-loader m-loader--brand m-loader--lg" />
                            </div>
                        </div>
                        :
                        null
                }
                {
                    this.state.redirect &&
                    <Navigate to={'/school/classes'} replace />
                }
            </div>
        )
    };

    _gradeChange = (e, data) => {
        this.setState({
            gradeId: data.value,
        })
    }

    _classNameChange = e => {
        this.setState({
            className: e.target.value,
        })
    }

    _teacherChange = (e, data) => {
        this.setState({
            teacherId: data.value,
        })
    }

    _schoolShiftChange = (e, data) => {
        this.setState({
            shiftId: data.value,
        })
    }

    _scoreTypeChange = (e, data) => {
        this.setState({
            scoreTypeId: data.value,
        })
    }

    _classRoomChange = (e, data) => {
        this.setState({
            roomNumberId: data.value,
        })
    }

    _saveClass = () => {
        let valid = true;
        if (!this.state.gradeId) {
            message(translations(locale).err.select_class);
            valid = false;
        }
        if (!this.state.className) {
            message(translations(locale).err.insert_grade_name);
            valid = false;
        }
        // if (!this.state.teacherId) {
        //     message(translations(locale).err.select_teacher);
        //     valid = false;
        // }
        if (!this.state.shiftId) {
            message(translations(locale).err.select_school_shift);
            valid = false;
        }
        if (!this.state.scoreTypeId) {
            message(translations(locale).err.select_score_type);
            valid = false;
        }
        if (valid) {
            const params = {
                submit: 1,
                class: this.state.classId,
                grade: this.state.gradeId,
                className: this.state.className,
                teacher: this.state.teacherId,
                shift: this.state.shiftId,
                scoreType: this.state.scoreTypeId,
                room: this.state.roomNumberId,
            };
            this.props.fetchClassEditSave(params);
            this.setState({
                fetchSave: true,
                showLoader: true,
            })
        }
    }
}

const mapStateProps = (state) => {
    return {
        locale: state.init.data && state.init.data.locale || 'mn',
        initLoading: state.classEdit.loading || false,
        initSuccess: state.classEdit.success || false,
        initMessage: state.classEdit.data ? state.classEdit.data.message : null,
        gradeList: state.classEdit.data ? state.classEdit.data.gradeList : [],
        teacherList: state.classEdit.data ? state.classEdit.data.teachers : [],
        schoolShift: state.classEdit.data ? state.classEdit.data.schoolShifts : [],
        scoreTypeList: state.classEdit.data ? state.classEdit.data.scoreTypes : [],
        rooms: state.classEdit.data ? state.classEdit.data.rooms : {},
        classInfo: state.classEdit.data ? state.classEdit.data.classData : {},
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        classEdit: (params) => {
            dispatch(actions.classEdit(params));
        },
        fetchClassEditSave: (params) => {
            dispatch(actions.fetchClassEditSave(params));
        },
    });
};

export default connect(mapStateProps, mapDispatchToProps)(withHook(edit, useLocation, 'location'))
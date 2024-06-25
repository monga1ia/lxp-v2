import * as actions from "Actions/action";

import { Link, Navigate } from 'react-router-dom'

import AddIcon from '@mui/icons-material/Add';
import { Dropdown } from "semantic-ui-react";
import React from 'react'
import _ from 'lodash';
import { connect } from 'react-redux';
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import secureLocalStorage from 'react-secure-storage';

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const AddClassModal = ({onClose, onSubmit, data}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)
    const [teacherList, setTeacherList] = useState([]),
    const [schoolShift, setSchoolShift] = useState(),
    const [scoreTypeList, setScoreTypeList] = useState([]),
    const [gradeList, setGradeList] = useState([]),
    const roomList = useState[],
}

class add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // locale: props.locale,
            teacherList: [],
            schoolShift: [],
            scoreTypeList: [],
            gradeList: [],
            roomList: [],
            rows: [{
                gradeId: null,
                className: '',
                teacherId: null,
                shiftId: null,
                scoreTypeId: null,
                roomId: null,
                // esisGroup: '',
                roomNumber: '',
            }],
            fetchSave: false,
            redirect: false,
        };
        this.wrapper = null;
    };

    componentDidMount = () => {
        this.setState({
            fetchInit: true,
            showLoader: true,
        });

        let params = {};
        this.props.newClassFieldOptions(params);
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
                this.addMsg(nextProps.initMessage);
            } else {
                this.setState({
                    fetchInit: false,
                    showLoader: false,
                    teacherList: nextProps.teacherList,
                    schoolShift: nextProps.schoolShift,
                    scoreTypeList: nextProps.scoreTypeList,
                    gradeList: nextProps.gradeList,
                    roomList: nextProps.roomList,
                })
            }
        }
        if (this.state.fetchSave && !nextProps.saveLoading) {
            if (nextProps.saveSuccess) {
                this.setState({
                    fetchSave: false,
                    showLoader: false,
                    rows: [{
                        gradeId: null,
                        className: '',
                        teacherId: null,
                        shiftId: null,
                        scoreTypeId: null,
                        // esisGroup: '',
                        roomNumber: '',
                        roomId: null,
                    }],
                    redirect: true,
                });
                this.addMsg(nextProps.saveMessage, true);
            } else {
                this.setState({
                    fetchSave: false,
                    showLoader: false,
                });
                this.addMsg(nextProps.saveMessage);
            }
        }
    };

    render = () => {
        return (
            <div ref={wrapper => this.wrapper = wrapper} className="m-grid__item m-grid__item--fluid m-wrapper">
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
                                        {/* <th style={{color: '#575962',fontSize: '12px'}} className='text-left pl-4'>
                                            {translations(locale).esis.class_id.toUpperCase() || null}
                                        </th> */}
                                        <th style={{ color: '#575962', fontSize: '12px' }} className='text-left pl-4'>
                                            {translations(locale).group.classroom.toUpperCase() || null}
                                        </th>
                                        <th width="40" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.rows.map((row, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <Dropdown
                                                            placeholder={'-' + translations(locale).select + '-' || ""}
                                                            fluid
                                                            selection
                                                            additionPosition='bottom'
                                                            upward={false}
                                                            closeOnChange
                                                            selectOnBlur={false}
                                                            value={row.gradeId}
                                                            options={this.state.gradeList}
                                                            onChange={(e, data) => this._gradeChange(data, i)}
                                                            onOpen={(e, data) => this._dropdownOpen(data.options.length, i)}
                                                            onClose={(e, data) => this._dropdownClose(data.options.length, i)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control newClassTableInput"
                                                            value={row.className}
                                                            onChange={(e) => this._classNameChange(e, i)}
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
                                                            value={row.teacherId}
                                                            onChange={(e, data) => this._teacherChange(data, i)}
                                                            onOpen={(e, data) => this._dropdownOpen(data.options.length, i)}
                                                            onClose={(e, data) => this._dropdownClose(data.options.length, i)}
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
                                                            value={row.shiftId}
                                                            onChange={(e, data) => this._schoolShiftChange(data, i)}
                                                            onOpen={(e, data) => this._dropdownOpen(data.options.length, i)}
                                                            onClose={(e, data) => this._dropdownClose(data.options.length, i)}
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
                                                            value={row.scoreTypeId}
                                                            options={this.state.scoreTypeList}
                                                            onChange={(e, data) => this._scoreTypeChange(data, i)}
                                                            onOpen={(e, data) => this._dropdownOpen(data.options.length, i)}
                                                            onClose={(e, data) => this._dropdownClose(data.options.length, i)}
                                                        />
                                                    </td>
                                                    {/* <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={row.esisGroup}
                                                        onChange={(e) => this._onEsisGroupChange(e, i)}
                                                    />
                                                </td> */}
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
                                                            value={row.roomId}
                                                            options={this.state.roomList}
                                                            onChange={(e, data) => this._roomChange(data, i)}
                                                            onOpen={(e, data) => this._dropdownOpen(data.options.length, i)}
                                                            onClose={(e, data) => this._dropdownClose(data.options.length, i)}
                                                        />
                                                    </td>
                                                    <td>
                                                        {
                                                            i > 0
                                                                ? <button onClick={() => this._removeRow(i)}
                                                                    className="btn btn-danger m-btn m-btn--icon m-btn--icon-only m-btn--pill">
                                                                    <i className="la la-remove" />
                                                                </button>
                                                                : null
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    <tr>
                                        <td className="no-border" colSpan={6} />
                                        <td>
                                            <button
                                                onClick={this._addRow}
                                                className="btn btn-outline-info m-btn m-btn--icon m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center"
                                            >
                                                <AddIcon />
                                            </button>
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
                                onClick={this._createNewClass}
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
                    <Navigate to={'/school/classes'} replace={true} />
                }
            </div>
        )
    };

    _addRow = () => {
        let rows = _.cloneDeep(this.state.rows);
        rows.push({
            gradeId: null,
            className: '',
            teacherId: null,
            shiftId: null,
            scoreTypeId: null,
            roomNumber: '',
            // esisGroup: ''
        });
        this.setState({
            rows,
        })
    }

    _removeRow(index) {
        let { rows } = this.state;
        rows.splice(index, 1);
        this.setState({
            rows,
        })
    }

    _gradeChange(data, index) {
        let rows = _.cloneDeep(this.state.rows);
        rows[index].gradeId = data.value;
        this.setState({
            rows,
        })
    }

    _classNameChange(e, index) {
        let rows = _.cloneDeep(this.state.rows);
        rows[index].className = e.target.value;
        this.setState({
            rows,
        })
    }

    _teacherChange(data, index) {
        let rows = _.cloneDeep(this.state.rows);
        rows[index].teacherId = data.value;
        this.setState({
            rows,
        })
    }

    _schoolShiftChange(data, index) {
        let rows = _.cloneDeep(this.state.rows);
        rows[index].shiftId = data.value;
        this.setState({
            rows,
        })
    }

    _scoreTypeChange(data, index) {
        let rows = _.cloneDeep(this.state.rows);
        rows[index].scoreTypeId = data.value;
        this.setState({
            rows,
        })
    }

    _roomChange(data, index) {
        let rows = _.cloneDeep(this.state.rows);
        rows[index].roomId = data.value;
        this.setState({
            rows,
        })
    }

    _classRoomChange(e, index) {
        let rows = _.cloneDeep(this.state.rows);
        rows[index].roomNumber = e.target.value;
        this.setState({
            rows,
        })
    }

    // _onEsisGroupChange = (e, index) => {
    //     let rows = _.cloneDeep(this.state.rows);
    //     rows[index].esisGroup = e.target.value;
    //     this.setState({
    //         rows,
    //     })
    // };

    addMsg = (message, success) => {
        if (message) {
            if (success) {
                toast.success(message, {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error(message, {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    }

    _createNewClass = () => {
        let valid = true;
        this.state.rows.forEach(row => {
            if (!row.gradeId) {
                this.addMsg(translations(locale).err.select_class);
                valid = false;
            }
            if (!row.className) {
                this.addMsg(translations(locale).err.insert_grade_name);
                valid = false;
            }
            // if (!row.teacherId) {
            //     this.addMsg(translations(locale).err.select_teacher);
            //     valid = false;
            // }
            if (!row.shiftId) {
                this.addMsg(translations(locale).err.select_school_shift);
                valid = false;
            }
            if (!row.scoreTypeId) {
                this.addMsg(translations(locale).err.select_score_type);
                valid = false;
            }
            // if (!row.roomId) {
            //     this.addMsg(translations(locale).err.select_room);
            //     valid = false;
            // }
        })
        if (valid) {
            const params = {
                classes: JSON.stringify(this.state.rows),
                submit: 1,
            }
            this.props.fetchClassSave(params);
            this.setState({
                fetchSave: true,
                showLoader: true,
            })
        }
    }

    _dropdownOpen(datas, index) {
        if (index + 1 === this.state.rows.length && datas > 6 && window.outerWidth > 1919) {
            this.wrapper.style.marginBottom = '80px';
        } else if (index + 2 === this.state.rows.length && datas > 7 && window.outerWidth > 1919) {
            this.wrapper.style.marginBottom = '35px';
        }
    }

    _dropdownClose() {
        if (this.wrapper)
            this.wrapper.style.marginBottom = '1rem';
    }
}

const mapStateProps = (state) => {
    return {
        locale: state.init.data && state.init.data.locale || 'mn',
        initLoading: state.newClassFieldOptions.loading || false,
        initSuccess: state.newClassFieldOptions.success || false,
        initMessage: state.newClassFieldOptions.data ? state.newClassFieldOptions.data.message : null,
        teacherList: state.newClassFieldOptions.data ? state.newClassFieldOptions.data.teachers : null,
        schoolShift: state.newClassFieldOptions.data ? state.newClassFieldOptions.data.schoolShifts : null,
        scoreTypeList: state.newClassFieldOptions.data ? state.newClassFieldOptions.data.scoreTypes : null,
        gradeList: state.newClassFieldOptions.data ? state.newClassFieldOptions.data.gradeList : null,
        roomList: state.newClassFieldOptions.data ? state.newClassFieldOptions.data.rooms : null,

        saveLoading: state.saveClass.loading || false,
        saveSuccess: state.saveClass.success || false,
        saveMessage: state.saveClass.data ? state.saveClass.data.message : null,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        newClassFieldOptions: (params) => {
            dispatch(actions.newClassFieldOptions(params));
        },
        fetchClassSave: (params) => {
            dispatch(actions.fetchClassSave(params));
        },
    });
};

export default connect(mapStateProps, mapDispatchToProps)(add)
import React from 'react'
import { connect } from 'react-redux';
import { translations } from "utils/translations";
import * as actions from "Actions/action";
import { Checkbox, Container, Dropdown, Modal, Tab } from 'semantic-ui-react';
// import SubHeader from "Src/SubHeader";
import { toast } from "react-toastify";
import TreeView from 'widgets/TreeView2'
import DataTable from 'modules/DataTable/DTable'

class NewsfeedConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locale: props.locale,

            fetchInit: false,
            showLoader: false,

            treeData: [],
            selectedTreeId: null,
            tabs: [],
            selectedUserType: 'school',
            selectedUserTypeIndex: 0,
            datas: [],

            showCreateHdrModal: false,
            newHdrName: '',
            allHeaders: [],
            headerTypes: [],
            isAdminOrSuper: false,
            newHdrSelectedParent: null,
            newSelectedHeaderType: null,
            schoolRoles: [],
            selectedSchoolRoles: [],
            newHdrErrorMessage: null,

            fetchAddHdr: false,
            addHdrLoading: false,

            showCreateRecipientModal: false,
            fetchRecipientsInit: false,
            fetchRecipientsLoading: false,

            recipientList: [],

            fetchAddRecipient: false,
            addRecipientLoading: false,
            isRecipientAll: false,

            showRecipientDeleteModal: false,
            newRecipientFilter: '',
            deleteSelectedConfigId: null,

            fetchDeleteRecipient: false,
            deleteRecipientLoading: false,

            fetchViewHdr: false,
            showViewHdrModal: false,
            viewHdrData: null,

            hdrDeleteModal: false,
            selectedDeleteHdr: null,
            fetchDeleteHdr: false,

            fetchEditHdr: false,
            showEditHdrModal: false,
            selectedEditHdr: null,

            fetchUpdateRepicients: false,
        };

    }

    updateDtColumns = (locale) => {
        this.dtColumns = [
            {
                key: "name",
                text: translations(locale).name || "",
                width: 150,
                sort: true,
            },
            {
                key: "role",
                text: translations(locale).role || "",
                width: 150,
                sort: true,
            },
            {
                key: "isAll",
                text: translations(locale).newsfeedConfig.canSeeAllPost || "",
                width: 50,
                sort: true,
            },
            {
                key: "action",
                text: "",
                width: 50,
            }
        ];
    }

    componentDidMount = () => {
        this.updateTabs(this.state.locale)
        this.fetchInit({})

        this.updateDtColumns(this.state.locale);
    };

    updateTabs = (locale) => {
        let userTypes = [{
            code: 'school',
            title: translations(locale).newsfeedConfig.fromSchool
        },
        {
            code: 'parents',
            title: translations(locale).newsfeedConfig.parents
        },
        {
            code: 'students',
            title: translations(locale).newsfeedConfig.students
        }]
        this.setState({
            tabs: userTypes
        })
    }

    fetchInit = (params) => {
        this.setState({
            fetchInit: true,
            showLoader: true
        })

        this.props.fetchInit(params)
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.state.locale !== nextProps.locale) {
            this.updateTabs(nextProps.locale)
            this.setState({
                locale: nextProps.locale
            });

            this.updateDtColumns(nextProps.locale)
        }
        if (this.state.fetchInit && !nextProps.loading) {
            if (nextProps.success) {

                if (nextProps.initData?.selectedHdrId) {

                    let listDatas = nextProps.initData?.list;
                    if (listDatas && listDatas.length > 0) {
                        for (let i = 0; i < listDatas.length; i++) {
                            let dataObj = listDatas[i];

                            dataObj['clickable'] = true;
                            dataObj['action'] = `<button class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill"><i class="la la-remove"/></button>`;
                            dataObj['isChecked'] = dataObj.isAll ? "1" : "0";
                        }
                    }

                    this.setState({
                        fetchInit: false,
                        showLoader: false,
                        datas: listDatas
                    })
                } else {
                    this.setState({
                        fetchInit: false,
                        showLoader: false,
                        treeData: nextProps.initData?.hdrs,
                        schoolRoles: nextProps.initData?.roles,
                        allHeaders: nextProps.initData?.flatHeaders,
                        headerTypes: nextProps.initData?.hdrTypes,
                        isAdminOrSuper: nextProps.initData?.isAdminOrSuper,
                        datas: []
                    })
                }

            } else {
                // init failed
                this.setState({
                    fetchInit: false,
                    showLoader: false,
                    headers: null,
                    datas: []
                })
            }
        }
        if (this.state.fetchViewHdr && !nextProps.viewHdrLoading) {
            if (nextProps.viewHdrSuccess) {
                if (this.state.selectedEditHdr) {
                    let selectedEditHdr = this.state.selectedEditHdr;
                    selectedEditHdr['roles'] = nextProps.viewHdrData?.roles;
                    selectedEditHdr['typeId'] = nextProps.viewHdrData?.hdrTypeId;
                    this.setState({
                        fetchViewHdr: false,
                        selectedEditHdr
                    })
                } else {
                    this.setState({
                        fetchViewHdr: false,
                        viewHdrData: nextProps.viewHdrData
                    })
                }
            } else {
                this.setState({
                    fetchViewHdr: false,
                    showViewHdrModal: false,
                    viewHdrData: null
                });

                toast.error(nextProps.viewHdrData?.message, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
        if (this.state.fetchAddHdr && !nextProps.addHdrLoading) {
            if (nextProps.hdrAddSuccess) {
                this.setState({
                    fetchAddHdr: false,
                    addHdrLoading: false,
                    treeData: nextProps.hdrAddData?.hdrs,
                    allHeaders: nextProps.hdrAddData?.flatHeaders
                })
                toast.success(nextProps.hdrAddMessage, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                this.closeModal()
            } else {
                // show error message

                toast.error(nextProps.hdrAddMessage, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                this.setState({
                    fetchAddHdr: false,
                    addHdrLoading: false,
                })
            }
        }
        if (this.state.fetchEditHdr && !nextProps.editHdrLoading) {
            if (nextProps.editHdrSuccess) {
                toast.success(nextProps.editHdrData?.message, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                this.closeEditModal()

                this.setState({
                    fetchEditHdr: false,
                    treeData: nextProps.editHdrData?.hdrs,
                    allHeaders: nextProps.editHdrData?.flatHeaders,
                })
            } else {
                toast.error(nextProps.editHdrData?.message, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                this.setState({
                    fetchEditHdr: false
                })
            }
        }
        if (this.state.fetchDeleteHdr && !nextProps.deleteHdrLoading) {
            if (nextProps.deleteHdrSuccess) {
                toast.success(nextProps.deleteHdrData?.message, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                this.setState({
                    selectedDeleteHdr: null,
                    fetchDeleteHdr: false,
                    hdrDeleteModal: false,
                    treeData: nextProps.deleteHdrData?.hdrs,
                    allHeaders: nextProps.deleteHdrData?.flatHeaders,
                })
            } else {
                toast.error(nextProps.deleteHdrData?.message, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                this.setState({
                    fetchDeleteHdr: false,
                })
            }
        }
        if (this.state.fetchRecipientsInit && !nextProps.newsfeedRecipientsLoading) {
            if (nextProps.newsfeedRecipientsSuccess) {
                this.setState({
                    fetchRecipientsInit: false,
                    fetchRecipientsLoading: false,
                    recipientList: nextProps.newsfeedRecipientsData?.users
                })
            } else {
                // error
                this.setState({
                    fetchRecipientsInit: false,
                    fetchRecipientsLoading: false
                })
            }
        }
        if (this.state.fetchAddRecipient && !nextProps.addRecipientsLoading) {
            if (nextProps.addRecipientsSuccess) {

                let listDatas = nextProps.addRecipientsData?.list;
                if (listDatas && listDatas.length > 0) {
                    for (let i = 0; i < listDatas.length; i++) {
                        let dataObj = listDatas[i];

                        dataObj['clickable'] = true;
                        dataObj['action'] = `<button class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill"><i class="la la-remove"/></button>`;
                        dataObj['isChecked'] = dataObj.isAll ? "1" : "0";
                    }
                }

                this.closeRecipientModal()

                this.setState({
                    fetchAddRecipient: false,
                    addRecipientLoading: false,
                    datas: listDatas
                })
            } else {
                this.setState({
                    fetchAddRecipient: false,
                    addRecipientLoading: false
                })

                toast.error(nextProps.addRecipientsData?.message, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
        if (this.state.fetchDeleteRecipient && !nextProps.removeRecipientsLoading) {
            if (nextProps.removeRecipientsSuccess) {
                let listDatas = nextProps.removeRecipientsData?.list;
                if (listDatas && listDatas.length > 0) {
                    for (let i = 0; i < listDatas.length; i++) {
                        let dataObj = listDatas[i];

                        dataObj['clickable'] = true;
                        dataObj['action'] = `<button class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill"><i class="la la-remove"/></button>`;
                        dataObj['isChecked'] = dataObj.isAll ? "1" : "0";
                    }
                }

                this.setState({
                    fetchDeleteRecipient: false,
                    deleteRecipientLoading: false,
                    datas: listDatas
                })

                this.closeRecipientDeleteModal()
            } else {
                this.setState({
                    fetchDeleteRecipient: false,
                    deleteRecipientLoading: false
                })

                toast.error(nextProps.removeRecipientsData?.message, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
        if (this.state.fetchUpdateRepicients && !nextProps.updateRecipientsLoading) {
            if (nextProps.updateRecipientsSuccess) {
                this.setState({
                    fetchUpdateRepicients: false
                })
            } else {
                this.setState({
                    fetchUpdateRepicients: false
                })

                toast.error(nextProps.updateRecipientsData?.message, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    };

    _onTdClick = (colKey, configId) => {
        if (colKey === 'action' && configId) {
            this.setState({
                deleteSelectedConfigId: configId,
                showRecipientDeleteModal: true
            })
        }
    }

    _onImgError(ev) {
        ev.target.src = '/images/placeholder.jpg';
    }

    renderTabContent = (userType) => {
        return (
            <Tab.Pane style={{ border: 0 }}>
                {
                    this.state.selectedTreeId && this.state.selectedTreeId.length > 0 &&
                    <div style={{ marginBottom: 15 }}>
                        <button type="button"
                            className={"btn m-btn--pill m-btn--air btn-info m-btn"}
                            onClick={() => {
                                this.setState({
                                    showCreateRecipientModal: true,
                                    fetchRecipientsInit: true
                                })
                                let userTypeCode = this.state.tabs.length > this.state.selectedUserTypeIndex
                                    ? this.state.tabs[this.state.selectedUserTypeIndex].code : null;
                                let params = {
                                    selectedHdr: this.state.selectedTreeId[0],
                                    userType: userTypeCode
                                }

                                this.props.fetchNewsfeedConfigRecipients(params)
                            }}>
                            <span>{translations(this.state.locale).newsfeedConfig.addRecipient || null}</span>
                        </button>
                    </div>
                }

                <DataTable
                    className="table table-bordered"
                    config={this.dtConfig}
                    records={this.state.datas}
                    columns={this.dtColumns}
                    locale={this.state.locale}
                    tdClick={this._onTdClick}
                    checkBoxOnChange={this._onCheckboxChange}
                />

            </Tab.Pane>
        )
    }

    _onCheckboxChange = (isChecked, id) => {

        let users = this.state.datas;
        let bodyParams = null;
        for (let i = 0; i < users.length; i++) {
            let dataObj = users[i]

            if (dataObj.id === id) {
                dataObj.isChecked = isChecked ? "1" : "0";
                dataObj.isAll = isChecked;
                dataObj.loading = true;

                bodyParams = {};
                bodyParams['id'] = id;
                bodyParams['isAll'] = isChecked;
                break;
            }
        }

        if (bodyParams && this.state.selectedTreeId && this.state.selectedTreeId.length > 0) {
            bodyParams['selectedHdr'] = this.state.selectedTreeId[0]
            this.setState({
                fetchUpdateRepicients: true,
                datas: users
            })
            this.props.fetchNewsfeedConfigUpdateRecipients(bodyParams)
        }
    }

    _onTabChange = (e, data) => {

        if (this.state.selectedTreeId && this.state.selectedTreeId.length > 0) {
            let userTypeCode = this.state.tabs.length > data.activeIndex
                ? this.state.tabs[data.activeIndex].code : null;

            this.setState({
                selectedUserTypeIndex: data.activeIndex,
                fetchInit: true,
                showLoader: true
            })

            let params = {
                userType: userTypeCode,
                selectedHdr: this.state.selectedTreeId[0]
            }

            this.props.fetchInit(params)

        } else {

            this.setState({
                selectedUserTypeIndex: data.activeIndex
            })
        }

    }

    _treeContextMenuClick = (id, key) => {
        if (id, key) {
            if (key === 'CREATE') {
                this.setState({
                    showCreateHdrModal: true,
                    newHdrSelectedParent: id
                })
            } else if (key === 'EDIT') {
                let selectedEditHdr = this.state.allHeaders.find(hdr => hdr.value === id);
                if (selectedEditHdr) {
                    this.setState({
                        showModalLoader: true,
                        showEditHdrModal: true,
                        fetchViewHdr: true,
                        selectedEditHdr
                    })

                    let params = {
                        id: selectedEditHdr?.id
                    }
                    this.props.fetchNewsfeedConfigView(params)
                }
            } else if (key === 'DELETE') {
                let selectedDeleteHdr = this.state.allHeaders.find(hdr => hdr.value === id);
                if (selectedDeleteHdr && selectedDeleteHdr.delete === 1) {
                    this.setState({
                        hdrDeleteModal: true,
                        selectedDeleteHdr
                    })
                }
            } else if (key === 'VIEW') {
                this.setState({
                    fetchViewHdr: true,
                    showViewHdrModal: true
                })
                let params = {
                    id: id
                }
                this.props.fetchNewsfeedConfigView(params)
            }
        }
    }

    closeModal = () => {
        this.setState({
            showCreateHdrModal: false,
            newHdrSelectedParent: null,
            selectedSchoolRoles: [],
            newHdrName: '',
            newSelectedHeaderType: null
        })
    }

    closeEditModal = () => {
        this.setState({
            showEditHdrModal: false,
            selectedEditHdr: null,
            newSelectedHeaderType: null
        })
    }

    _submitEditHdr = () => {
        let editHdr = this.state.selectedEditHdr;
        if (editHdr) {
            if (!editHdr.roles || editHdr.roles.length === 0) {
                toast.error(translations(this.state.locale).newsfeedConfig.insertRolesError, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            } else {
                let bodyParams = {
                    id: editHdr.id,
                    name: editHdr.text,
                    type: editHdr.typeId,
                    parentHdr: editHdr.parent,
                    'roles[]': editHdr.roles
                }
                this.setState({
                    fetchEditHdr: true
                })
                this.props.fetchNewsfeedConfigEdit(bodyParams);
            }
        }
    }

    closeRecipientModal = () => {
        this.setState({
            showCreateRecipientModal: false,
            recipientList: []
        })
    }

    _submitNewHdr = () => {
        let hdrName = this.state.newHdrName;
        let isAdminOrSuper = this.state.isAdminOrSuper;
        let hdrType = this.state.newSelectedHeaderType;
        let parentHdrId = this.state.newHdrSelectedParent;
        let selectedRoleIds = this.state.selectedSchoolRoles;

        if (!hdrName) {
            toast.error(translations(this.state.locale).newsfeedConfig.insertNameError, {
                position: "top-right",
                autoClose: 8000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (isAdminOrSuper) {
            if (!hdrType) {
                toast.error(translations(this.state.locale).newsfeedConfig.insertHdrTypeError, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }
        }
        if (!parentHdrId) {
            toast.error(translations(this.state.locale).newsfeedConfig.insertParentHdrError, {
                position: "top-right",
                autoClose: 8000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (!selectedRoleIds || selectedRoleIds.length === 0) {
            toast.error(translations(this.state.locale).newsfeedConfig.insertRolesError, {
                position: "top-right",
                autoClose: 8000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        this.setState({
            fetchAddHdr: true,
            addHdrLoading: true
        })

        let bodyParams = {
            name: hdrName,
            parentHdr: parentHdrId,
            hdrType: hdrType,
            'roles[]': selectedRoleIds
        }

        this.props.fetchNewsfeedConfigAdd(bodyParams)
    }

    _onNewNfNameChange = (e) => {
        this.setState({
            newHdrName: e.target.value
        })
    }

    _onEditNfNameChange = (e) => {
        let selectedEditHdr = this.state.selectedEditHdr;
        selectedEditHdr['text'] = e.target.value;
        this.setState({
            selectedEditHdr
        })
    }

    _onHdrTypeChange = (e, data) => {
        this.setState({
            newSelectedHeaderType: data.value
        })
    }

    _onParentHdrChange = (e, data) => {
        this.setState({
            newHdrSelectedParent: data.value
        })
    }

    _onEditHdrTypeChange = (e, data) => {
        let selectedEditHdr = this.state.selectedEditHdr;
        selectedEditHdr['typeId'] = data.value;
        this.setState({
            selectedEditHdr
        })
    }

    _onEditParentHdrChange = (e, data) => {
        let selectedEditHdr = this.state.selectedEditHdr;
        selectedEditHdr['parent'] = data.value;
        this.setState({
            selectedEditHdr
        })
    }

    _onNewHdrRoleChange = (e, data) => {
        this.setState({
            selectedSchoolRoles: data.value
        })
    }

    _onEditHdrRoleChange = (e, data) => {
        let selectedEditHdr = this.state.selectedEditHdr;
        selectedEditHdr['roles'] = data.value;
        this.setState({
            selectedEditHdr
        })
    }

    onUserClick = (userId) => {
        let modalUsers = this.state.recipientList

        let selectedUser = modalUsers.find((user) => user.userId === userId)

        if (selectedUser) {
            if (selectedUser['checked']) {
                selectedUser['checked'] = false;
            } else {
                selectedUser['checked'] = true;
            }
        }
        this.setState({
            recipientList: modalUsers
        })
    }

    _onRecipientCheckChange = (userId, isChecked) => {
        let modalUsers = this.state.recipientList

        let selectedUser = modalUsers.find((user) => user.userId === userId)

        if (selectedUser) {
            if (selectedUser['checked']) {
                selectedUser['checked'] = false;
            } else {
                selectedUser['checked'] = true;
            }
        }
        this.setState({
            recipientList: modalUsers
        })
    }

    _onRecipientAllChange = (isChecked) => {

        let modalUsers = this.state.recipientList

        for (let i = 0; i < modalUsers.length; i++) {
            let selectedUser = modalUsers[i];
            selectedUser['checked'] = isChecked
        }

        this.setState({
            recipientList: modalUsers,
            isRecipientAll: isChecked
        })
    }

    _submitRecipients = () => {
        let modalUsers = this.state.recipientList;
        let selectedUserIds = [];
        for (let i = 0; i < modalUsers.length; i++) {
            let modalUser = modalUsers[i];
            if (modalUser.checked) {
                selectedUserIds.push(modalUser.userId);
            }
        }

        if (selectedUserIds.length > 0) {

            let userTypeCode = this.state.tabs.length > this.state.selectedUserTypeIndex
                ? this.state.tabs[this.state.selectedUserTypeIndex].code : null;

            let params = {
                selectedHdr: this.state.selectedTreeId[0],
                userType: userTypeCode,
                'users[]': selectedUserIds
            }

            this.props.fetchNewsfeedConfigAddRecipients(params)

            this.setState({
                fetchAddRecipient: true,
                addRecipientLoading: true
            })
        } else {
            toast.error(translations(this.state.locale).newsfeedConfig.selectHdrRecipient, {
                position: "top-right",
                autoClose: 8000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    closeRecipientDeleteModal = () => {
        this.setState({
            deleteSelectedConfigId: null,
            showRecipientDeleteModal: false
        })
    }

    _deleteRecipients = () => {
        if (this.state.deleteSelectedConfigId
            && this.state.selectedTreeId
            && this.state.selectedTreeId.length > 0) {
            this.setState({
                fetchDeleteRecipient: true,
                removeRecipientsLoading: true
            })

            let bodyParams = {
                selectedHdr: this.state.selectedTreeId[0],
                config: this.state.deleteSelectedConfigId,
                userType: this.state.tabs[this.state.selectedUserTypeIndex].code
            }
            this.props.fetchNewsfeedConfigRemoveRecipients(bodyParams)
        }
    }

    _deleteHdr = () => {
        if (this.state.selectedDeleteHdr) {
            let bodyParams = {
                hdr: this.state.selectedDeleteHdr?.id
            }
            this.setState({
                fetchDeleteHdr: true
            })
            this.props.fetchNewsfeedConfigDelete(bodyParams)
        }
    }

    closeViewHdrModal = () => {
        this.setState({
            showViewHdrModal: false,
            viewHdrData: null
        })
    }

    closeHdrDeleteModal = () => {
        this.setState({
            hdrDeleteModal: false,
            selectedDeleteHdr: null
        })
    }

    filterUsers = () => {
        let users = this.state.recipientList;
        if (this.state.newRecipientFilter && this.state.newRecipientFilter.length > 0) {
            let filtered = [];
            for (let i = 0; i < users.length; i++) {
                let userObj = users[i];
                if ((userObj.lastName && userObj.lastName.toLowerCase().includes(this.state.newRecipientFilter.toLowerCase()))
                    || (userObj.firstName && userObj.firstName.toLowerCase().includes(this.state.newRecipientFilter.toLowerCase()))
                    || (userObj.roles && userObj.roles.toLowerCase().includes(this.state.newRecipientFilter.toLowerCase()))
                ) {
                    filtered.push(userObj)
                }
            }
            users = filtered;
        }

        return users;
    }

    render = () => {
        let tabPanes = [];
        if (this.state.tabs && this.state.tabs.length > 0) {
            for (let i = 0; i < this.state.tabs.length; i++) {
                tabPanes.push({
                    menuItem: this.state.tabs[i].title,
                    render: () => this.renderTabContent(this.state.tabs[i].code)
                })
            }
        }
        let that = this;
        return (
            <div className="m-grid__item m-grid__item--fluid m-wrapper">
                <div className="m-content">

                    <div className='row'>

                        <div className='col-3 '>
                            <div className="m-portlet m-portlet--rounded">
                                <div className="m-portlet__body">
                                    <TreeView
                                        treeDatas={this.state.treeData}
                                        selectedNodes={this.state.selectedTreeId}
                                        onSelect={this._treeChange}
                                        defaultExpandAll={true}
                                        contextMenus={{
                                            nfActionNonDelete: [
                                                {
                                                    key: 'VIEW',
                                                    iconClassName: 'flaticon-file',
                                                    text: translations(this.state.locale).action.view || "",
                                                },
                                                {
                                                    key: 'CREATE',
                                                    iconClassName: 'flaticon-add',
                                                    text: translations(this.state.locale).add || "",
                                                },
                                                {
                                                    key: 'EDIT',
                                                    iconClassName: 'flaticon-edit',
                                                    text: translations(this.state.locale).action.edit || "",
                                                }
                                            ],
                                            nfAction: [
                                                {
                                                    key: 'VIEW',
                                                    iconClassName: 'flaticon-file',
                                                    text: translations(this.state.locale).action.view || "",
                                                },
                                                {
                                                    key: 'CREATE',
                                                    iconClassName: 'flaticon-add',
                                                    text: translations(this.state.locale).add || "",
                                                },
                                                {
                                                    key: 'EDIT',
                                                    iconClassName: 'flaticon-edit',
                                                    text: translations(this.state.locale).action.edit || "",
                                                },
                                                {
                                                    key: 'DELETE',
                                                    iconClassName: 'flaticon-delete-1',
                                                    text: translations(this.state.locale).action.delete || "",
                                                }
                                            ]
                                        }}
                                        onContextMenuClick={this._treeContextMenuClick}
                                    />
                                </div>
                            </div>

                            {/* <TreeView
                            locale={this.state.locale}
                            data={this.state.treeData}
                            onTreeChange={this._treeChange}
                        /> */}
                        </div>
                        <div className='col-9 '>
                            <div className="m-portlet m-portlet--rounded">
                                <div className="m-portlet__body">
                                    <Tab
                                        menu={{ secondary: true, pointing: true }}
                                        className="schoolSettingTabContainer"
                                        activeIndex={this.state.selectedUserTypeIndex}
                                        onTabChange={this._onTabChange}
                                        panes={tabPanes}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal
                        size={'small'}
                        dimmer={'blurring'}
                        open={this.state.showCreateHdrModal}
                        onClose={this.closeModal}
                        className="react-modal overflow-modal"
                    >
                        <div className="header">
                            {translations(this.state.locale).newsfeed.title}
                            <button type="button" className="close" onClick={this.closeModal}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="content" style={{ paddingBottom: 100 }}>
                            <div className="row form-group">
                                <div className="col-sm-12 col-md-4 text-right">
                                    {translations(this.state.locale).newsfeedConfig.hdrName}*
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <input type={"text"} className={"form-control"}
                                        value={this.state.newHdrName}
                                        placeholder={translations(this.state.locale).newsfeedConfig.hdrName}
                                        onChange={this._onNewNfNameChange} />
                                </div>
                            </div>
                            {
                                this.state.isAdminOrSuper
                                    ?
                                    <div className="row form-group">
                                        <div className="col-sm-12 col-md-4 text-right">
                                            {translations(this.state.locale).newsfeedConfig.parent_hdr_type}*
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <Dropdown
                                                placeholder={translations(this.state.locale).newsfeedConfig.parent_hdr_type}
                                                fluid
                                                search
                                                selection
                                                value={this.state.newSelectedHeaderType}
                                                options={this.state.headerTypes}
                                                onChange={this._onHdrTypeChange}
                                                closeOnChange
                                            />
                                        </div>
                                    </div>
                                    : null
                            }
                            <div className="row form-group">
                                <div className="col-sm-12 col-md-4 text-right">
                                    {translations(this.state.locale).newsfeedConfig.parent_hdr}*
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <Dropdown
                                        placeholder={translations(this.state.locale).newsfeedConfig.parent_hdr}
                                        fluid
                                        search
                                        selection
                                        value={this.state.newHdrSelectedParent}
                                        options={this.state.allHeaders}
                                        onChange={this._onParentHdrChange}
                                        closeOnChange
                                    />
                                </div>
                            </div>
                            <div className="row form-group">
                                <div className="col-sm-12 col-md-4 text-right">
                                    {translations(this.state.locale).newsfeedConfig.hdr_roles}*
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <Dropdown
                                        placeholder={translations(this.state.locale).newsfeedConfig.hdr_roles}
                                        fluid
                                        search
                                        selection
                                        multiple
                                        value={this.state.selectedSchoolRoles}
                                        onChange={this._onNewHdrRoleChange}
                                        options={this.state.schoolRoles}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="actions modal-footer">
                            <div className="row " style={{ width: '100%' }}>
                                <div className="col-12 text-center">
                                    <button
                                        className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                                        onClick={this.closeModal}
                                    >
                                        {translations(this.state.locale).close.toUpperCase()}
                                    </button>
                                    <button
                                        className="btn m-btn--pill m-btn--air btn-warning m-btn m-btn--custom"
                                        style={{ marginLeft: 10 }}
                                        onClick={this._submitNewHdr}
                                    >
                                        {translations(this.state.locale).save.toUpperCase()}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {
                            this.state.fetchAddHdr
                                ? <div>
                                    <div className="blockUI blockOverlay"> </div>
                                    <div className="blockUI blockMsg blockPage">
                                        <div className="m-loader m-loader--brand m-loader--lg"> </div>
                                    </div>
                                </div>
                                : null
                        }
                    </Modal>

                    <Modal
                        size={'small'}
                        dimmer={'blurring'}
                        open={this.state.showEditHdrModal}
                        onClose={this.closeEditModal}
                        className="react-modal overflow-modal"
                    >
                        <div className="header">
                            {translations(this.state.locale).newsfeed.title}
                            <button type="button" className="close" onClick={this.closeEditModal}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="content" style={{ paddingBottom: 100 }}>
                            <div className="row form-group">
                                <div className="col-sm-12 col-md-4 text-right">
                                    {translations(this.state.locale).newsfeedConfig.hdrName}*
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <input type={"text"} className={"form-control"}
                                        value={this.state.selectedEditHdr?.text}
                                        placeholder={translations(this.state.locale).newsfeedConfig.hdrName}
                                        onChange={this._onEditNfNameChange} />
                                </div>
                            </div>
                            {
                                this.state.isAdminOrSuper
                                    ?
                                    <div className="row form-group">
                                        <div className="col-sm-12 col-md-4 text-right">
                                            {translations(this.state.locale).newsfeedConfig.parent_hdr_type}*
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <Dropdown
                                                placeholder={translations(this.state.locale).newsfeedConfig.parent_hdr_type}
                                                fluid
                                                search
                                                selection
                                                value={this.state.selectedEditHdr?.typeId}
                                                options={this.state.headerTypes}
                                                onChange={this._onEditHdrTypeChange}
                                                closeOnChange
                                            />
                                        </div>
                                    </div>
                                    : null
                            }
                            <div className="row form-group">
                                <div className="col-sm-12 col-md-4 text-right">
                                    {translations(this.state.locale).newsfeedConfig.parent_hdr}*
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <Dropdown
                                        placeholder={translations(this.state.locale).newsfeedConfig.parent_hdr}
                                        fluid
                                        search
                                        selection
                                        value={this.state.selectedEditHdr?.parent}
                                        options={this.state.allHeaders}
                                        onChange={this._onEditParentHdrChange}
                                        closeOnChange
                                    />
                                </div>
                            </div>
                            <div className="row form-group">
                                <div className="col-sm-12 col-md-4 text-right">
                                    {translations(this.state.locale).newsfeedConfig.hdr_roles}*
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <Dropdown
                                        placeholder={translations(this.state.locale).newsfeedConfig.hdr_roles}
                                        fluid
                                        search
                                        selection
                                        multiple
                                        value={this.state.selectedEditHdr?.roles}
                                        onChange={this._onEditHdrRoleChange}
                                        options={this.state.schoolRoles}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="actions modal-footer">
                            <div className="row " style={{ width: '100%' }}>
                                <div className="col-12 text-center">
                                    <button
                                        className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                                        onClick={this.closeEditModal}
                                    >
                                        {translations(this.state.locale).close.toUpperCase()}
                                    </button>
                                    <button
                                        className="btn m-btn--pill m-btn--air btn-warning m-btn m-btn--custom"
                                        style={{ marginLeft: 10 }}
                                        onClick={this._submitEditHdr}
                                    >
                                        {translations(this.state.locale).action.edit.toUpperCase()}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {
                            this.state.fetchEditHdr || this.state.fetchViewHdr
                                ? <div>
                                    <div className="blockUI blockOverlay"> </div>
                                    <div className="blockUI blockMsg blockPage">
                                        <div className="m-loader m-loader--brand m-loader--lg"> </div>
                                    </div>
                                </div>
                                : null
                        }
                    </Modal>

                    <Modal
                        size={'small'}
                        dimmer={'blurring'}
                        open={this.state.showViewHdrModal}
                        onClose={this.closeViewHdrModal}
                        className="react-modal overflow-modal"
                    >
                        <div className="header">
                            {translations(this.state.locale).newsfeed.title}
                            <button type="button" className="close" onClick={this.closeViewHdrModal}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="content">
                            <div className="row form-group">
                                <div className="col-sm-12 col-md-4 text-right">
                                    {translations(this.state.locale).newsfeedConfig.hdrName}*
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <input type={"text"} className={"form-control"}
                                        value={this.state.viewHdrData?.hdrName}
                                        disabled={true}
                                        placeholder={translations(this.state.locale).newsfeedConfig.hdrName} />
                                </div>
                            </div>
                            <div className="row form-group">
                                <div className="col-sm-12 col-md-4 text-right">
                                    {translations(this.state.locale).newsfeedConfig.parent_hdr}*
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <input type={"text"} className={"form-control"}
                                        value={this.state.viewHdrData?.parentHdr || '-'}
                                        disabled={true}
                                        placeholder={translations(this.state.locale).newsfeedConfig.parent_hdr} />
                                </div>
                            </div>
                            <div className="row form-group">
                                <div className="col-sm-12 col-md-4 text-right">
                                    {translations(this.state.locale).newsfeedConfig.hdr_roles}*
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <input type={"text"} className={"form-control"}
                                        value={this.state.viewHdrData?.roleNames?.toString()}
                                        disabled={true}
                                        placeholder={translations(this.state.locale).newsfeedConfig.hdr_roles} />
                                </div>
                            </div>
                        </div>
                        <div className="actions modal-footer">
                            <div className="row " style={{ width: '100%' }}>
                                <div className="col-12 text-center">
                                    <button
                                        className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                                        onClick={this.closeViewHdrModal}
                                    >
                                        {translations(this.state.locale).close.toUpperCase()}
                                    </button>
                                    <button
                                        className="btn m-btn--pill m-btn--air btn-warning m-btn m-btn--custom"
                                        style={{ marginLeft: 10 }}
                                        onClick={() => {
                                            let selectedEditHdr = this.state.allHeaders.find(hdr => hdr.value === this.state.viewHdrData?.id);

                                            if (selectedEditHdr) {
                                                this.setState({
                                                    showEditHdrModal: true,
                                                    fetchViewHdr: true,
                                                    selectedEditHdr
                                                })

                                                let params = {
                                                    id: selectedEditHdr?.id
                                                }
                                                this.props.fetchNewsfeedConfigView(params)

                                                this.closeViewHdrModal()
                                            }
                                        }}
                                    >
                                        {translations(this.state.locale).action.edit.toUpperCase()}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {
                            this.state.fetchAddHdr
                                ? <div>
                                    <div className="blockUI blockOverlay"> </div>
                                    <div className="blockUI blockMsg blockPage">
                                        <div className="m-loader m-loader--brand m-loader--lg"> </div>
                                    </div>
                                </div>
                                : null
                        }
                    </Modal>

                    <Modal
                        size={'small'}
                        dimmer={'blurring'}
                        open={this.state.showCreateRecipientModal}
                        onClose={this.closeRecipientModal}
                        className="react-modal overflow-modal"
                        style={{ maxHeight: '90vh' }}
                    >
                        <div className="header">
                            {translations(this.state.locale).newsfeedConfig.addRecipient}
                            <button type="button" className="close" onClick={this.closeRecipientModal}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="content" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                            <div className="row form-group">
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className={"form-control"}
                                        value={this.state.newRecipientFilter}
                                        style={{
                                            maxWidth: 200,
                                            borderRadius: 40,
                                            margin: 'auto'
                                        }}
                                        onChange={(e) => {
                                            this.setState({
                                                newRecipientFilter: e.target.value
                                            })
                                        }} />
                                </div>
                            </div>
                            <div className="row form-group">
                                <div className="col-12 text-center">
                                    <Checkbox label={translations(this.state.locale).select_all}
                                        checked={this.state.isRecipientAll}
                                        onChange={(e, data) => that._onRecipientAllChange(data.checked)} />

                                </div>
                            </div>
                            <div className="row form-group">
                                {
                                    this.state.recipientList && this.filterUsers().map(function (user) {
                                        return <div className="col-md-6 col-xs-12"
                                            key={'user_' + user.userId}>

                                            <Container textAlign='center'
                                                style={{ display: 'inline-flex', marginBottom: 10 }}>

                                                <Checkbox label=''
                                                    checked={user.checked}
                                                    onChange={(e, data) => that._onRecipientCheckChange(user.userId, data.checked)} />

                                                <img className="m--img-rounded m--marginless m--img-centered"
                                                    onError={that._onImgError}
                                                    onClick={() => that.onUserClick(user.userId)}
                                                    width="45" height="45"
                                                    src={user.avatar || '/images/image_placeholder.jpg'} />

                                                <div
                                                    onClick={() => that.onUserClick(user.userId)}
                                                    style={{ cursor: 'pointer', marginLeft: 10, textAlign: 'left' }}>
                                                    <b>{user.firstName} {user.lastName}</b>
                                                    <br />
                                                    <span>{user.roles}</span>
                                                </div>
                                                {/* <div className={'row'} onClick={() => that.onUserClick(user.userId)}>
                                                    <b className={'col-12'}>{user.firstName} {user.lastName}</b>
                                                    <span className={'col-12'}>{user.roles}</span>
                                                </div> */}
                                            </Container>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <div className="actions modal-footer">
                            <div className="row " style={{ width: '100%' }}>
                                <div className="col-12 text-center">
                                    <button
                                        className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                                        onClick={this.closeRecipientModal}
                                    >
                                        {translations(this.state.locale).close.toUpperCase()}
                                    </button>
                                    <button
                                        className="btn m-btn--pill m-btn--air btn-warning m-btn m-btn--custom"
                                        style={{ marginLeft: 10 }}
                                        onClick={this._submitRecipients}
                                    >
                                        {translations(this.state.locale).save.toUpperCase()}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {
                            this.state.fetchRecipientsInit || this.state.addRecipientLoading
                                ? <div>
                                    <div className="blockUI blockOverlay"> </div>
                                    <div className="blockUI blockMsg blockPage">
                                        <div className="m-loader m-loader--brand m-loader--lg"> </div>
                                    </div>
                                </div>
                                : null
                        }
                    </Modal>

                    <Modal
                        size={'tiny'}
                        dimmer={'blurring'}
                        open={this.state.showRecipientDeleteModal}
                        onClose={this.closeRecipientDeleteModal}
                        className="react-modal overflow-modal"
                    >
                        <div className="header">
                            {translations(this.state.locale).action.delete}
                            <button type="button" className="close" onClick={this.closeRecipientDeleteModal}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="content">
                            <p>{translations(this.state.locale).newsfeedConfig.removeRecipient}</p>
                            {
                                this.state.tabs[this.state.selectedUserTypeIndex].code === 'parents' && <p>{translations(locale).newsfeedConfig.removeRecipientDescription}</p>
                            }
                            <span>{translations(this.state.locale).newsfeedConfig.removeRecipientDescription}</span>
                        </div>
                        <div className="actions modal-footer">
                            <div className="row " style={{ width: '100%' }}>
                                <div className="col-12 text-center">
                                    <button
                                        className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                                        onClick={this.closeRecipientDeleteModal}
                                    >
                                        {translations(this.state.locale).close.toUpperCase()}
                                    </button>
                                    <button
                                        className="btn m-btn--pill m-btn--air btn-warning m-btn m-btn--custom"
                                        style={{ marginLeft: 10 }}
                                        onClick={this._deleteRecipients}
                                    >
                                        {translations(this.state.locale).action.delete}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {
                            this.state.fetchDeleteRecipient
                                ? <div>
                                    <div className="blockUI blockOverlay"> </div>
                                    <div className="blockUI blockMsg blockPage">
                                        <div className="m-loader m-loader--brand m-loader--lg"> </div>
                                    </div>
                                </div>
                                : null
                        }
                    </Modal>

                    <Modal
                        size={'tiny'}
                        dimmer={'blurring'}
                        open={this.state.hdrDeleteModal}
                        onClose={this.closeHdrDeleteModal}
                        className="react-modal overflow-modal"
                    >
                        <div className="header">
                            {translations(this.state.locale).action.delete}
                            <button type="button" className="close" onClick={this.closeHdrDeleteModal}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="content">
                            <span>{translations(this.state.locale).newsfeedConfig.removeHdr}</span>
                        </div>
                        <div className="actions modal-footer">
                            <div className="row " style={{ width: '100%' }}>
                                <div className="col-12 text-center">
                                    <button
                                        className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                                        onClick={this.closeHdrDeleteModal}
                                    >
                                        {translations(this.state.locale).close.toUpperCase()}
                                    </button>
                                    <button
                                        className="btn m-btn--pill m-btn--air btn-warning m-btn m-btn--custom"
                                        style={{ marginLeft: 10 }}
                                        onClick={this._deleteHdr}
                                    >
                                        {translations(this.state.locale).action.delete}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {
                            this.state.fetchDeleteHdr
                                ? <div>
                                    <div className="blockUI blockOverlay"> </div>
                                    <div className="blockUI blockMsg blockPage">
                                        <div className="m-loader m-loader--brand m-loader--lg"> </div>
                                    </div>
                                </div>
                                : null
                        }
                    </Modal>

                    {
                        this.state.showLoader
                            ? <div>
                                <div className="blockUI blockOverlay"> </div>
                                <div className="blockUI blockMsg blockPage">
                                    <div className="m-loader m-loader--brand m-loader--lg"> </div>
                                </div>
                            </div>
                            : null
                    }
                </div>
            </div >
        );
    };

    _treeChange = idArray => {

        if (idArray && idArray.length > 0) {
            let id = idArray && idArray.length > 0 ? idArray[0] : null;

            let userTypeCode = this.state.tabs.length > this.state.selectedUserTypeIndex
                ? this.state.tabs[this.state.selectedUserTypeIndex].code : null;

            this.setState({
                fetchInit: true,
                showLoader: true,
                selectedTreeId: [id]
            })

            let params = {
                userType: userTypeCode,
                selectedHdr: id
            }

            this.props.fetchInit(params)

        }
    }

    _postHeaderIdChange = postHeaderIds => {
        this.setState({
            postHeaderIds,
        })
    }
}

const mapStateProps = (state) => {
    return {
        locale: state.init.data && state.init.data.locale || 'mn',

        loading: state.newsfeedConfig.loading || false,
        success: state.newsfeedConfig.success || false,
        initData: state.newsfeedConfig.data || null,

        hdrAddLoading: state.newsfeedConfigAdd.loading || false,
        hdrAddSuccess: state.newsfeedConfigAdd.success || false,
        hdrAddMessage: state.newsfeedConfigAdd.data?.message || null,
        hdrAddData: state.newsfeedConfigAdd.data || null,

        viewHdrLoading: state.newsfeedConfig.loading || false,
        viewHdrSuccess: state.newsfeedConfig.success || false,
        viewHdrData: state.newsfeedConfig.data || null,

        deleteHdrLoading: state.newsfeedConfig.loading || false,
        deleteHdrSuccess: state.newsfeedConfig.success || false,
        deleteHdrData: state.newsfeedConfig.data || null,

        editHdrLoading: state.newsfeedConfig.loading || false,
        editHdrSuccess: state.newsfeedConfig.success || false,
        editHdrData: state.newsfeedConfig.data || null,

        newsfeedRecipientsLoading: state.newsfeedConfigRecipients.loading || false,
        newsfeedRecipientsSuccess: state.newsfeedConfigRecipients.success || false,
        newsfeedRecipientsData: state.newsfeedConfigRecipients.data || null,

        addRecipientsLoading: state.newsfeedConfigAddRecipients.loading || false,
        addRecipientsSuccess: state.newsfeedConfigAddRecipients.success || false,
        addRecipientsData: state.newsfeedConfigAddRecipients.data || null,

        removeRecipientsLoading: state.newsfeedConfigRemoveRecipients.loading || false,
        removeRecipientsSuccess: state.newsfeedConfigRemoveRecipients.success || false,
        removeRecipientsData: state.newsfeedConfigRemoveRecipients.data || null,

        updateRecipientsLoading: state.newsfeedConfig.loading || false,
        updateRecipientsSuccess: state.newsfeedConfig.success || false,
        updateRecipientsData: state.newsfeedConfig.data || null,
    }
};

const mapDispatchToProps = (dispatch) => {
    return ({
        fetchInit: (params) => {
            dispatch(actions.fetchNewsfeedConfig(params));
        },
        fetchNewsfeedConfigView: (params) => {
            dispatch(actions.fetchNewsfeedConfigView(params));
        },
        fetchNewsfeedConfigAdd: (bodyParams) => {
            dispatch(actions.fetchNewsfeedConfigAdd(bodyParams));
        },
        fetchNewsfeedConfigEdit: (bodyParams) => {
            dispatch(actions.fetchNewsfeedConfigEdit(bodyParams));
        },
        fetchNewsfeedConfigDelete: (bodyParams) => {
            dispatch(actions.fetchNewsfeedConfigDelete(bodyParams));
        },
        fetchNewsfeedConfigRecipients: (params) => {
            dispatch(actions.fetchNewsfeedConfigRecipients(params));
        },
        fetchNewsfeedConfigAddRecipients: (bodyParams) => {
            dispatch(actions.fetchNewsfeedConfigAddRecipients(bodyParams));
        },
        fetchNewsfeedConfigRemoveRecipients: (bodyParams) => {
            dispatch(actions.fetchNewsfeedConfigRemoveRecipients(bodyParams));
        },
        fetchNewsfeedConfigUpdateRecipients: (bodyParams) => {
            dispatch(actions.fetchNewsfeedConfigUpdateRecipients(bodyParams));
        },
    });
};

export default connect(mapStateProps, mapDispatchToProps)(NewsfeedConfig)
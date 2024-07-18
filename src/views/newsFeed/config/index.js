import React, { useState } from 'react'
import { useEffect } from 'react'
import { Checkbox, Tab, Modal, Dropdown, Container } from 'semantic-ui-react'
import message from 'modules/message';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import DTable from 'modules/DataTable/DTable';
import TreeView from 'modules/TreeView';
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import DeleteModal from './modals/deleteModal';
import ViewHeader from './modals/viewHeaderModal';
import CreateHeader from './modals/createHeaderModal';
import { Row, Col } from 'react-bootstrap';
// import { NewsFeedConfigAddRecipients, NewsFeedConfigDeleteRecipient, NewsFeedConfigCreate, NewsFeedConfigDelete, NewsFeedConfigEdit, NewsFeedConfigInit, NewsFeedConfigRecipients, NewsFeedConfigView, NewsFeedConfigEditRecipient } from 'utils/url'
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { cloneDeep } from 'lodash'
import { useTranslation } from 'react-i18next';
import { width } from '@mui/system'

const localStorageSelectedTree = 'newsfeed_config_selected_hdr_id'
const localeSelectedTab = 'newsfeed_config_tab_index'
const localeSchoolTableState = 'newsfeed_config_school_table_index'
const localeParentTableState = 'newsfeed_config_parent_table_index'
const localeStudentTableState = 'newsfeed_config_student_table_index'

const index = () => {

    const { t } = useTranslation()

    const title = t('newsfeed.config')
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "newsfeed/config", text: title }
    ];

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState([
        {
            "id": 95789,
            "isAll": 1,
            "userId": 103432,
            "username": "89114141",
            "firstName": "Түвшинбат",
            "lastName": "Jet",
            "roles": "Багш"
        },
        {
            "id": 400714,
            "isAll": 1,
            "userId": 224039,
            "username": "88077004",
            "firstName": "Туяа",
            "lastName": "Энхболд",
            "roles": "Багш"
        },
        {
            "id": 95773,
            "isAll": 1,
            "userId": 1806,
            "username": "98100122",
            "firstName": "Тогооч",
            "lastName": "Тогооч",
            "roles": "Багш"
        },
        {
            "id": 349295,
            "isAll": 1,
            "userId": 185477,
            "username": "95957790",
            "firstName": "Тестийн би",
            "lastName": "Бямбаа",
            "roles": "Багш"
        },
        {
            "id": 364681,
            "isAll": 1,
            "userId": 176023,
            "username": "80384118",
            "firstName": "тест",
            "lastName": "тест ",
            "roles": "Багш,Багш"
        },
        {
            "id": 83916,
            "isAll": 1,
            "userId": 3,
            "username": "e_admin",
            "firstName": "Т",
            "lastName": "Б",
            "roles": "Сургуулийн админ,Санхүүч"
        },
        {
            "id": 466687,
            "isAll": 1,
            "userId": 320160,
            "username": "80000099",
            "firstName": "Сэтгэл зүйч",
            "lastName": "Тест",
            "roles": "Сэтгэл зүйч"
        },
        {
            "id": 401776,
            "isAll": 1,
            "userId": 225814,
            "username": "99999901",
            "firstName": "Сэлэнгэ",
            "lastName": "Туул",
            "roles": "Багш,Захирал"
        },
        {
            "id": 342485,
            "isAll": 1,
            "userId": 36475,
            "username": "99129124",
            "firstName": "Сонинбаяр",
            "lastName": "Энхбат",
            "roles": "Сургуулийн админ"
        },
        {
            "id": 394181,
            "isAll": 1,
            "userId": 218834,
            "username": "89371489",
            "firstName": "Солонго",
            "lastName": "Энхтайван",
            "roles": "Сургуулийн админ,Санхүүч,Сэтгэл зүйч,Эмч,Захирал"
        }
    ])
    const [selectedTree, setSelectedTree] = useState(secureLocalStorage.getItem(localStorageSelectedTree) ? secureLocalStorage.getItem(localStorageSelectedTree).key : null)
    const [treeData, setTreeData] = useState([        
    {
        key: "6",
        title: "Тестийн сургууль",
        school: 195,
        isSchool: true,
        value: 1232,
        class: null,
        isClass: false,
        group: null,
        isGroup: false,
        isFood: false,
        children: [
            {
                key: 'class',
                title: "Бүлэг",
                children: [
                    {
                        key: "12804",
                        title: "1A",
                        school: 195,
                        isSchool: false,
                        class: "12515",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12805",
                        title: "2A",
                        school: 195,
                        isSchool: false,
                        class: "12516",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12806",
                        title: "3A",
                        school: 195,
                        isSchool: false,
                        class: "12517",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12807",
                        title: "4A",
                        school: 195,
                        isSchool: false,
                        class: "12518",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12808",
                        title: "5A",
                        school: 195,
                        isSchool: false,
                        class: "12519",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12809",
                        title: "6A",
                        school: 195,
                        isSchool: false,
                        class: "12520",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12810",
                        title: "7A",
                        school: 195,
                        isSchool: false,
                        class: "12521",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12811",
                        title: "8A",
                        school: 195,
                        isSchool: false,
                        class: "12522",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12812",
                        title: "9A",
                        school: 195,
                        isSchool: false,
                        class: "12523",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12813",
                        title: "10A",
                        school: 195,
                        isSchool: false,
                        class: "12524",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12814",
                        title: "11A",
                        school: 195,
                        isSchool: false,
                        class: "12525",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12815",
                        title: "12A",
                        school: 195,
                        isSchool: false,
                        class: "12526",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "9364",
                        title: "Бэлтгэл А",
                        school: 195,
                        isSchool: false,
                        class: "8937",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: true,
                        children: []
                    }
                ]
            },
            {
                key: "other",
                title: "Бусад",
                children: [
                    {
                        key: "11889",
                        title: "1С",
                        school: 195,
                        isSchool: false,
                        class: null,
                        isClass: false,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "10125",
                        title: "8А",
                        school: 195,
                        isSchool: false,
                        class: null,
                        isClass: false,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "9806",
                        title: "Багш",
                        school: 195,
                        isSchool: false,
                        class: null,
                        isClass: false,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "3450",
                        title: "Багш - Тусламж",
                        school: 195,
                        isSchool: false,
                        class: null,
                        isClass: false,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "3453",
                        title: "Санхүү",
                        school: 195,
                        isSchool: false,
                        class: null,
                        isClass: false,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "10360",
                        title: "Удирдлага",
                        school: 195,
                        isSchool: false,
                        class: null,
                        isClass: false,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    }
                ]
            },
        ]}])
    const [filteredTreeData, setFilteredTreeData] = useState([{
        key: "6",
        title: "Тестийн сургууль",
        school: 195,
        isSchool: true,
        value: 1232,
        class: null,
        isClass: false,
        group: null,
        isGroup: false,
        isFood: false,
        children: [
            {
                key: 'class',
                title: "Бүлэг",
                children: [
                    {
                        key: "12804",
                        title: "1A",
                        school: 195,
                        isSchool: false,
                        class: "12515",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12805",
                        title: "2A",
                        school: 195,
                        isSchool: false,
                        class: "12516",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12806",
                        title: "3A",
                        school: 195,
                        isSchool: false,
                        class: "12517",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12807",
                        title: "4A",
                        school: 195,
                        isSchool: false,
                        class: "12518",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12808",
                        title: "5A",
                        school: 195,
                        isSchool: false,
                        class: "12519",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12809",
                        title: "6A",
                        school: 195,
                        isSchool: false,
                        class: "12520",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12810",
                        title: "7A",
                        school: 195,
                        isSchool: false,
                        class: "12521",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12811",
                        title: "8A",
                        school: 195,
                        isSchool: false,
                        class: "12522",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12812",
                        title: "9A",
                        school: 195,
                        isSchool: false,
                        class: "12523",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12813",
                        title: "10A",
                        school: 195,
                        isSchool: false,
                        class: "12524",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12814",
                        title: "11A",
                        school: 195,
                        isSchool: false,
                        class: "12525",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "12815",
                        title: "12A",
                        school: 195,
                        isSchool: false,
                        class: "12526",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "9364",
                        title: "Бэлтгэл А",
                        school: 195,
                        isSchool: false,
                        class: "8937",
                        isClass: true,
                        group: null,
                        isGroup: false,
                        isFood: true,
                        children: []
                    }
                ]
            },
            {
                key: "other",
                title: "Бусад",
                children: [
                    {
                        key: "11889",
                        title: "1С",
                        school: 195,
                        isSchool: false,
                        class: null,
                        isClass: false,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "10125",
                        title: "8А",
                        school: 195,
                        isSchool: false,
                        class: null,
                        isClass: false,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "9806",
                        title: "Багш",
                        school: 195,
                        isSchool: false,
                        class: null,
                        isClass: false,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "3450",
                        title: "Багш - Тусламж",
                        school: 195,
                        isSchool: false,
                        class: null,
                        isClass: false,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "3453",
                        title: "Санхүү",
                        school: 195,
                        isSchool: false,
                        class: null,
                        isClass: false,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    },
                    {
                        key: "10360",
                        title: "Удирдлага",
                        school: 195,
                        isSchool: false,
                        class: null,
                        isClass: false,
                        group: null,
                        isGroup: false,
                        isFood: false,
                        children: []
                    }
                ]
            },
        ]
}])
    const [selectedTab, setSelectedTab] = useState('school')
    const [treeKey, setTreeKey] = useState('')
    const [showViewHdrModal, setShowViewHdrModal] = useState(false)
    const [showCreateHdrModal, setShowCreateHdrModal] = useState(false)
    const [viewHdrData, setViewHdrData] = useState(null)

    const [newHdrSelectedParent, setNewHdrSelectedParent] = useState(null)
    const [selectedSchoolRoles, setSelectedSchoolRoles] = useState([])
    const [newHdrName, setNewHdrName] = useState('')
    const [newSelectedHeaderType, setNewSelectedHeaderType] = useState(null)
    const [isAdminOrSuper, setIsAdminOrSuper] = useState(null)
    const [schoolRoles, setSchoolRoles] = useState([])

    const [showEditHdrModal, setShowEditHdrModal] = useState(false)
    const [selectedEditHdr, setSelectedEditHdr] = useState(null)
    const [editSelectedHeaderType, setEditSelectedHeaderType] = useState(null)
    const [headerTypes, setHeaderTypes] = useState([])
    const [allHeaders, setAllHeaders] = useState([])

    const [showCreateRecipientModal, setShowCreateRecipientModal] = useState(false)
    const [hdrDeleteModal, setHdrDeleteModal] = useState(false)
    const [showRecipientDeleteModal, setShowRecipientDeleteModal] = useState(false)
    const [newRecipientFilter, setNewRecipientFilter] = useState('')
    const [isRecipientAll, setIsRecipientAll] = useState(false)
    const [recipientList, setRecipientList] = useState([])
    const [selectedDeleteHdr, setSelectedDeleteHdr] = useState(null)
    const [deleteSelectedHdrUserId, setDeleteSelectedHdrUserId] = useState(null)
    const [totalCount, setTotalCount] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [roleList, setRoleList] = useState([])
    const [selectedRoleId, setSelectedRoleId] = useState(null)
    const [oldRecipientList, setOldRecipientList] = useState([])

    const [selectedTabData, setSelectedTabData] = useState(secureLocalStorage.getItem(localeSelectedTab) ||
    {
        index: 0,
        menuItem: translations(locale)?.newsfeedConfig?.fromSchool,
        code: 'school',
    })

    const [tableState, setTableState] = useState(
        selectedTabData?.code == 'school'
        ? 
            secureLocalStorage.getItem(localeSchoolTableState)
            ?
                secureLocalStorage.getItem(localeSchoolTableState)
            :
                {
                    filter: {},
                    page: 1,
                    pageSize: 10,
                    search: '',
                    sort: 'firstName',
                    order: 'asc'
                }
        : 
        selectedTabData?.code == 'parent'
        ?
            secureLocalStorage.getItem(localeParentTableState)
        : 
        selectedTabData?.code == 'student'
        ?
            secureLocalStorage.getItem(localeStudentTableState)
        :   
            {
                filter: {},
                page: 1,
                pageSize: 10,
                search: '',
                sort: 'firstName',
                order: 'asc'
            }
    )

    const tabData = [
        {
            index: 0,
            menuItem: translations(locale)?.newsfeedConfig?.fromSchool,
            code: 'school',
        },
        {
            index: 1,
            menuItem: translations(locale)?.newsfeedConfig?.parents,
            code: 'parent',
        },
        {
            index: 2,
            menuItem: translations(locale)?.newsfeedConfig?.students,
            code: 'student',
        },
    ]

    const treeContextMenus = [
        {
            key: 'view',
            text: translations(locale).action.view || "",
            iconClassName: 'la la-file-text',
        },
        {
            key: 'create',
            text: translations(locale).add || "",
            iconClassName: 'la la-plus-square',
        },
        {
            key: 'edit',
            text: translations(locale)?.action?.edit,
            iconClassName: 'la la-edit',
        },
        {
            key: 'delete',
            text: translations(locale)?.action?.delete,
            iconClassName: 'la la-trash',
        }
    ]

    const config = {
        defaultSort: [{
            dataField: tableState?.sort || 'firstName',
            order: tableState?.order || 'asc'
        }],
        defaultPageOptions: {
            page: tableState?.page,
            sizePerPage: tableState?.pageSize,
            search: tableState?.search,
        }
    }

    const columns = [
        {
            dataField: 'firstName',
            text: translations(locale)?.name,
            sort: true,
        },
        {
            dataField: 'roles',
            text: translations(locale)?.role,
            sort: true,
        },
        {
            dataField: 'isAll',
            text: translations(locale)?.newsfeedConfig?.canSeeAllPost,
            headerStyle: { width: 200 },
            align: 'center',
            sort: true,
            formatter: (cell, row) => {
                return (
                    <Checkbox
                        className='ui checkbox'
                        onClick={(e, data) => handleIsAllClick(data, row)}
                        checked={!!cell}
                    />
                )
            }
        },
        {
            dataField: 'remove',
            text: '',
            headerStyle: { width: 50 },
            formatter: (cell, row) => {
                return (
                    <button
                        onClick={() => handleSubscribe(row.id)}
                        className="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center">
                        <CloseIcon sx={{ fontSize: '1.2rem' }} />
                    </button>
                )
            }
        },
    ]

    const recursiveHdr = (array) => {
        if(array && array.length > 0){
            for(let i = 0;  i < array.length; i++){
                if(array[i]['isClass']){
                    array[i]['contextMenuKeys'] = ['view', 'create','edit','delete']
                } else if(array[i]['isGroup']){
                    array[i]['contextMenuKeys'] = ['view', 'create','edit','delete']
                } else if(array[i]['isFood']){
                    array[i]['contextMenuKeys'] = ['view', 'create','edit','delete']
                } else if(array[i]['isClass'] == false){
                    array[i]['contextMenuKeys'] = ['view', 'create','edit','delete']
                }

                if(array[i].children && array[i].children.length > 0){
                    recursiveHdr(array[i].children)
                }
            }
        }
    }

    const init = (hdrId = null, pagination) => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(NewsFeedConfigInit, 'POST', { 
        //     selectedTab, 
        //     hdr: hdrId,
        //     order: pagination?.order,
        //     sort: pagination?.sort,
        //     page: pagination?.page,
        //     pageSize: pagination?.pageSize,
        //     search: pagination?.search,
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             let hdrList = res?.data?.hdrs;

        //             if(hdrList && hdrList.length > 0){
        //                 for(let i = 0; i < hdrList.length; i++){
        //                     if(hdrList[i].isSchool){
        //                         hdrList[i]['contextMenuKeys'] = ['view', 'create','edit']
        //                     }

        //                     if(hdrList[i].children && hdrList[i].children.length > 0){
        //                         recursiveHdr(hdrList[i].children)
        //                     }
        //                 }

        //                 if(!searchValue){
        //                     setTreeData(cloneDeep(hdrList))
        //                     setFilteredTreeData(hdrList)
        //                 }
        //             }
        //             setTableData(res?.data?.users);
        //             setTotalCount(res?.data?.totalCount || 0)
        //             if (res?.data?.selectedHdr) {
        //                 setSelectedTree(res?.data?.selectedHdr)
        //             }
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const onHdrView = (params) => {
        setShowViewHdrModal(true)
        // setLoading(true)
        // fetchRequest(NewsFeedConfigView, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const {hdrData} = res.data;
        //             setViewHdrData(hdrData || [])
        //             setShowViewHdrModal(true)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    } 

    const onHdrCreate = (params) => {
        // console.log('onHdrCreate')
        setShowCreateHdrModal(true)

        // setLoading(true)
        // fetchRequest(NewsFeedConfigCreate, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const {hdrData, roles, types, headers, isSuper, hdrs} = res.data;

        //             if(params.submit){
        //                 if(hdrs && hdrs.length > 0){
        //                     for(let i = 0; i < hdrs.length; i++){
        //                         if(hdrs[i].isSchool){
        //                             hdrs[i]['contextMenuKeys'] = ['view', 'create','edit']
        //                         }
    
        //                         if(hdrs[i].children && hdrs[i].children.length > 0){
        //                             recursiveHdr(hdrs[i].children) 
        //                         }
        //                     }
        //                     setTreeData(cloneDeep(hdrs))
        //                     setFilteredTreeData(hdrs)
        //                 }
        //                 closeModal()
        //             } else {
        //                 if(types && types.length > 0){
        //                     setNewSelectedHeaderType(types[0].value)
        //                 }
        //                 setIsAdminOrSuper(isSuper || false)
        //                 setSchoolRoles(roles || [])
        //                 setHeaderTypes(types || [])
        //                 setAllHeaders(headers)
        //                 setShowCreateHdrModal(true)
        //                 setNewHdrSelectedParent(params.id)
        //             }
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    } 

    const onHdrEdit = (params) => {
        console.log('onHdrEdit')
        // setLoading(true)
        // fetchRequest(NewsFeedConfigEdit, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const {hdrData, roles, types, headers, isSuper, hdrs} = res.data;

        //             if(params.submit){
        //                 if(hdrs && hdrs.length > 0){
        //                     for(let i = 0; i < hdrs.length; i++){
        //                         if(hdrs[i].isSchool){
        //                             hdrs[i]['contextMenuKeys'] = ['view','create','edit']
        //                         }
    
        //                         if(hdrs[i].children && hdrs[i].children.length > 0){
        //                             recursiveHdr(hdrs[i].children)
        //                         }
        //                     }
        //                     setTreeData(cloneDeep(hdrs))
        //                     setFilteredTreeData(hdrs)
        //                 }
        //                 closeEditModal()
        //             } else {
        //                 setSelectedEditHdr(hdrData || [])
        //                 setIsAdminOrSuper(isSuper || false)
        //                 setSchoolRoles(roles || [])
        //                 setHeaderTypes(types || [])

        //                 if(headers && headers.length > 0){
        //                     for(let i = 0; i < headers.length; i++){
        //                         if(params.hdr == headers[i].id){
        //                             headers.splice(index, 1)
        //                         }
        //                     }
        //                 }

        //                 setAllHeaders(headers)
        //                 setShowEditHdrModal(true)
        //             }
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    } 

    const onHdrDelete = (params) => {
        console.log('onHdrDelete')
        // setLoading(true)
        // fetchRequest(NewsFeedConfigDelete, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const {hdrs} = res.data;
        //             if(hdrs && hdrs.length > 0){
        //                 for(let i = 0; i < hdrs.length; i++){
        //                     if(hdrs[i].isSchool){
        //                         hdrs[i]['contextMenuKeys'] = ['view','create','edit']
        //                     }

        //                     if(hdrs[i].children && hdrs[i].children.length > 0){
        //                         recursiveHdr(hdrs[i].children)
        //                     }
        //                 }

        //                 setTreeData(cloneDeep(hdrs))
        //                 setFilteredTreeData(hdrs)
        //                 setTableData([]);
        //             }
        //             closeHdrDeleteModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const onHdrUser = (params) => {
        console.log('onHdrUser')
        // setLoading(true)
        // fetchRequest(NewsFeedConfigRecipients, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const {users, roles} = res.data;
        //             setRecipientList(users || [])
        //             setOldRecipientList(cloneDeep(users) || [])
        //             setRoleList(roles || [])
        //             if (roles && roles.length === 1) {
        //                 setSelectedRoleId(roles[0]?.value)
        //             }
        //             setShowCreateRecipientModal(true)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const onHdrUserSubmit = (params) => {
        console.log('hdrUserSubmit')
        // setLoading(true)
        // fetchRequest(NewsFeedConfigAddRecipients, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const {users, totalCount} = res.data;
        //             setTableData(users || [])
        //             setTotalCount(totalCount || 0)
        //             setShowCreateRecipientModal(false)
        //             message(res.data.message, true)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const onHdrUserDelete = (params) => {
        console.log('onHdrUserDelete')
        // setLoading(true)
        // fetchRequest(NewsFeedConfigDeleteRecipient, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             const {users, totalCount} = res.data;
        //             setTableData(users || [])
        //             setTotalCount(totalCount || 0)
        //             setShowRecipientDeleteModal(false)
        //             message(res.data.message, true)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    useEffect(() => {
        init(selectedTree, tableState)
    }, [selectedTab])

    const handleTabChange = data => {
        setSelectedTab(data?.panes[data?.activeIndex]?.code)

        let cloneData = {
            page: 1,
            pageSize: tableState.pageSize,
            search: tableState.search,
            sort: tableState.sort,
            order: tableState.order,
        };

        setTableState(cloneData)

        if (selectedTabData && selectedTabData.code == 'school'){
            secureLocalStorage.setItem(localeSchoolTableState, cloneData)
        } else if(selectedTabData && selectedTabData.code == 'parent') {
            secureLocalStorage.setItem(localeParentTableState, cloneData)
        } else if(selectedTabData && selectedTabData.code == 'student'){
            secureLocalStorage.setItem(localeStudentTableState, cloneData)
        }
        // init(selectedTree, cloneData)
    }

    const handleSubscribe = id => {
        setShowRecipientDeleteModal(true)
        setDeleteSelectedHdrUserId(id)
    }

    const handleIsAllClick = (data, row) => {
        console.log('handleIsAllClick')
        // setLoading(true)
        //     fetchRequest(NewsFeedConfigEditRecipient, 'POST', {
        //         hdr: selectedTree, 
        //         hdrUser: row.id, 
        //         selectedTab: selectedTab, 
        //         isAll: data.checked ? 1 : 0,
        //         order: tableState?.order,
        //         sort: tableState?.sort,
        //         page: tableState?.page,
        //         pageSize: tableState?.pageSize,
        //         search: tableState?.search,
        //     })
        //     .then((res) => {
        //         if (res.success) {
        //             const {users, totalCount} = res.data;
        //             setTableData(users || [])
        //             setTotalCount(totalCount || 0)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const onSelectHdr = (hdrId = null, event) => {
        if(hdrId.length){
            setSelectedTree(hdrId[0])

            let cloneData = {
                page: 1,
                pageSize: tableState.pageSize,
                search: tableState.search,
                sort: tableState.sort,
                order: tableState.order,
            };
    
            setTableState(cloneData)
    
            if (selectedTabData && selectedTabData.code == 'school'){
                secureLocalStorage.setItem(localeSchoolTableState, cloneData)
            } else if(selectedTabData && selectedTabData.code == 'parent') {
                secureLocalStorage.setItem(localeParentTableState, cloneData)
            } else if(selectedTabData && selectedTabData.code == 'student'){
                secureLocalStorage.setItem(localeStudentTableState, cloneData)
            }

            init(hdrId[0], cloneData)

            let treeData = {
                key: event.node.key,
                isSchool: event.node.isSchool
            }
            secureLocalStorage?.setItem(localStorageSelectedTree, treeData)
        }
    }

    const handleTreeContextMenuClick = (id, key) => {
        if (key === 'create') {
            let params = {
                id,
                submit: 0
            }

            onHdrCreate(params) 
        } else if (key === 'edit') {
            let params = {
                hdr: id,
                submit: 0
            }

            onHdrEdit(params)
        } else if (key === 'delete') {
            setHdrDeleteModal(true)
            setSelectedDeleteHdr(id)
        } else if (key === 'view') {
            let params = {
                hdr: id
            }

            onHdrView(params)
        }
    }

    const closeViewHdrModal = (isEdit = false) => {
        if(isEdit){
            if (viewHdrData) {
                let params = {
                    hdr: viewHdrData?.id
                }
                onHdrEdit(params)
            } 
        }
        setShowViewHdrModal(false)
    }

    const closeModal = () => {
        setShowCreateHdrModal(false)
        setNewHdrSelectedParent(null) 
        setSelectedSchoolRoles([])
        setNewHdrName('')
        setIsAdminOrSuper(null)
        setNewSelectedHeaderType(null) 
    }

    const _onNewNfNameChange = (e) => {
        setNewHdrName(e.target.value) 
    }

    const _onEditNfNameChange = (e) => {
        let cloneHdr = cloneDeep(selectedEditHdr);
        cloneHdr['name'] = e.target.value;
        setSelectedEditHdr(cloneHdr)
    }

    const _onHdrTypeChange = (e, data) => {
        setNewSelectedHeaderType(data.value) 
    }

    const _onParentHdrChange = (e, data) => {
        setNewHdrSelectedParent(data.value)
    }

    const _onEditHdrTypeChange = (e, data) => {
        let cloneHdr = cloneDeep(selectedEditHdr);
        cloneHdr['typeId'] = data.value;
        setSelectedEditHdr(cloneHdr)
    }

    const _onEditParentHdrChange = (e, data) => {
        let cloneHdr = cloneDeep(selectedEditHdr);
        cloneHdr['parentHdrId'] = data.value;
        setSelectedEditHdr(cloneHdr)
    }

    const _onNewHdrRoleChange = (e, data) => {
        setSelectedSchoolRoles(data.value)
    }

    const _onEditHdrRoleChange = (e, data) => {
        let cloneHdr = cloneDeep(selectedEditHdr);
        cloneHdr['roles'] = data.value;
        setSelectedEditHdr(cloneHdr)
    }

    const _submitNewHdr = () => {
        if (!newHdrName) {
            message(translations(locale).newsfeedConfig.insertNameError);
            return;
        }
        if (isAdminOrSuper) {
            if (!newSelectedHeaderType) {
                message(translations(locale).newsfeedConfig.insertHdrTypeError);
                return;
            }
        }
        if (!newHdrSelectedParent) {
            message(translations(locale).newsfeedConfig.insertParentHdrError);
            return;
        }
        if (!selectedSchoolRoles || selectedSchoolRoles.length === 0) {
            message(translations(locale).newsfeedConfig.insertRolesError);
            return;
        }

        let params = {
            name: newHdrName,
            parentHdr: newHdrSelectedParent,
            type: newSelectedHeaderType,
            roles: JSON.stringify(selectedSchoolRoles),
            submit: 1
        }

        onHdrCreate(params)
    }

    const closeEditModal = () => {
        setSelectedEditHdr([])
        setIsAdminOrSuper(false)
        setSchoolRoles([])
        setHeaderTypes([])
        setAllHeaders([])
        setShowEditHdrModal(false)
        setSelectedEditHdr(null)
    }

    const _submitEditHdr = () => {
        if (selectedEditHdr) {
            if (!selectedEditHdr.roles || selectedEditHdr.roles.length === 0) {
                message(translations(locale).newsfeedConfig.insertRolesError);
                return;
            } else {
                let bodyParams = {
                    hdr: selectedEditHdr.id,
                    name: selectedEditHdr.name,
                    type: selectedEditHdr.typeId,
                    parentHdr: selectedEditHdr.parentHdrId,
                    roles: JSON.stringify(selectedEditHdr.roles),
                    submit: 1
                }

                onHdrEdit(bodyParams)
            }
        }
    }

    const _submitRecipients = () => {
        let modalUsers = [...recipientList];
        let selectedUserIds = [];
        for (let i = 0; i < modalUsers.length; i++) {
            let modalUser = modalUsers[i];
            if (modalUser.checked) {
                selectedUserIds.push(modalUser.id);
            }
        }

        if (selectedUserIds.length > 0) {
            let params = {
                hdr: selectedTree,
                selectedTab: selectedTab,
                users: JSON.stringify(selectedUserIds),
                order: tableState?.order,
                sort: tableState?.sort,
                page: tableState?.page,
                pageSize: tableState?.pageSize,
                search: tableState?.search,
            }

            onHdrUserSubmit(params)
        } else {
            message(translations(locale).newsfeedConfig.selectHdrRecipient);
        }
    }

    const closeRecipientDeleteModal = () => {
        setDeleteSelectedHdrUserId(null) 
        setShowRecipientDeleteModal(false) 
    }

    const _deleteRecipients = () => {
        let params = {
            hdr: selectedTree,
            hdrUser: deleteSelectedHdrUserId,
            selectedTab: selectedTab,
            order: tableState?.order,
            sort: tableState?.sort,
            page: tableState?.page,
            pageSize: tableState?.pageSize,
            search: tableState?.search,
        }

        onHdrUserDelete(params)
    }

    const filterUsers = () => {
        let users = [...recipientList];
        if (newRecipientFilter && newRecipientFilter.length > 0) {
            let filtered = [];
            for (let i = 0; i < users.length; i++) {
                let userObj = users[i];
                if ((userObj.lastName && userObj.lastName.toLowerCase().includes(newRecipientFilter.toLowerCase()))
                    || (userObj.firstName && userObj.firstName.toLowerCase().includes(newRecipientFilter.toLowerCase()))
                    || (userObj.roles && userObj.roles.toLowerCase().includes(newRecipientFilter.toLowerCase()))
                ) {
                    filtered.push(userObj)
                }
            }
            users = filtered;
        }

        return users;
    }

    const _deleteHdr = () => {
        let params = {
            hdr: selectedDeleteHdr
        }
        
        onHdrDelete(params)
    }

    const closeRecipientModal = () => {
        setShowCreateRecipientModal(false)
        setRecipientList([]) 
    }

    const closeHdrDeleteModal = () => {
        setHdrDeleteModal(false)
        setSelectedDeleteHdr(null)
    }

    const addRecipient = () => {
        let params = {
            hdr: selectedTree,
            selectedTab: selectedTab
        }

        onHdrUser(params)
    }

    const onUserClick = (userId) => {
        let modalUsers = [...recipientList]

        let selectedUser = modalUsers.find((user) => user.id === userId)

        if (selectedUser) {
            if (selectedUser['checked']) {
                selectedUser['checked'] = false;
            } else {
                selectedUser['checked'] = true;
            }
        }

        setRecipientList(modalUsers) 
    }

    const _onRecipientAllChange = (isChecked) => {
        let modalUsers = [...recipientList]

        for (let i = 0; i < modalUsers.length; i++) {
            let selectedUser = modalUsers[i];
            selectedUser['checked'] = isChecked
        }

        setRecipientList(modalUsers)
        setIsRecipientAll(isChecked)
    }

    const onUserInteraction = state => {
        if(state.page){
            if(state.search != tableState.search){
                let cloneData = {
                    page: 1,
                    pageSize: state.pageSize,
                    search: state.search,
                    sort: state.sort,
                    order: state.order,
                };

                setTableState(cloneData)

                if (selectedTabData && selectedTabData.code == 'school'){
                    secureLocalStorage.setItem(localeSchoolTableState, cloneData)
                } else if(selectedTabData && selectedTabData.code == 'parent') {
                    secureLocalStorage.setItem(localeParentTableState, cloneData)
                } else if(selectedTabData && selectedTabData.code == 'student'){
                    secureLocalStorage.setItem(localeStudentTableState, cloneData)
                }

                init(selectedTree, cloneData)
            } else {
                setTableState(state)

                if (selectedTabData && selectedTabData.code == 'school'){
                    secureLocalStorage.setItem(localeSchoolTableState, state)
                } else if(selectedTabData && selectedTabData.code == 'parent') {
                    secureLocalStorage.setItem(localeParentTableState, state)
                } else if(selectedTabData && selectedTabData.code == 'student'){
                    secureLocalStorage.setItem(localeStudentTableState, state)
                }

                init(selectedTree, state)
            }
        } else {
        }
    }

    const handlerRole = (e, data) => {
        let userList = [];
        if(data.value){
            if(oldRecipientList && oldRecipientList.length > 0){
                for(let i = 0; i < oldRecipientList.length; i++){
                    console.log(oldRecipientList[i].roleIds.find(roleId => roleId == data.value))
                    if(oldRecipientList[i].roleIds.find(roleId => roleId == data.value)){
                        userList.push(oldRecipientList[i])
                    }
                }
            }

            setRecipientList(userList);
        } else {
            setRecipientList(oldRecipientList);
        }

        setSelectedRoleId(data.value) 
    }

    const handleSearch = (value) => {
        if(value){
            let cloneTreeData = cloneDeep(treeData);
            if(cloneTreeData && cloneTreeData.length > 0){
                for(let i = 0; i < cloneTreeData.length; i++){
                    for(let c = 0; c < cloneTreeData[i]['children'].length; c++){
                        let children = cloneTreeData[i].children[c].children
                        let result = children.filter(data => data?.title.toLowerCase()?.includes(value.toLowerCase()))

                        cloneTreeData[i].children[c].children = result
                    }
                }
            }

            setFilteredTreeData(cloneTreeData)
        } else {
            let cloneData = [...treeData]
            setFilteredTreeData(cloneDeep(cloneData))
        }

        setSearchValue(value)
    }

    return (
        <div className="m-grid__item m-grid__item--fluid m-wrapper">

            <HtmlHead title={title} description={description} />
            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>  
            <div className="m-content">
                <div className='row'>
                    <Col xl="3" xxl="2">
                        <input
                            className='mb-2'
                            style={{width: '100%', height: 35, padding: 15, border: '1px solid #ebedf2', borderRadius: 6}}
                            width='100%'
                            placeholder={translations(locale)?.search}
                            onChange={(e) => handleSearch(e.target.value)}
                            value={searchValue}
                        />
                        <div className="m-portlet br-12">
                            <div className="m-portlet__body">
                                <TreeView
                                    treeData={filteredTreeData}
                                    defaultExpandAll={true}
                                    selectedNodes={[selectedTree]}
                                    onSelect={onSelectHdr}
                                    contextMenuKey={'treeKey'}
                                    onContextMenuClick={handleTreeContextMenuClick}
                                    contextMenus={{ treeKey: treeContextMenus}}
                                    // individualContextMenus
                                    searchValue={searchValue}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xl="9" xxl="10">
                        <button
                            onClick={addRecipient}
                            className="btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3"
                        >
                            <AddCircleOutlineRoundedIcon />
                            <span className='ml-2'>{translations(locale)?.newsfeedConfig?.addRecipient || null}</span>
                        </button>
                        <div className="m-portlet br-12 tab">
                            <div className="m-portlet-header">
                                <Tab
                                    menu={{ secondary: true, pointing: true, className: 'primaryColor' }}
                                    className="no-shadow"
                                    onTabChange={(e, data) => handleTabChange(data)}
                                    panes={tabData}
                                />
                            </div>
                            <div className="m-portlet__body">
                                <Tab.Pane attached={false}>
                                    <DTable
                                        remote
                                        config={config}
                                        columns={columns}
                                        data={tableData}
                                        selectMode="radio"
                                        locale={locale}
                                        onInteraction={onUserInteraction}
                                        totalDataSize={totalCount}
                                    />
                                </Tab.Pane>
                            </div>
                        </div>
                    </Col>
                </div>
            </div>
            {
                showViewHdrModal && 
                <ViewHeader
                    onClose={() => closeViewHdrModal(false)}
                    viewHdrData = {viewHdrData}
                    onSubmit={() => closeViewHdrModal(true)}
                />
            }
            {/* <Modal
                size={'small'}
                dimmer={'blurring'}
                open={showViewHdrModal}
                onClose={() => closeViewHdrModal(false)}
                className="react-modal overflow-modal"
            >
                <div className="header">
                    {translations(locale).newsfeed.title}
                    <button type="button" className="close" onClick={() => closeViewHdrModal(false)}>
                        <CloseRoundedIcon />
                    </button>
                </div>
                <div className="content">
                    <div className="row form-group">
                        <div className="col-sm-12 col-md-4 text-right">
                            {translations(locale).newsfeedConfig.hdrName}*
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <input type={"text"} className={"form-control"}
                                value={viewHdrData?.name}
                                disabled={true}
                                placeholder={translations(locale).newsfeedConfig.hdrName} />
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-sm-12 col-md-4 text-right">
                            {translations(locale).newsfeedConfig.parent_hdr}*
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <input type={"text"} className={"form-control"}
                                value={viewHdrData?.parentHdrName || '-'}
                                disabled={true}
                                placeholder={translations(locale).newsfeedConfig.parent_hdr} />
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-sm-12 col-md-4 text-right">
                            {translations(locale).newsfeedConfig.hdr_roles}*
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <input type={"text"} className={"form-control"}
                                value={viewHdrData?.roleNames?.toString()}
                                disabled={true}
                                placeholder={translations(locale).newsfeedConfig.hdr_roles} />
                        </div>
                    </div>
                </div>
                <div className="actions modal-footer">
                    <div className="row " style={{ width: '100%' }}>
                        <div className="col-12 text-center">
                            <button
                                className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                                onClick={() => closeViewHdrModal(false)}
                            >
                                {translations(locale).close.toUpperCase()}
                            </button>
                            <button
                                className="btn m-btn--pill m-btn--air btn-warning m-btn m-btn--custom"
                                style={{ marginLeft: 10 }}
                                onClick={() => closeViewHdrModal(true)}
                            >
                                {translations(locale).action.edit.toUpperCase()}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal> */}
            {/* {
                showCreateHdrModal &&
                <CreateHeader
                    onClose={closeModal}
                    onSubmit={_submitNewHdr}
                    isAdminOrSuper={isAdminOrSuper}
                />
            } */}
            <Modal
                size={'small'}
                dimmer={'blurring'}
                open={showCreateHdrModal}
                onClose={closeModal}
                className="react-modal overflow-modal"
            >
                <div className="header">
                    {translations(locale).newsfeed.title}
                    <button type="button" className="close" onClick={closeModal}>
                        <CloseRoundedIcon />
                    </button>
                </div>
                <div className="content" style={{ paddingBottom: 100 }}>
                    <div className="row form-group">
                        <div className="col-sm-12 col-md-4 text-right">
                            {translations(locale).newsfeedConfig.hdrName}*
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <input type={"text"} className={"form-control"}
                                value={newHdrName}
                                placeholder={translations(locale).newsfeedConfig.hdrName}
                                onChange={_onNewNfNameChange} />
                        </div>
                    </div>
                    {
                        isAdminOrSuper
                            ?
                            <div className="row form-group">
                                <div className="col-sm-12 col-md-4 text-right">
                                    {translations(locale).newsfeedConfig.parent_hdr_type}*
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <Dropdown
                                        placeholder={translations(locale).newsfeedConfig.parent_hdr_type}
                                        fluid
                                        search
                                        selection
                                        value={newSelectedHeaderType}
                                        options={headerTypes}
                                        onChange={_onHdrTypeChange}
                                        closeOnChange
                                    />
                                </div>
                            </div>
                            : null
                    }
                    <div className="row form-group">
                        <div className="col-sm-12 col-md-4 text-right">
                            {translations(locale).newsfeedConfig.parent_hdr}*
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <Dropdown
                                placeholder={translations(locale).newsfeedConfig.parent_hdr}
                                fluid
                                search
                                selection
                                value={newHdrSelectedParent}
                                options={allHeaders}
                                onChange={_onParentHdrChange}
                                closeOnChange
                            />
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-sm-12 col-md-4 text-right">
                            {translations(locale).newsfeedConfig.hdr_roles}*
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <Dropdown
                                placeholder={translations(locale).newsfeedConfig.hdr_roles}
                                fluid
                                search
                                selection
                                multiple
                                value={selectedSchoolRoles}
                                onChange={_onNewHdrRoleChange}
                                options={schoolRoles}
                            />
                        </div>
                    </div>
                </div>
                <div className="actions modal-footer">
                    <div className="row " style={{ width: '100%' }}>
                        <div className="col-12 text-center">
                            <button
                                className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                                onClick={closeModal}
                            >
                                {translations(locale).close.toUpperCase()}
                            </button>
                            <button
                                className="btn m-btn--pill m-btn--air btn-warning m-btn m-btn--custom"
                                style={{ marginLeft: 10 }}
                                onClick={_submitNewHdr}
                            >
                                {translations(locale).save.toUpperCase()}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                size={'small'}
                dimmer={'blurring'}
                open={showEditHdrModal}
                onClose={closeEditModal}
                className="react-modal overflow-modal"
            >
                <div className="header">
                    {translations(locale).newsfeed.title}
                    <button type="button" className="close" onClick={closeEditModal}>
                        <CloseRoundedIcon />
                    </button>
                </div>
                <div className="content" style={{ paddingBottom: 100 }}>
                    <div className="row form-group">
                        <div className="col-sm-12 col-md-4 text-right">
                            {translations(locale).newsfeedConfig.hdrName}*
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <input type={"text"} className={"form-control"}
                                value={selectedEditHdr?.name}
                                placeholder={translations(locale).newsfeedConfig.hdrName}
                                onChange={_onEditNfNameChange} />
                        </div>
                    </div>
                    {
                        isAdminOrSuper
                            ?
                            <div className="row form-group">
                                <div className="col-sm-12 col-md-4 text-right">
                                    {translations(locale).newsfeedConfig.parent_hdr_type}*
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <Dropdown
                                        fluid
                                        search
                                        selection
                                        value={selectedEditHdr?.typeId}
                                        options={headerTypes}
                                        onChange={_onEditHdrTypeChange}
                                        closeOnChange
                                    />
                                </div>
                            </div>
                            : null
                    }
                    {
                        selectedEditHdr && !selectedEditHdr.isSchool &&
                        <div className="row form-group">
                            <div className="col-sm-12 col-md-4 text-right">
                                {translations(locale).newsfeedConfig.parent_hdr}*
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <Dropdown
                                    placeholder={translations(locale).newsfeedConfig.parent_hdr}
                                    fluid
                                    search
                                    selection
                                    value={selectedEditHdr?.parentHdrId}
                                    options={allHeaders}
                                    onChange={_onEditParentHdrChange}
                                    closeOnChange
                                />
                            </div>
                        </div>
                    }
                    <div className="row form-group">
                        <div className="col-sm-12 col-md-4 text-right">
                            {translations(locale).newsfeedConfig.hdr_roles}*
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <Dropdown
                                fluid
                                search
                                selection
                                multiple
                                value={selectedEditHdr?.roles}
                                onChange={_onEditHdrRoleChange}
                                options={schoolRoles}
                            />
                        </div>
                    </div>
                </div>
                <div className="actions modal-footer">
                    <div className="row " style={{ width: '100%' }}>
                        <div className="col-12 text-center">
                            <button
                                className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                                onClick={closeEditModal}
                            >
                                {translations(locale).close.toUpperCase()}
                            </button>
                            <button
                                className="btn m-btn--pill m-btn--air btn-warning m-btn m-btn--custom"
                                style={{ marginLeft: 10 }}
                                onClick={_submitEditHdr}
                            >
                                {translations(locale).action.edit.toUpperCase()}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                size={'small'}
                dimmer={'blurring'}
                open={showCreateRecipientModal}
                onClose={closeRecipientModal}
                className="react-modal overflow-modal"  
            >
                <div className="header">
                    {translations(locale).newsfeedConfig.addRecipient}
                    <button type="button" className="close" onClick={closeRecipientModal}>
                        <CloseRoundedIcon />
                    </button>
                </div>
                <div className="content" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <div className="row form-group">
                        <div className="col-12" style={{display: 'flex'}}>
                            <div style={{margin: 'auto'}}>
                                <table>
                                    <tbody>
                                        <tr>
                                            <th className='pr-2'>
                                                {translations(locale).role}
                                            </th>
                                            <th className='pr-2'>
                                                <Dropdown
                                                    fluid
                                                    search
                                                    clearable
                                                    selection
                                                    value={selectedRoleId}
                                                    options={roleList}
                                                    onChange={handlerRole}
                                                    closeOnChange
                                                    style={{
                                                        width: 200,
                                                        borderRadius: 8,
                                                    }}
                                                />
                                            </th>
                                            <th>
                                                <input
                                                    type="text"
                                                    className={"form-control"}
                                                    value={newRecipientFilter}
                                                    style={{
                                                        maxWidth: 200,
                                                        borderRadius: 8,
                                                    }}
                                                    onChange={(e) => {
                                                        setNewRecipientFilter(e.target.value) 
                                                    }} 
                                                    placeholder={translations(locale).search}
                                                />
                                            </th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-12">
                            <Checkbox 
                                label={translations(locale).select_all}
                                checked={isRecipientAll}
                                onChange={(e, data) => _onRecipientAllChange(data.checked)} 
                            />
                        </div>
                    </div>
                    <div className="row form-group">
                        {
                            recipientList && recipientList.length > 0 && 
                            filterUsers().map(function (user) {
                                return <div className="col-md-6 col-xs-12" key={'user_' + user.id}>

                                    <Container textAlign='center' style={{ display: 'inline-flex', marginBottom: 10 }}>
                                        <Checkbox 
                                            label=''
                                            checked={user.checked}
                                            onChange={(e, data) => onUserClick(user.id, data.checked)} 
                                            style={{position: 'relative', top: 13, right: 5}}
                                        />
                                        <img className="m--img-rounded m--marginless m--img-centered"
                                            onError={(e) => {
                                                e.target.onError = null,
                                                    e.target.src = '/images/avatar.png'
                                            }}
                                            onClick={() => onUserClick(user.id)}
                                            width="45" height="45"
                                            src={user.avatar || '/images/avatar.jpg'} />
                                        <div
                                            onClick={() => onUserClick(user.id)}
                                            style={{ 
                                                cursor: 'pointer', 
                                                marginLeft: 10, 
                                                textAlign: 'left',
                                                width: '100%',
                                                display: 'grid'
                                            }}>
                                            <span style={{color: '#ff5b1d', marginBottom: 3}}><b>{user.firstName.toUpperCase()} {user.lastName}</b></span>
                                            <span 
                                                style={{
                                                    display: 'table-caption',
                                                    background: '#c2c3c4',
                                                    borderRadius: 6,
                                                    padding: 5,
                                                    width: '100%'
                                                }}
                                            >
                                                {user.roles}
                                            </span>
                                        </div>
                                    </Container>
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className="actions modal-footer">
                    <div className="col-12 text-center">
                        <button
                            className="btn btn-link"
                            onClick={closeRecipientModal}
                        >
                            {translations(locale).back.toUpperCase()}
                        </button>
                        <button
                            className="btn btn-success m-btn--pill m-btn--air"
                            style={{ marginLeft: 10 }}
                            onClick={_submitRecipients}
                        >
                            {translations(locale).save.toUpperCase()}
                        </button>
                    </div>
                </div>
            </Modal>
            {
                showRecipientDeleteModal &&
                <DeleteModal
                    onClose={closeRecipientDeleteModal}
                    onSubmit={_deleteRecipients}
                    selectedTab={selectedTab}
                />
            }
            <Modal
                size={'tiny'}
                dimmer={'blurring'}
                open={hdrDeleteModal}
                onClose={closeHdrDeleteModal}
                className="react-modal overflow-modal"
            >
                <div className="header">
                    {translations(locale).action.delete}
                    <button type="button" className="close" onClick={closeHdrDeleteModal}>
                        <CloseRoundedIcon />
                    </button>
                </div>
                <div className="content">
                    <span>{translations(locale).newsfeedConfig.removeHdr}</span>
                </div>
                <div className="actions modal-footer">
                    <div className="row " style={{ width: '100%' }}>
                        <div className="col-12 text-center">
                            <button
                                className="btn m-btn--pill m-btn--air btn-outline-metal m-btn m-btn--custom"
                                onClick={closeHdrDeleteModal}
                            >
                                {translations(locale).close.toUpperCase()}
                            </button>
                            <button
                                className="btn m-btn--pill m-btn--air btn-warning m-btn m-btn--custom"
                                style={{ marginLeft: 10 }}
                                onClick={_deleteHdr}
                            >
                                {translations(locale).action.delete}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }
        </div>
    )
}

export default index
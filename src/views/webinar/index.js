import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import HtmlHead from "components/html-head/HtmlHead";
import { useSelector } from "react-redux";
import { Button, Card, Col, Row } from "react-bootstrap";
import { CalendarCheck, UsersRound, CheckSquare2 } from 'lucide-react';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {encode} from 'string-encode-decode';
import CsLineIcons from "cs-line-icons/CsLineIcons";
import EditIcon from "cs-line-icons/custom/EditIcon";
import TrashIcon from "cs-line-icons/custom/Trash";
import ReportIcon from "cs-line-icons/custom/ReportIcon";
import ReactDOM from "react-dom";
import { ClickAwayListener } from "@mui/material";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { fetchRequest } from "utils/fetchRequest";
import { webinarIndex } from 'utils/fetchRequest/Urls';
import { getWindowDimensions } from "utils/utils";
import showMessage from "modules/message";
import BreadcrumbList from "components/breadcrumb-list/BreadcrumbList";
import DeleteModal from "./modals/delete";
import 'react-horizontal-scrolling-menu/dist/styles.css';
import "modules/DataTable/datatable.scss";

const useStyles = makeStyles({
    root: {
        fontSize: '0.9rem',
        padding: '0px 15px',
        display: 'flex',
        alignItems: 'center',
        width: 220,
        border: '1px solid #EBEDF2',
        boxShadow: 'none',
        borderRadius: 8,
        height: 38,
        fontFamily: 'Mulish'
    },
});

const index = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const history = useHistory();
    const { selectedSchool } = useSelector(state => state.schoolData)
    const { height } = getWindowDimensions();

    const [loading, setLoading] = useState(false)

    const [title] = useState(t('webinar.title'))
    const [individualContextMenus] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [initLoader, setInitLoader] = useState(true)
    const [contextMenuKeys] = useState(['edit', 'delete'])
    const [list, setList] = useState([])
    const [selectedButton, setSelectedButton] = useState('ACTIVE')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [selectedId, setSelectedId] = useState(null)
    const [contextMenus, setContextMenus] = useState([
        {
            key: "edit",
            icon: <EditIcon />,
            title: t('action.edit'),
        },
        {
            key: "delete",
            icon: <TrashIcon />,
            title: t('action.delete'),
        }
    ]);

    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "webinar/index", text: title },
    ];

    const description = "";

    const init = (params) => {
        setLoading(true)
        fetchRequest(webinarIndex, 'POST', params)
            .then((res) => {
                if (res.success) {
                    let cloneList = [...list]
                    if(cloneList && cloneList.length > 0){
                        if(res?.list && res?.list.length > 0){
                            for(let i = 0; i < res?.list.length; i++){
                                cloneList.push(res?.list[i])
                            }
                        }

                        setList(cloneList)
                    } else {
                        setList(res?.list || [])
                    }
                    
                    if(params.page){
                        setCurrentPage(params.page)
                    }
                    setTotalCount(res?.totalCount || 0)
                    setInitLoader(false)
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    useEffect(() => {
        init({
            school: selectedSchool?.id,
        })
    }, [])

    const handlerCreateButton = () => {
        history.push({
            pathname: '/webinar/add',
        })
    }

    const handlerButton = (value) => {
        if(value == 'INACTIVE'){
            setContextMenus([
                {
                    key: "report",
                    icon: <ReportIcon />,
                    title: t('webinar.viewReport'),
                }
            ])
        } else {
            setContextMenus([
                {
                    key: "edit",
                    icon: <EditIcon />,
                    title: t('action.edit'),
                },
                {
                    key: "delete",
                    icon: <TrashIcon />,
                    title: t('action.delete'),
                }
            ])
        }
        
        setSelectedButton(value)
        init({
            school: selectedSchool?.id,
            active: value,
        })
    }

    const callback = () => {
        if (!loading && totalCount > list.length) {
            init({
                school: selectedSchool?.id,
                page: currentPage + 1
            })
        }
    }

    const scrollRef = useBottomScrollListener(callback, 0, 200, undefined, true);

    useEffect(() => {
        if(!initLoader){
            let timeout = setTimeout(() => {
                const params = {
                    school: selectedSchool?.id,
                    search: searchValue
                }
                init(params)
            }, 1000);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [searchValue]);

    const onHandlerInputChange = (e) => {
        setSearchValue(e.target.value);
    }

    const getWrapper = () => {
        const wrapperId = "datatable-contextmenu-wrapper";
        const cmWrapper = document.getElementById(wrapperId);
        if (cmWrapper) {
            return cmWrapper;
        } else {
            const cmWrapper = document.createElement("div");
            cmWrapper.id = wrapperId;
            document.body.appendChild(cmWrapper);
            return cmWrapper;
        }
    };

    const unMountContextMenus = () => {
        const wrapper = getWrapper();
        if (wrapper) {
            ReactDOM.unmountComponentAtNode(wrapper);
        }
    };

    const onContextMenuItemClick = (key, id) => {
        if(key == 'edit'){
            history.push({
                pathname: '/webinar/edit',
                state: {
                    id
                }
            })
        } else if(key == 'delete'){
            setShowDeleteModal(true)
            setSelectedId(id)
        } else if(key == 'report'){
            history.push({
                pathname: '/webinar/view',
                state: {
                    id
                }
            })
        }
    }

    const onContextMenu = (e, row) => {
        e.preventDefault();
        unMountContextMenus();

        let availableContextMenus = [];

        if (individualContextMenus) {
            if (contextMenus.length && contextMenuKeys?.length) {
                for (const menu of contextMenus) {
                    if (contextMenuKeys.includes(menu.key)) {
                        availableContextMenus.push(menu);
                    }
                }
            }
        } else {
            for (const menu of contextMenus) {
                availableContextMenus.push(menu);
            }
        }

        if (availableContextMenus.length) {
            const wrapper = getWrapper();
            const menu = (
                <ClickAwayListener onClickAway={unMountContextMenus}>
                    <div className="dt-cm-wrapper" style={{ top: e.pageY, left: e.pageX - 125 }}>
                        {availableContextMenus.map((menu) => {
                            return (
                                <div
                                    className="dt-cm-item"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        unMountContextMenus();
                                        onContextMenuItemClick?.(menu.key, row.id);
                                    }}
                                    key={menu.key}
                                >
                                    <div className="mr-2">{menu.icon ? menu.icon : null}</div>
                                    <span className="black-color">{menu.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </ClickAwayListener>
            );
            ReactDOM.render(menu, wrapper);
        }
    };

    const onHandlerCopyLink = () => {
        showMessage(t('common.success'), true)
    }

    const deleteWebinar = () => {
        let params = {
            school: selectedSchool.id,
            id: selectedId
        }

        setLoading(true)
        fetchRequest(webinarIndex, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setList(res?.list || [])
                    setTotalCount(res?.totalCount || 0)
                } else {
                    showMessage(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                showMessage(t('errorMessage.title'));
                setLoading(false)
            })
    }

    return (
        <>
            <HtmlHead title={title} description={description} />
            <div className="page-title-container">
                <Row>
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                </Row>
            </div>
            <Row className="g-0">
                <Col xl="12" xxl="12" className="pl-0">
                    <div className="webinar-tab-button-style">
                        <button
                            type="button"
                            onClick={() => handlerButton('ACTIVE')}
                            className={selectedButton == 'ACTIVE' ? "btn btn-primary active font-weight-bold" : "btn btn-primary font-weight-bold"}
                        >
                            {t('webinar.active')}
                        </button>
                        <button
                            type="button"
                            onClick={() => handlerButton('INACTIVE')}
                            className={selectedButton == 'INACTIVE' ? "btn btn-primary active font-weight-bold ml-2" : "btn btn-primary font-weight-bold ml-2"}
                        >
                            {t('webinar.inActive')}
                        </button>
                    </div>
                    <div className="col-12 mt-3">
                        <Button variant="primary" className="mb-2 add-button" onClick={() => handlerCreateButton()} style={{height: 30}}>
                            <ControlPointIcon
                                style={{ color: "white", marginRight: 4 }}
                            />
                            {t("webinar.create").toUpperCase()}
                        </Button>
                    </div>
                    <div className="col-12 mt-3">
                        <div className="d-flex justify-content-between">
                            <div>
                                <input
                                    value={searchValue}
                                    className={classes.root}
                                    placeholder={t('action.search')}
                                    onChange={e => onHandlerInputChange(e)}
                                />
                            </div>
                            <div className="small-title" style={{ color: '#505050' }}>{t('common.total') + ': ' + totalCount}</div>
                        </div>
                    </div>
                    <div ref={scrollRef} className="col-12 mt-3" style={{height: height / 1.32, overflowY: 'auto'}}>
                        {
                            list && list.length > 0 && 
                            list.map((data, index) => {
                                return (
                                    <Card 
                                        key={'most_used_' + index}
                                        className="mb-3 d-flex align-items-stretch"
                                    >
                                        <Card.Body className="d-flex flex-row flex-wrap" style={{padding: '1rem 2rem'}}>
                                            <div className='col-12 d-flex justify-content-between'>
                                                <div className='black-color pinnacle-demi-bold mt-2 mb-2'>
                                                    <div>{data?.name || ''}</div>
                                                </div>
                                                <div className='black-color pinnacle-demi-bold mt-2 mb-2 d-inline-flex'>
                                                    <div>
                                                    <CopyToClipboard
                                                        text={location.origin + '/webinar/live?id=' + data.roomCode}
                                                    >
                                                        <Button variant="outline-primary" className="mb-2 add-button" onClick={() => onHandlerCopyLink()} style={{height: 30}}>
                                                            {t("webinar.copyLink").toUpperCase()}
                                                        </Button>
                                                    </CopyToClipboard>
                                                        
                                                    </div>
                                                    <div>
                                                        <Button
                                                            onClick={(e) => onContextMenu(e, data)}
                                                            variant="outline-primary"
                                                            className="btn-icon btn-icon-only position-relative ml-2"
                                                            size="sm"
                                                        >
                                                            <CsLineIcons icon="more-vertical" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <Col md={12} className='black-color' style={{fontWeight: 300}}>
                                                <CalendarCheck color="#ff5b1d" className="mr-1" size={22}/>{(data?.createdDate?.date?.slice(0, 19) || '-') } <UsersRound color="#ff5b1d" className="mr-1 ml-4" size={22}/>{data?.userCount || 0} <CheckSquare2 color="#ff5b1d" className="mr-1 ml-4" size={22}/> {(data?.groupName || '-') + ' | ' + (data?.subjectName || '-')}
                                            </Col>
                                            <Col md={12} className='d-flex align-items-end'>
                                                <ul className="list-group">
                                                    <li key={'user_' + index} className="d-flex justify-content-between align-items-center mt-3">
                                                        <div className="d-flex align-items-center">
                                                            <img className="profile rounded-circle" alt={data.firstName} src={data.avatar ? data.avatar : 'https://lxp-test.eschool.mn/images/avatar.png'} width={40} height={40} />
                                                            <div className="fs-13 ms-3">
                                                                <span className='d-block black-color' style={{fontWeight: 300}}>{data?.firstName || '-'}</span>
                                                                <span className='d-block black-color' style={{fontWeight: 300}}>{data?.startTime?.date?.slice(0, 19) || '-'}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </Col>
                                        </Card.Body>
                                    </Card>
                                )
                            })
                        }
                    </div>
                </Col>
            </Row>
            {
                showDeleteModal &&
                <DeleteModal
                    show={showDeleteModal}
                    onClose={() => {
                        setSelectedId(null)
                        setShowDeleteModal(false)
                    }}
                    onSave={() => deleteWebinar()}
                />
            }
            {
                loading &&
                <>
                    <div className='loader-container'>
                        <svg className="splash-spinner" viewBox="0 0 50 50">
                            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                        </svg>
                    </div>
                </>
            }
        </>
    );
};

export default index;

import React, {useEffect, useState} from "react";
import {translations} from "utils/translations";
// import * as actions from "Actions/action";
import {Checkbox, Dropdown, Modal, Tab} from 'semantic-ui-react'
import { Row, Col } from "react-bootstrap";
import DTable from "modules/DataTable/DTable";
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import secureLocalStorage from "react-secure-storage";
// import {fetchRequest} from 'utils/fetchRequest'
// import {transcriptIndex, transcriptStudentSearch, transcriptSubmit} from 'utils/fetchRequest/Urls'
import Create from './modal/create'
import message from "modules/message";
import { useTranslation } from "react-i18next";

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const columns = [
    {
        dataField: 'createdDate',
        text: translations(locale)?.student_card?.printed_date,
        sort: true
    },
    {
        dataField: 'className',
        text: translations(locale)?.class_name,
        sort: true
    },
    {
        dataField: 'code',
        text: translations(locale)?.code,
        sort: true,
    },
    {
        dataField: 'lastName',
        text: translations(locale)?.last_name,
        sort: true
    },
    {
        dataField: 'firstName',
        text: translations(locale)?.first_name,
        sort: true
    },
    {
        dataField: 'years',
        text: translations(locale)?.school_settings?.year,
        sort: false
    },
    {
        dataField: 'printedBy',
        text: translations(locale)?.studentTranscript?.issuedUser,
        sort: true
    },
]

const index = () => {

    const { t } = useTranslation()

    const title = t('studentTranscript.title');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "manager/transcript", text: title }
    ];

    const [studentActive, setStudentActive] = useState(1)
    const [showModal, setShowModal] = useState()
    const [loading, setLoading] = useState(false)
    const [totalCount, setTotalCount] = useState(0)
    const [transcript, setTranscript] = useState([
        {
            "id": "3162",
            "createdDate": "2024-05-14 17:29",
            "years": "",
            "firstName": "Баатар",
            "lastName": "Манлай",
            "code": "TE02",
            "className": "2A",
            "printedBy": "Enkhdelger"
        },
        {
            "id": "3006",
            "createdDate": "2024-04-15 12:55",
            "years": "",
            "firstName": "Аригун",
            "lastName": "Ганбаатар",
            "code": "TST23080024",
            "className": "9A",
            "printedBy": "Bayarbileg"
        },
        {
            "id": "3005",
            "createdDate": "2024-04-15 12:02",
            "years": "",
            "firstName": "Хүслэн",
            "lastName": "Энхбат",
            "code": "TST0111",
            "className": "2A",
            "printedBy": "Otgontsetseg"
        },
        {
            "id": "2874",
            "createdDate": "2024-03-21 16:16",
            "years": "2023-2024",
            "firstName": "Тамир",
            "lastName": "Эрдэнэ",
            "code": "S231102",
            "className": "12A",
            "printedBy": "eSchool "
        },
    ])

    const [tableState, setTableState] = useState({
        page: 1,
        pageSize: 10,
        search: null,
        order: null,
        sort: null,
    })

    const config = {
        excelExport: false,
        printButton: false,
        columnButton: false,
        defaultPageOptions: tableState
    }

    const onClose = () => {
        setShowModal(false)
    }

    useEffect(() => {
        loadIndex()
    }, [])

    const loadIndex = (page = 1, pageSize = 10, search = null, sort = null, order = null) => {
        console.log('loadIndex')
        // setLoading(true)
        // fetchRequest(transcriptIndex, 'POST', {
        //     page,
        //     pageSize,
        //     search,
        //     sort,
        //     order
        // })
        //     .then((res) => {
        //         if (res?.success) {
        //             setTranscript(res?.data?.transcripts)
        //             setTotalCount(res?.data?.totalCount)
        //         } else {
        //             message(res?.data?.message || translations(locale)?.err?.error_occurred)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const onUserInteraction = (state) => {
        setTableState(state)
        loadIndex(state?.page, state?.pageSize, state?.search, state?.sort, state?.order)
    }

    const onSubmit = (params) => {
        console.log('onSubmit')
        // setLoading(true)
        // fetchRequest(transcriptSubmit, 'POST', params)
        //     .then((res) => {
        //         if (res?.success) {
        //             window.open('/api/transcript/print?id=' + res?.data?.id + '&student=' + res?.data?.student + '&verification=' + res?.data?.verification)

        //             setTranscript(res?.data?.transcripts)
        //             setTotalCount(res?.data?.totalCount)
        //             onClose()
        //         } else {
        //             message(res?.data?.message || translations(locale)?.err?.error_occurred)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
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
                <div className={'d-flex'}>
                    <button
                        type="button"
                        onClick={() => {
                            setStudentActive(1)
                            setShowModal(true)
                        }}
                        className="btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3"
                    >
                        <AddCircleOutlineRoundedIcon className='MuiSvg-customSize'/>
                        <span className='ml-2'>{translations(locale)?.action?.register}</span>
                    </button>
                    <button
                        type="button"
                        style={{
                            marginLeft: 10
                        }}
                        onClick={() => {
                            setStudentActive(0)
                            setShowModal(true)
                        }}
                        className="btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3"
                    >
                        <AddCircleOutlineRoundedIcon className='MuiSvg-customSize'/>
                        <span className='ml-2'>{translations(locale)?.studentTranscript?.moveOutTitle}</span>
                    </button>
                </div>

                <div className="m-portlet">
                    <div className="m-portlet__body">
                        <DTable
                            remote
                            locale={locale}
                            columns={columns}
                            data={transcript}
                            totalDataSize={totalCount}
                            onInteraction={onUserInteraction}
                            config={config}
                        />
                    </div>
                </div>
            </div>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
            {
                showModal &&
                <Create
                    onClose={onClose}
                    active={studentActive}
                    onSubmit={onSubmit}
                />
            }
        </div>
    )
}

export default index
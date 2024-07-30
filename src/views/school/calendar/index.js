import FullCalendar from '@fullcalendar/react'
import message from 'modules/message'
import AddModal from './modals/add'
import EditModal from './modals/edit'
import ViewModal from './modals/view'
import listPlugin from '@fullcalendar/list'
import momentPlugin from '@fullcalendar/moment'
import DeleteModal from 'utils/deleteModal'
import { Row, Col, Card, Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react'
import dayGridPlugin from '@fullcalendar/daygrid'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from 'react-i18next'
import interactionPlugin from '@fullcalendar/interaction'
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import esLocale from '@fullcalendar/core/locales/es'

const index = () => {

    const { t } = useTranslation()
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [events, setEvents] = useState([])
    const [selectedEvent, setSelectedEvent] = useState(null)

    const title = t('calendar.title');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "school/teacher", text: title }
    ];

    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(schoolCalendarInit, 'POST', { menu: 'school' })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { events } = res.data
    //                 setEvents(events || [])
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(t('err.error_occurred'))
    //             setLoading(false)
    //         })
    // }, [])

    useEffect(() => {

        const res = {
            data: {
                selfModify: true,
                events: [
                    {
                        id: "1545",
                        color: "#1f26ff",
                        description: "Сургуулийн бүх түвшний сурагчид хамрагдана. ",
                        typeName: "Сургуулийн арга хэмжээ",
                        createdUserId: null,
                        action: false,
                        start: "2023-08-09T00:00:00+08:00",
                        end: "2023-08-12T23:59:00+08:00",
                        classNames: "schoolCalendarEvent",
                        title: "Түвшин тогтоох шалгалт",
                        allDay: true,
                        backgroundColor: "#1f26ff"
                    },
                    {
                        id: "1546",
                        color: "#ad3e00",
                        description: "For testing purpose only",
                        typeName: "Сургуулийн арга хэмжээ",
                        createdUserId: null,
                        action: false,
                        start: "2023-08-01T00:00:00+08:00",
                        end: "2023-09-01T23:59:00+08:00",
                        classNames: "schoolCalendarEvent",
                        title: "Testing eStudent",
                        allDay: true,
                        backgroundColor: "#ad3e00"
                    },
                    {
                        id: "1555",
                        color: "#ff5b1d",
                        description: "test",
                        typeName: "Сургуулийн арга хэмжээ",
                        createdUserId: null,
                        action: false,
                        start: "2023-08-23T00:00:00+08:00",
                        end: "2023-08-24T23:59:00+08:00",
                        classNames: "schoolCalendarEvent",
                        title: "test",
                        allDay: true,
                        backgroundColor: "#ff5b1d"
                    },
                    {
                        id: "1556",
                        color: "#441fff",
                        description: "",
                        typeName: "Сургуулийн арга хэмжээ",
                        createdUserId: null,
                        action: false,
                        start: "2023-08-23T00:00:00+08:00",
                        end: "2023-08-24T23:59:00+08:00",
                        classNames: "schoolCalendarEvent",
                        title: "test",
                        allDay: true,
                        backgroundColor: "#441fff"
                    },
                    {
                        id: "1589",
                        color: "#1fffd2",
                        description: "",
                        typeName: "Сургуулийн арга хэмжээ",
                        createdUserId: null,
                        action: false,
                        start: "2023-08-31T00:00:00+08:00",
                        end: "2023-09-01T23:59:00+08:00",
                        classNames: "schoolCalendarEvent",
                        title: "Jet school ",
                        allDay: true,
                        backgroundColor: "#1fffd2"
                    },
                    {
                        id: "1590",
                        color: "#3547d0",
                        description: "",
                        typeName: "Сургуулийн арга хэмжээ",
                        createdUserId: null,
                        action: false,
                        start: "2023-08-30T10:00:00+08:00",
                        end: "2023-08-31T13:00:00+08:00",
                        classNames: "schoolCalendarEvent",
                        title: "TEST",
                        allDay: false,
                        backgroundColor: "#3547d0"
                    },
                    {
                        id: "1615",
                        color: "#1202f2",
                        description: "Хичээлийн шинэ жил эхэлж байгаатай холбоотой үйл ажиллагаа",
                        typeName: "Сургуулийн арга хэмжээ",
                        createdUserId: null,
                        action: false,
                        start: "2023-09-04T00:00:00+08:00",
                        end: "2023-09-06T23:59:00+08:00",
                        classNames: "schoolCalendarEvent",
                        title: "9/4-9/5 үйл ажиллагаа",
                        allDay: true,
                        backgroundColor: "#1202f2"
                    },
                    {
                        id: "1676",
                        color: "#1fff9e",
                        description: "",
                        typeName: "Сургуулийн арга хэмжээ",
                        createdUserId: null,
                        action: false,
                        start: "2023-09-12T06:00:00+08:00",
                        end: "2023-09-12T08:00:00+08:00",
                        classNames: "schoolCalendarEvent",
                        title: "ТЕСТ",
                        allDay: false,
                        backgroundColor: "#1fff9e"
                    },
                    {
                        id: "1754",
                        color: "#ff5b1d",
                        description: "аааррхсрх",
                        typeName: "Сургуулийн арга хэмжээ",
                        createdUserId: null,
                        action: false,
                        start: "2023-09-22T15:01:00+08:00",
                        end: "2023-09-22T16:00:00+08:00",
                        classNames: "schoolCalendarEvent",
                        title: "сургалт",
                        allDay: false,
                        backgroundColor: "#ff5b1d"
                    },
                    {
                        id: "1757",
                        color: "#ff5b1d",
                        description: "",
                        typeName: "Сургуулийн арга хэмжээ",
                        createdUserId: null,
                        action: false,
                        start: "2023-09-23T00:00:00+08:00",
                        end: "2023-09-24T23:59:00+08:00",
                        classNames: "schoolCalendarEvent",
                        title: "test",
                        allDay: true,
                        backgroundColor: "#ff5b1d"
                    },
                    {
                        id: "2391",
                        color: "#36ce87",
                        description: "test",
                        typeName: "Сургуулийн арга хэмжээ",
                        createdUserId: null,
                        action: false,
                        start: "2023-10-31T10:00:00+08:00",
                        end: "2023-10-31T13:00:00+08:00",
                        classNames: "schoolCalendarEvent",
                        title: "eSchool",
                        allDay: false,
                        backgroundColor: "#36ce87"
                    },
                    {
                        id: "6867",
                        color: "#090706",
                        description: "123",
                        typeName: "Сургуулийн арга хэмжээ",
                        createdUserId: null,
                        action: false,
                        start: "2024-07-10T23:00:00+08:00",
                        end: "2024-07-11T05:00:00+08:00",
                        classNames: "schoolCalendarEvent",
                        title: "123132",
                        allDay: false,
                        backgroundColor: "#090706"
                    },
                    {
                        id: "6868",
                        color: "#ff5b1d",
                        description: "",
                        typeName: "Сургуулийн арга хэмжээ",
                        createdUserId: null,
                        action: false,
                        start: "2024-07-17T00:00:00+08:00",
                        end: "2024-07-20T23:59:00+08:00",
                        classNames: "schoolCalendarEvent",
                        title: "6546",
                        allDay: true,
                        backgroundColor: "#ff5b1d"
                    },
                    {
                        id: "6869",
                        color: "#eab3de",
                        description: "Enhdelger-s busad hereglechid zasch, ustgah bolomjgui ",
                        typeName: "Сургуулийн арга хэмжээ",
                        createdUserId: "3274",
                        action: false,
                        start: "2024-07-19T00:00:00+08:00",
                        end: "2024-07-22T23:59:00+08:00",
                        classNames: "schoolCalendarEvent",
                        title: "Ke zuwhun zasch, ustgaj chadna",
                        allDay: true,
                        backgroundColor: "#eab3de"
                    },
                    {
                        id: "6870",
                        color: "#b98abc",
                        description: "Only ke can edit or delete. uur hereglegcheer orj edit hiiw",
                        typeName: "Сургуулийн арга хэмжээ",
                        createdUserId: "3274",
                        action: false,
                        start: "2024-06-01T00:00:00+08:00",
                        end: "2024-06-03T23:59:00+08:00",
                        classNames: "schoolCalendarEvent",
                        title: "Only me",
                        allDay: true,
                        backgroundColor: "#b98abc"
                    }
                ],
                message: "Амжилттай"
            },
            success: true
        }

        const { events } = res.data
        setEvents(events || [])
    }, [])

    const handleAdd = event => {
        console.log('handleAdd')
        // setLoading(true)
        // fetchRequest(schoolCalendarSubmit, 'POST', { ...event, menu: 'school' })
        //     .then((res) => {
        //         if (res.success) {
        //             const { events } = res.data
        //             setEvents(events || [])
        //             message(res.data.message, res.success)
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const handleEdit = event => {
        console.log('edit')
        // setLoading(true)
        // fetchRequest(schoolCalendarEdit, 'POST', { ...event, id: selectedEvent?.id, menu: 'school' })
        //     .then((res) => {
        //         if (res.success) {
        //             const { events } = res.data
        //             setEvents(events || [])
        //             message(res.data.message, res.success)
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const handleDelete = () => {
        console.log('delete')
        // setLoading(true)
        // fetchRequest(schoolCalendarDelete, 'POST', { event: selectedEvent?.id, menu: 'school' })
        //     .then((res) => {
        //         if (res.success) {
        //             const { events } = res.data
        //             setEvents(events || [])
        //             message(res.data.message, res.success)
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const handleEventDrop = params => {
        console.log('handleEventDrop')
        // setLoading(true)
        // fetchRequest(schoolCalendarDrag, 'POST', { id: params?.event?.id, start: params?.event?.start?.toISOString(), end: params?.event?.end?.toISOString(), menu: 'school' })
        //     .then((res) => {
        //         if (res.success) {
        //             const { events } = res.data
        //             setEvents(events || [])
        //             message(res.data.message, res.success)
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    const closeModal = () => {
        setShowAddModal(false)
        setSelectedEvent(null)
        setShowEditModal(false)
        setShowViewModal(false)
        setShowDeleteModal(false)
    }

    const handleEventClick = params => {
        setSelectedEvent(events?.find(el => el?.id == params?.event?.id))
        setShowViewModal(true)
    }

    return (
        <>
            <HtmlHead title={title} description={description} />

            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>  

            <div className="m-content">
                <Row className=''>
                    <Col className="col">
                        <button
                            onClick={() => { setShowAddModal(true) }}
                            className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                        >
                            <ControlPointIcon style={{ color: "white", marginRight: "4px" }} className='MuiSvg-customSize'/>
                            {t('action.register')}
                        </button>
                        <div className="m-portlet">
                            <div className="m-portlet__body full-calendar-custom-style">
                                <FullCalendar
                                    firstDay={1}
                                    events={events}
                                    editable={true}
                                    titleFormat='YYYY-MM'
                                    eventDrop={handleEventDrop}
                                    initialView='dayGridMonth'
                                    eventClick={handleEventClick}
                                    timeZone='Asia/Ulaanbaatar'
                                    headerToolbar={{
                                        start: 'prev,next today',
                                        center: 'title',
                                        end: 'dayGridMonth listMonth',
                                    }}
                                    buttonText={{
                                        day: t('calendar.day'),
                                        week: t('calendar.week'),
                                        list: t('calendar.list'),
                                        month: t('calendar.month'),
                                        today: t('calendar.today'),
                                    }}
                                    allDayText={t('calendar.all_day')}
                                    noEventsClassNames='text-center pt-5'
                                    noEventsContent={t('calendar.no_event')}
                                    plugins={[dayGridPlugin, listPlugin, interactionPlugin, momentPlugin]}
                                    views={{
                                        dayGridMonth: {
                                            eventTimeFormat: { hour: '2-digit', minute: '2-digit', meridiem: false, hour12: false, },
                                        },
                                        listMonth: {
                                            listDaySideFormat: true,
                                            eventTimeFormat: { hour: '2-digit', minute: '2-digit', meridiem: false, hour12: false, },
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }
            {
                showAddModal &&
                <AddModal
                    onSubmit={handleAdd}
                    onClose={closeModal}
                />
            }
            {
                showEditModal && selectedEvent &&
                <EditModal
                    eventData={selectedEvent}
                    onSubmit={handleEdit}
                    onClose={() => { setShowEditModal(false), setShowViewModal(true) }}
                />
            }
            {
                showViewModal && selectedEvent &&
                <ViewModal
                    event={selectedEvent}
                    onClose={closeModal}
                    onEdit={() => { setShowViewModal(false), setShowEditModal(true) }}
                    onDelete={() => { setShowViewModal(false), setShowDeleteModal(true) }}
                />
            }
            {
                showDeleteModal && selectedEvent &&
                <DeleteModal
                    locale={locale}
                    onClose={() => { setShowDeleteModal(false), setShowViewModal(true) }}
                    onDelete={handleDelete}
                    title={t('delete')}
                >
                    {t('delete_confirmation')}
                    <br />
                    <br />
                    {t('delete_confirmation_description')}
                </DeleteModal>
            }
        </>
    )
}

export default index
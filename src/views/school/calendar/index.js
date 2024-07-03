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
import { translations } from 'utils/translations'
import { useTranslation } from 'react-i18next'
import interactionPlugin from '@fullcalendar/interaction'
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import ControlPointIcon from '@mui/icons-material/ControlPoint';


const index = () => {

    const { t } = useTranslation()
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [events, setEvents] = useState([{
        allDay: false,
        backgroundColor: '#ff5b1d',
        classNames: 'schoolCalendarEvent',
        color: '#ff5b1d',
        description: "ыбыбсыбс",
        end: "2024-07-02T19:58:00+08:00",
        id: "6856",
        start: "2024-07-02T18:58:00+08:00",
        title: 'Test',
        typeName: "Сургуулийн арга хэмжээ",
    }
    ])
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
    //             message(translations(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    // }, [])

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
        //         message(translations(locale)?.err?.error_occurred)
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
        //         message(translations(locale)?.err?.error_occurred)
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
        //         message(translations(locale)?.err?.error_occurred)
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
        //         message(translations(locale)?.err?.error_occurred)
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
                        <Button
                            onClick={() => { setShowAddModal(true) }}
                            className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                        >
                            <ControlPointIcon style={{ color: "white", marginRight: "4px" }} />
                            {t('action.register')}
                        </Button>
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
import React, {useState, useEffect} from 'react'
import {Col, Row} from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import {Doughnut} from 'react-chartjs-2'
import {Chart as ChartJS, ArcElement, Tooltip} from 'chart.js'
import AttendanceModal from '../../modal/attendanceModal'
import {studentBookAttendance} from 'utils/fetchRequest/Urls'
import {fetchRequest} from 'utils/fetchRequest'
import message from 'modules/message';

// const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const attendance = ({id}) => {
    const locale="mn"
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)
    ChartJS.register(ArcElement, Tooltip)
    ChartJS.defaults.font.family = 'MulishRegular'

    const [showAttendanceModal, setShowAttendanceModal] = useState(false)
    const [seasonList, setSeasonList] = useState([])
    const [modalSeasonId, setModalSeasonId] = useState(null)
    const [modalTypeId, setModalTypeId] = useState(null)
    const [modalTypeName, setModalTypeName] = useState('')

    const graphic = (items) => {
        const Gdata = Object.keys(items);
        const labels = Gdata.map(i => items[i].name);
        const colors = Gdata.map(i => items[i].color);
        const percent = Gdata.map(i => items[i].percent);

        const data = {
            labels,
            datasets: [
                {
                    label: 'Dataset 1',
                    backgroundColor: colors,
                    data: percent,
                    borderWidth: 0,
                    borderRadius: 30,
                },
            ],
            text: '123%'
        };
        return data
    }

    const showModal = (season, typeObj) => {
        setModalSeasonId(season)
        setModalTypeId(typeObj?.attendanceTypeId)
        setModalTypeName(typeObj?.name)
        setShowAttendanceModal(true)
    }

    const closeModal = () => {
        setModalSeasonId(null)
        setModalTypeId(null)
        setModalTypeName('')
        setShowAttendanceModal(false)
    }

    useEffect(() => {
        // setLoading(true)
        // fetchRequest(studentBookAttendance, 'POST', {id})
        //     .then(res => {
        //         if (res.success) {
        //             const {seasons} = res.data
        //             setSeasonList(seasons || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }, [])

    return (
        <>
            <Row>
                {seasonList?.map((seasonObj, index) => (
                    <Col md={6} key={'season_' + index}>
                        <div className='br-08 border-orange p-4 mb-3'>
                            <h5 className='color-brand pinnacle-bold'>{seasonObj?.seasonName}</h5>
                            <div className='d-flex align-items-center justify-content-center mt-4'>
                                <div className='mx-auto'>
                                    <Doughnut
                                        width={150}
                                        data={graphic(seasonObj?.types)}
                                        height={150}
                                        plugins={[{
                                            beforeDraw: function(chart) {
                                                let width = chart.width,
                                                    height = chart.height,
                                                    ctx = chart.ctx;
                                                ctx.restore();
                                                let fontSize = (height / 80).toFixed(2);
                                                ctx.font = fontSize + "em PinnacleBold";
                                                ctx.textBaseline = "top";
                                                let text = seasonObj?.camePercentage + '%',
                                                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                                                    textY = (height / 2 - 15);
                                                ctx.fillText(text, textX, textY);
                                                ctx.save();
                                            }
                                        }]}
                                        options={{
                                            plugins: {
                                                legend: {
                                                    display: false
                                                },
                                            },
                                            cutout: '70%',
                                            maintainAspectRatio: false,
                                            elements: {
                                                arc: {
                                                    roundedCornersFor: 0
                                                }
                                            }
                                        }}
                                    />
                                </div>

                                <div className='fs-11 gap-02 mx-auto d-flex flex-column' key={index}>
                                    <span
                                        className='br-04 px-1 text-center'>{t('total')}: {seasonObj?.total} {t('dashboardAttendence.time')}</span>

                                    {seasonObj?.types.map((type, typeIndex) =>
                                        <span
                                            key={'season_' + index + '_type_' + typeIndex}
                                            onClick={() => type?.counts > 0 ? showModal(seasonObj?.seasonId, type) : ''}
                                            className='br-04 px-1 text-center'
                                            style={type?.counts > 0 ? {
                                                    cursor: 'pointer',
                                                    color: '#f4f5f8',
                                                    backgroundColor: type?.color
                                                } :
                                                {
                                                    color: '#f4f5f8',
                                                    backgroundColor: type?.color
                                                }}>{type?.name} {type?.counts} {t('dashboardAttendence.time')}</span>
                                    )}
                                    <span
                                        className='br-04 px-1 text-center'>{t('attendance.no_log_title')}: {seasonObj?.noLogCount} {t('dashboardAttendence.time')}</span>
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
            {loading &&
            <>
                <div className='blockUI blockOverlay'/>
                <div className='blockUI blockMsg blockPage'>
                    <div className='m-loader m-loader--brand m-loader--lg'/>
                </div>
            </>
            }
            {
                showAttendanceModal &&
                <AttendanceModal
                    onClose={closeModal}
                    season={modalSeasonId}
                    type={modalTypeId}
                    typeName={modalTypeName}
                    studentId={id}
                />
            }
        </>
    )
}

export default attendance
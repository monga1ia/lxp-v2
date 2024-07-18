import React, {useState, useEffect} from 'react'
import {Col, Row} from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import {Doughnut} from 'react-chartjs-2'
import {Chart as ChartJS, ArcElement, Tooltip} from 'chart.js'
import HomeworkModal from '../../modal/homeworkModal'
import {studentBookHomework} from 'utils/fetchRequest/Urls'
import {fetchRequest} from 'utils/fetchRequest/index'
import AttendanceModal from "../../modal/attendanceModal";

// const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const homework = ({id}) => {
    const locale="mn"
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)
    ChartJS.register(ArcElement, Tooltip)
    ChartJS.defaults.font.family = 'MulishRegular'

    const [showHomeworkModal, setShowHomeworkModal] = useState(false)
    const [seasons, setSeasons] = useState([])

    const [modalSeasonId, setModalSeasonId] = useState(null)
    const [modalTypeId, setModalTypeId] = useState(null)

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
        };
        return data
    }

    const showModal = (season, type) => {
        setModalSeasonId(season)
        setModalTypeId(type)
        setShowHomeworkModal(true)
    }

    const closeModal = () => {
        setModalSeasonId(null)
        setModalTypeId(null)
        setShowHomeworkModal(false)
    }

    useEffect(() => {
        setLoading(true)
        // fetchRequest(studentBookHomework, 'POST', {id})
        //     .then(res => {
        //         if (res.success) {
        //             const {seasons} = res.data
        //             setSeasons(seasons || [])
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
    }, [])

    return (
        <>
            <Row>
                {seasons?.map((seasonObj, index) => (
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
                                            beforeDraw: function (chart) {
                                                let width = chart.width,
                                                    height = chart.height,
                                                    ctx = chart.ctx;
                                                ctx.restore();
                                                let fontSize = (height / 80).toFixed(2);
                                                ctx.font = fontSize + "em PinnacleBold";
                                                ctx.textBaseline = "top";
                                                let text = seasonObj?.completePercentage + '%',
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
                                        style={{color: '#3c3f42'}}>{t('total')}: {seasonObj?.total}</span>

                                    {seasonObj?.types.map((type, tIndex) =>
                                        <span onClick={() => type?.counts > 0 ? showModal(seasonObj?.seasonId, type?.typeId) : ''}
                                              className='br-04 px-1 text-center'
                                              key={'season_' + index + '_type_' + tIndex}
                                              style={{
                                            color: '#f4f5f8',
                                            backgroundColor: type?.color
                                        }}>{type?.name} {type?.counts}</span>
                                    )}
                                    <span
                                        className='br-04 px-1 text-center'> {t('homework.not_checked')} {seasonObj?.noLogCount}</span>
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
                showHomeworkModal &&
                <HomeworkModal
                    onClose={closeModal}
                    season={modalSeasonId}
                    type={modalTypeId}
                    studentId={id}
                />
            }
        </>
    )
}

export default homework
import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card, Row } from "react-bootstrap";
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import HtmlHead from "components/html-head/HtmlHead";
import { fetchRequest } from "utils/fetchRequest";
import showMessage from "modules/message";
import { useSelector } from "react-redux";
import DTable from "modules/DataTable/DTable";
import { webinarCreate } from 'utils/fetchRequest/Urls';
import TabComponent from "components/tab/Tab";

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function EditWebinar() {
    const { t } = useTranslation();
    const history = useHistory();
    const title = t('webinar.create');
    const description = "";
    const [loading, setLoading] = useState(false)

    const { selectedSchool } = useSelector(state => state.schoolData);

    const [webinar, setWebinar] = useState(null)
    const [tableData, setTableData] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [textCenter, setTextCenter] = useState(null);
    const [tableState, setTableState] = useState(
        {
            page: 1,
            pageSize: 10,
            search: '',
            sort: 'firstName',
            order: 'asc'
        }
    )

    const [doughnutData, setDoughnutData] = useState({
        datasets: [
            {
                label: 'Poll',
                data: [0],
                backgroundColor: ['rgba(62,191,163,255)'],
                borderWidth: 0,
                cutout: '70%',
            },
        ],
    });

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltips: {
                enabled: true,
                bodyAlign: 'right'
            },
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 10,
            },
        },
        legend:{
            display: true,
            position: 'bottom',
            align: 'start',
            maxWidth: 20,
            ltr: true,
            textDirection: 'ltr',
            labels:{
                display: true,
                font: {
                    size: 12,
                    weight: '300',
                    family: 'Mulish',
                },
                boxHeight: 10,
                boxWidth: 10,
                textAlign: 'left'
            }
        },
    };

    const config = {
        showPagination: true,
        showFilter: true,
        showAllData: false,
        tableMarginLess: true,
        defaultSort: [{
            dataField: tableState.sort,
            order: tableState.order
        }],
        defaultPageOptions: {
            page: tableState.page,
            sizePerPage: tableState.pageSize,
            search: tableState.search,
        }
    };

    const columnOpen = [
        {
            dataField: "gradeName",
            text: t("webinar.grade"),
            sort: true,
        },
        {
            dataField: "className",
            text: t("menu.group"),
            sort: true,
        },
        {
            dataField: "studentCode",
            text: t("menu.studentCode"),
            sort: true,
        },
        {
            dataField: "lastName",
            text: t("person.lastName"),
            sort: true,
        },
        {
            dataField: "firstName",
            text: t("person.firstName"),
            sort: true,
        },
        {
            dataField: "totalDuration",
            text: t("webinar.totalMinutes"),
            sort: true,
            style: (cell, row) => {
                if(row?.totalMinutes && row?.userMinutes){
                    if(row?.totalMinutes > 0 && row?.userMinutes > 0){
                        if (((row?.userMinutes * 100) / row.totalMinutes) > 90) {
                            return {
                                textAlign: 'right',
                                backgroundColor: '#9EDFD0'
                            };
                        }
                        return {
                            textAlign: 'right',
                            backgroundColor: 'rgba(244,166,182, 0.5)'
                        };
                    }
                }
                
                return {
                    textAlign: 'right',
                    backgroundColor: '#DFE2EA'
                };
            },
            formatter: (cell, row) => {
                if(row?.totalMinutes < row?.userMinutes){
                    return row?.totalMinutes + ' | ' + 100 + '%'
                } else {
                    if(row?.totalMinutes > 0 && row?.userMinutes > 0){
                        return row?.totalMinutes + ' | ' + ((row?.userMinutes * 100) / row.totalMinutes).toFixed(2) + '%'
                    } else {
                        return row?.totalMinutes
                    }
                }
            },
        },
        {
            dataField: "entered",
            text: t("webinar.entered"),
            sort: true,
            style: (cell, row) => {
                if(parseFloat(cell) > 0){
                    return {
                        textAlign: 'right',
                        backgroundColor: '#FFF'
                    }
                }
                
                return {
                    textAlign: 'right',
                    backgroundColor: '#DFE2EA'
                };
            },
        },
        {
            dataField: "quit",
            text: t("webinar.quit"),
            sort: true,
            style: (cell, row) => {
                if(parseFloat(cell) > 0){
                    return {
                        textAlign: 'right',
                        backgroundColor: '#FFF'
                    }
                }
                
                return {
                    textAlign: 'right',
                    backgroundColor: '#DFE2EA'
                };
            },
        },
    ];

    const columnNotOpen = [
        {
            dataField: "statusCode",
            text: t("common.status"),
            sort: true,
            formatter: (cell, row) => {
                return cell == 'STARTED'
                  ? 
                    <div className="tag" style={{ backgroundColor: '#3EBFA3CC' }}>{row.statusName}</div>
                  : 
                    <div className="tag" style={{ backgroundColor: '#575962' }}>{row.statusName}</div>;
            },
        },
        {
            dataField: "className",
            text: t("menu.group"),
            sort: true,
        },
        {
            dataField: "studentCode",
            text: t("menu.studentCode"),
            sort: true,
        },
        {
            dataField: "lastName",
            text: t("person.lastName"),
            sort: true,
        },
        {
            dataField: "firstName",
            text: t("person.firstName"),
            sort: true,
        },
        {
            dataField: "totalDuration",
            text: t("webinar.totalMinutes"),
            sort: true,
            style: (cell, row) => {
                if(row?.totalMinutes && row?.userMinutes){
                    if(row?.totalMinutes > 0 && row?.userMinutes > 0){
                        if (((row?.userMinutes * 100) / row.totalMinutes) > 90) {
                            return {
                                textAlign: 'right',
                                backgroundColor: '#9EDFD0'
                            };
                        }
                        return {
                            textAlign: 'right',
                            backgroundColor: 'rgba(244,166,182, 0.5)'
                        };
                    }
                }
                
                return {
                    textAlign: 'right',
                    backgroundColor: '#DFE2EA'
                };
            },
            formatter: (cell, row) => {
                if(row?.totalMinutes < row?.userMinutes){
                    return row?.totalMinutes + ' | ' + 100 + '%'
                } else {
                    if(row?.totalMinutes > 0 && row?.userMinutes > 0){
                        return row?.totalMinutes + ' | ' + ((row?.userMinutes * 100) / row.totalMinutes).toFixed(2) + '%'
                    } else {
                        return row?.totalMinutes
                    }
                }
            },
        },
        {
            dataField: "activeMinutes",
            text: t("webinar.entered"),
            sort: true,
            style: (cell, row) => {
                if(parseFloat(cell) > 0){
                    return {
                        textAlign: 'right',
                        backgroundColor: '#FFF'
                    }
                }
                
                return {
                    textAlign: 'right',
                    backgroundColor: '#DFE2EA'
                };
            },
        },
        {
            dataField: "quitMinutes",
            text: t("webinar.quit"),
            sort: true,
            style: (cell, row) => {
                if(parseFloat(cell) > 0){
                    return {
                        textAlign: 'right',
                        backgroundColor: '#FFF'
                    }
                }
                
                return {
                    textAlign: 'right',
                    backgroundColor: '#DFE2EA'
                };
            },
        },
    ];

    const init = (params) => {
        setLoading(true)
        fetchRequest(webinarCreate, 'POST', params)
            .then((res) => {
                if (res.success) {
                    const { grades = [], subjects = [] } = res;

                    setTextCenter({
                        id: 'textCenter',
                        beforeDatasetsDraw(chart){
                            const {ctx} = chart;
                            ctx.save();
                            ctx.font = 'bolder 20px Pinnacle-Bold'
                            ctx.fillStyle= 'rgb(61,63,66)'
                            ctx.textBaseLine= 'middle'
                            ctx.textAlign='center'
                            ctx.fillText((parseFloat(((70 * 100) / 120).toFixed(2) || 0)) + '%', chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y)
                        },
                    })

                    setDoughnutData({
                        datasets: [
                            {
                                label: 'Poll',
                                data: [parseFloat(80), parseFloat(100)],
                                backgroundColor: ['rgba(231,230,230,255)', 'rgba(106, 154, 208, 255)'],
                                borderWidth: 0,
                                cutout: '80%',
                                cutoutPercentage: 90,
                            },
                        ],
                    })

                    setWebinar({
                        name: 'galaa webinar',
                        createDate: '2020-20-20',
                        grade: 'Түвшин',
                        subject: 'Цахим хичээл',
                        introduction: 'Танилцуулга',
                        startDate: '2023-02-02 09:00',
                        endDate: '2023-02-02 12:00:02',
                        totalDuration: '129 минут',
                        isOpen: 1
                    })
                    setTableData([
                        {
                            id: 1,
                            gradeName: '1 level',
                            statusCode: 'STARTED',
                            statusName: 'Орсон',
                            className: '1A',
                            studentCode: 'AA22002000',
                            lastName: 'Ts 1',
                            firstName: 'Galaa 1',
                            totalMinutes: 66,
                            userMinutes: 65,
                            activeMinutes: '20:10',
                            quitMinutes: '20:10',
                        },
                        {
                            id: 2,
                            statusCode: 'STARTED',
                            statusName: 'Орсон',
                            gradeName: '1 level',
                            className: '1A',
                            studentCode: 'AA22002000',
                            lastName: 'Ts 2',
                            firstName: 'Galaa 2',
                            totalMinutes: 66,
                            userMinutes: 40,
                            activeMinutes: '20:10',
                            quitMinutes: '20:10',
                        },
                        {
                            id: 3,
                            statusCode: 'NOT_STARTED',
                            statusName: 'Ороогүй',
                            gradeName: '1 level',
                            className: '1A',
                            studentCode: 'AA22002000',
                            lastName: 'Ts',
                            firstName: 'Galaa'
                        }
                    ])
                    setTotalCount(res?.totalCount || 2)
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
        let params = {
            school: selectedSchool.id,
            id: location?.state?.id || null
        }

        init(params);
    }, []);

    const onHandlerBackButton = () => {
        history.push({
            pathname: '/webinar/index',
        })
    }

    // const onTabChange = (index, data) => {
    // }

    const renderTabs = (list) => {
        let tabs = []
        
        tabs.push({
            id: 1,
            title: t('webinar.label.users'),
            children: []
        }) 

        return tabs
    }

    const onUserInteraction = (object) => {
        setTableState(object)
    };

    return (
        <>
            <HtmlHead title={title} description={description} />

            <div className="screen-padding">
                <div className="layoutless-page">
                    <Card className="">
                        <Card.Header className="d-flex flex-row justify-content-between">
                            <Card.Title className="main-orange d-flex align-items-center" style={{marginBottom: 0}}>{(webinar?.name || '-') + ' | ' + (webinar?.createDate || '-')}</Card.Title>
                            <div style={{ position: 'relative', left: 10 }}>
                                <Button
                                    className='cancel-button pr-2'
                                    variant='link'
                                    onClick={onHandlerBackButton}
                                >
                                    <span style={{ color: '#ff2f1a' }}>{t("common.back_to_list")}</span>
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body className="body">
                            <div className="col-12">
                                <div className='main-orange fs-14 pinnacle-demi-bold'>
                                    {t('webinar.generalInfo')}
                                </div>
                            </div>
                            <div className='col-12 d-flex flex-row'>
                                <div className="col-8 h-100">
                                    <div className="card-alternate mt-3 d-flex" style={{height: 188}}>
                                        <div className="col-3"/>
                                        <div className="col-9">
                                            <table className="black-color">
                                                <tbody>
                                                    <tr>
                                                        <td className="text-right">{t('webinar.grade') + ':'}</td>
                                                        <td className="pl-3 font-weight-700">{webinar?.grade || ''}</td>
                                                    </tr>
                                                    {
                                                        webinar && !webinar?.isOpen &&
                                                        <tr>
                                                            <td className="text-right">{t('webinar.onlineLesson') + ':'}</td>
                                                            <td className="pl-3 font-weight-700">{webinar?.subject || ''}</td>
                                                        </tr>
                                                    }
                                                    <tr>
                                                        <td className="text-right">{t('webinar.introduction') + ':'}</td>
                                                        <td className="pl-3 font-weight-700">{webinar?.introduction || ''}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-right">{t('webinar.startDate') + ':'}</td>
                                                        <td className="pl-3 font-weight-700">{webinar?.startDate || ''}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-right">{t('webinar.endDate') + ':'}</td>
                                                        <td className="pl-3 font-weight-700">{webinar?.endDate || ''}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-right">{t('webinar.totalDuration') + ':'}</td>
                                                        <td className="pl-3 font-weight-700">{webinar?.totalDuration || ''}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4 h-100">
                                    <div className="card-alternate mt-3 ml-4 d-flex" style={{padding: 0, height: 188}}>
                                        {
                                            textCenter &&
                                            <div className="col-12">
                                                <div style={{height: 150}}>
                                                    <Doughnut 
                                                        data={doughnutData} 
                                                        options={doughnutOptions} 
                                                        height={160}
                                                        // plugins ={[textCenter]} 
                                                        plugins={[
                                                            textCenter,
                                                            {
                                                                id: 'drawСircles',
                                                                afterUpdate(chart) {
                                                                    const arcs = chart.getDatasetMeta(0).data;
                                                        
                                                                    arcs.forEach((arc) => {
                                                                        arc.round = {
                                                                            x: (chart.chartArea.left + chart.chartArea.right) / 2,
                                                                            y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
                                                                            radius: (arc.outerRadius + arc.innerRadius) / 1.89,
                                                                            thickness: (arc.outerRadius - arc.innerRadius) / 3,
                                                                            backgroundColor: 'rgba(106, 154, 208, 255)',
                                                                        };
                                                                    });
                                                                },
                                                                afterDraw: (chart) => {
                                                                    const {
                                                                        ctx,
                                                                    } = chart;
                                                        
                                                                    chart.getDatasetMeta(0).data.forEach((arc) => {
                                                                        const endAngle = Math.PI / 2 - arc.endAngle;
                                                        
                                                                        ctx.save();
                                                                        ctx.translate(arc.round.x, arc.round.y);
                                                                        ctx.fillStyle = 'rgba(106, 154, 208, 255)';
                                                                        ctx.beginPath();
                                                                        ctx.arc(
                                                                        arc.round.radius * Math.sin(endAngle),
                                                                        arc.round.radius * Math.cos(endAngle),
                                                                        arc.round.thickness,
                                                                        0,
                                                                        2 * Math.PI,
                                                                        );
                                                                        ctx.closePath();
                                                                        ctx.fill();
                                                                        ctx.restore();
                                                                    });
                                                                },
                                                            },
                                                        ]}
                                                    />
                                                </div>  
                                                <div className='col-12 text-center pinnacle-bold fs-16'>70 | 100</div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <TabComponent
                                    tabs={renderTabs()}
                                />
                            </div>
                            {
                                webinar && 
                                <div className="col-12">
                                    <div className="card-alternate mt-3" style={{padding: 30}}>
                                        <DTable
                                            remote
                                            config={config}
                                            columns={webinar.isOpen ? columnOpen : columnNotOpen}
                                            data={tableData}
                                            selectMode="radio"
                                            totalDataSize={totalCount}
                                            onInteraction={onUserInteraction}
                                            currentPage={tableState.page}
                                        />
                                    </div>
                                </div>
                            }
                        </Card.Body>
                    </Card>
                </div>
            </div>
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
}

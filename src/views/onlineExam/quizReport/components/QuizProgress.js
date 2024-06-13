import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

export default function QuizProgress({ data = [], colors = [], statuses = [] }) {

    const { t } = useTranslation()

    const [options, setOptions] = useState({})

    useEffect(() => {
        setOptions({
            title: {
                text: "",
            },
            chart: {
                type: "bar",
                height: 115,
                width: 300,
                spacingBottom: 10,
                spacingTop: 10,
                spacingLeft: 10,
                spacingRight: 10,
            },
            xAxis: {
                labels: {
                    enabled: false,
                },
            },
            yAxis: {
                labels: {
                    enabled: false,
                },
            },
            credits: {
                enabled: false,
            },
            labels: {
                enabled: false,
            },
            legend: {
                reversed: true,
                enabled: false,
            },
            plotOptions: {
                series: {
                    stacking: "normal",
                },
            },
            series: data,
            colors: colors,
        })
    }, [data, colors])

    return (
        <div>
            <div className="d-flex flex-row ml-4">
                <div className="text-end mt-1">
                    {
                        statuses.map(statusObj => {
                            return <div className="chart-label" key={'stat_' + statusObj?.id}>{statusObj?.name}</div>
                        })
                    }
                </div>
                {
                    data?.length > 0 && <HighchartsReact highcharts={Highcharts} options={options} />
                }                
            </div>
            <div className="d-flex flex-row chart-legend-container">
                {
                    data?.map((obj, i) => {
                        return <div key={'legend_' + i} className={i === 0 ? "d-flex flex-row mr-4" : "d-flex flex-row"}>
                            <div className="chart-legend" style={{ backgroundColor: colors[i] }} />
                            <span className="chart-legent-title">{obj?.name}</span>
                        </div>
                    })
                }
            </div>
        </div>
    );
}

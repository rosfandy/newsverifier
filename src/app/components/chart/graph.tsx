"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingBar from "react-top-loading-bar";
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { motion } from "framer-motion";

interface DataPoint {
    x: Date;
    y: number;
}

interface TimelineButton {
    id: string;
    label: string;
}

const timelineButtons: TimelineButton[] = [
    { id: 'one_month', label: '1M' },
    { id: 'three_month', label: '3M' },
    { id: 'one_year', label: '1Y' },
    { id: 'all', label: 'ALL' }
];

export default function Graph() {
    const [originalData, setOriginalData] = useState<DataPoint[]>([]);
    const [data, setData] = useState<DataPoint[]>([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [selectedRange, setSelectedRange] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setProgress(30);
            try {
                const res = await axios.get<{ tanggal: string, Terakhir: number }[]>(`${process.env.REACT_APP_HOST}/api/gold`);
                const formattedData = res.data.map(d => ({
                    x: convertDate(d.tanggal),
                    y: d.Terakhir
                }));
                setOriginalData(formattedData);
                setData(formattedData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setProgress(100);
            } finally {
                setProgress(100);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const aggregatedData = aggregateData(originalData, selectedRange);
        setData(aggregatedData);
    }, [selectedRange, originalData]);

    function aggregateData(data: DataPoint[], range: string): DataPoint[] {
        const grouped: { [key: string]: { x: Date; yTotal: number; count: number } } = {};

        let startDate = new Date();
        let endDate = new Date();

        switch (range) {
            case 'one_month':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case 'three_month':
                startDate.setMonth(startDate.getMonth() - 3);
                break;
            case 'one_year':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate = new Date(Math.min(...data.map(d => d.x.getTime())));
                endDate = new Date(Math.max(...data.map(d => d.x.getTime())));
        }

        // Prepare data points for every date in the range
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
            grouped[key] = { x: new Date(d), yTotal: 0, count: 0 };
        }

        // Aggregate actual data points
        data.forEach(point => {
            const key = `${point.x.getFullYear()}-${point.x.getMonth() + 1}-${point.x.getDate()}`;
            if (grouped[key]) {
                grouped[key].yTotal += point.y;
                grouped[key].count++;
            }
        });

        // Convert grouped data to array, skipping null entries
        return Object.values(grouped).filter(g => g.count > 0).map(({ x, yTotal, count }) => ({
            x: x,
            y: Math.round((yTotal / count) * 100) / 100
        }));
    }


    const convertDate = (dateStr: string) => {
        const parts = dateStr.split('/');
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    };

    const options: ApexOptions = {
        chart: {
            type: 'area',
            height: 350,
            zoom: {
                autoScaleYaxis: true
            },
        },
        dataLabels: {
            enabled: false
        },
        responsive: [
            {
                breakpoint: 1000,
                options: {
                    chart: {
                        width: '100%',
                        height: 300
                    }
                }
            },
            {
                breakpoint: 600,
                options: {
                    chart: {
                        width: '100%',
                        height: 200
                    },
                    xaxis: {
                        labels: {
                            show: false
                        }
                    }
                }
            }
        ],
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function (value: string, timestamp?: number) {
                    const date = new Date(timestamp!);
                    return `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })} '${date.getFullYear().toString().substr(2)}`;
                }
            }
        },
        tooltip: {
            x: {
                format: 'dd MMM \'yy'
            }
        },
        stroke: {
            curve: 'smooth'
        }
    };

    const series = [{
        name: 'Gold USD',
        data
    }];

    return (
        <div className="">
            <LoadingBar
                className="loading-bar-gradient"
                color="#c3ab5c"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            {!loading && data.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white md:px-12 md:py-12 px-4 py-8 gap-y-4 shadow-lg rounded-md flex justify-center flex-col"
                >
                    <div className="toolbar">
                        {timelineButtons.map(button => (
                            <button
                                key={button.id}
                                className={`px-2  ${selectedRange === button.id ? 'active' : ''}`}
                                onClick={() => setSelectedRange(button.id)}
                            >
                                {button.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex  flex-col  items-center">
                        <ReactApexChart options={options} series={series} type="area" height={350} width={800} />
                    </div>
                </motion.div>
            )}
        </div>
    );
}

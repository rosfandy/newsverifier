"use client"
import axios from "axios";
import { useState, useEffect, FormEvent } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamic import for ReactApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ForecastData {
    "Gold price": number;
    "Inflasi": number;
    "Minyak": number;
    "Suku bunga": number;
    "index": string;
}

export default function Forecast() {
    const [date, setDate] = useState<string>('');
    const [data, setData] = useState<ForecastData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>("Predicting");
    const [hasPredicted, setHasPredicted] = useState<boolean>(false);

    const submitData = async (e: FormEvent) => {
        e.preventDefault();

        const selectedDate = new Date(date);
        const month = selectedDate.getMonth() + 1;
        const year = selectedDate.getFullYear();

        setLoading(true);
        setLoadingText("Predicting");
        setHasPredicted(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_HOST}/api/gold/predict`, {
                month,
                year
            });
            if (response.data && response.data.length > 0) {
                setData(response.data);
            } else {
                setData(null);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (loading) {
            intervalId = setInterval(() => {
                setLoadingText(prev => {
                    if (prev.length > 12) return "Predicting";
                    return prev + ".";
                });
            }, 500);
        }

        return () => clearInterval(intervalId);
    }, [loading]);

    const chartOptions: ApexOptions = {
        chart: {
            type: 'line',
            height: 350,
            zoom: {
                enabled: false
            }
        },
        title: {
            text: 'Gold Price Forecast',
            align: 'left'
        },
        xaxis: {
            type: 'datetime',
            categories: data ? data.map(d => d.index) : []
        },
        yaxis: {
            title: {
                text: 'Price (USD)'
            },
            labels: {
                formatter: function (value: number) {
                    return value.toFixed(2); // Set decimal places to 2
                }
            }
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
    };

    const chartSeries = [
        {
            name: 'Gold Price',
            data: data ? data.map(d => d["Gold price"]) : []
        }
    ];

    return (
        <div className="">
            <div className="flex flex-col md:px-32 px-8 gap-y-4">
                <h1 className="md:text-2xl font-[500]">Forecast</h1>
                <div className="bg-white shadow-md rounded-md p-4">
                    <div className="flex justify-center">
                        <h1>Masukkan tanggal prediksi harga emas</h1>
                    </div>
                    <div className="px-8 py-4 flex justify-center">
                        <form className="flex md:gap-x-2 md:gap-y-0 gap-y-2 md:flex-row flex-col" onSubmit={submitData}>
                            <input className="border px-4 rounded" type="month" name="datetime"
                                value={date}
                                onChange={e => setDate(e.target.value)} />
                            <button type="submit" className="bg-[#c3ab5c] md:px-6 px-2 py-2 rounded text-white text-xs hover:bg-[#897841] duration-200">Predict</button>
                        </form>
                    </div>
                    {loading && (
                        <div className="flex justify-center">{loadingText}</div>
                    )}
                    {hasPredicted && !loading && !data && (
                        <div className="flex justify-center">No result predict</div>
                    )}
                    {data && (
                        <div className="flex justify-center gap-x-4">
                            <ReactApexChart
                                options={chartOptions}
                                series={chartSeries}
                                type="line"
                                height={350}
                                width={850}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

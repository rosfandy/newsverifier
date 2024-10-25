"use client"
import axios from "axios";
import { useState, useEffect, FormEvent } from "react";

// Dynamic import for ReactApexChart

interface NewsData {
    "title": string;
    "prediction": string;
    "accuracy": number;
}

export default function Forecast() {
    const [url, setUrl] = useState<string>('');
    const [data, setData] = useState<NewsData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>("Predicting");
    const [hasPredicted, setHasPredicted] = useState<boolean>(false);

    const submitData = async (e: FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setLoadingText("Analyzing");
        setHasPredicted(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_HOST}/api/news/analyze`, {
                url
            });
            console.log(response.data)
            setData(response.data);

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
                    if (prev.length > 12) return "Analyzing";
                    return prev + ".";
                });
            }, 500);
        }

        return () => clearInterval(intervalId);
    }, [loading]);

    return (
        <div className="">
            <div className="flex flex-col md:px-32 px-8 gap-y-4 justify-center items-center min-h-[50vh]">
                <h1 className="md:text-2xl font-[500] text-center text-white">Analyzer</h1>
                <div className="bg-white shadow-md rounded-md p-4">
                    <div className="flex justify-center">
                        <h1>Masukkan url berita</h1>
                    </div>
                    <div className="px-8 py-4 flex justify-center">
                        <form className="flex md:gap-x-2 md:gap-y-0 gap-y-2 md:flex-row flex-col" onSubmit={submitData}>
                            <input className="border px-4 rounded" type="text" name="url"
                                value={url}
                                onChange={e => setUrl(e.target.value)} />
                            <button type="submit" className="bg-blue-500 md:px-6 px-2 py-2 rounded text-white text-xs hover:bg-[#897841] duration-200">Analyze</button>
                        </form>
                    </div>
                    {loading && (
                        <div className="flex justify-center">{loadingText}</div>
                    )}
                    {hasPredicted && !loading && !data && (
                        <div className="flex justify-center">No result to predict</div>
                    )}
                    {data && (
                        <div className="flex justify-center md:text-[16px] text-[12px]">
                            <div className="flex flex-col justify-center gap-x-4">
                                <div className="flex flex-col md:text-center text-gray-400 ">
                                    Title
                                    <div className="flex text-black font-semibold md:text-[18px] md:justify-center"><span>{data.title}</span></div>
                                </div>
                                <div className="flex flex-col md:text-center text-gray-400 ">
                                    Result
                                    <div className="flex text-black font-semibold md:text-[18px] md:justify-center"><span>{data.prediction}</span></div>
                                </div>
                                <div className="flex flex-col md:text-center text-gray-400 ">
                                    Accuracy
                                    <div className="flex text-black font-semibold md:text-[18px] md:justify-center"><span>{data.accuracy}</span></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

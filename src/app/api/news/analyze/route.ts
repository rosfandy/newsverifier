import axios from 'axios';
import { NextRequest } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: NextRequest) {
    if (req.method !== "POST")
        return new Response(null, { status: 404, statusText: "Not Found" });
    try {
        const json = await req.json();
        const title = await fetchTitleFromUrl(json.url);
        const res = await predict(title);
        console.log(res);
        return new Response(JSON.stringify(res), { status: 200 });
    } catch (e) {
        console.log(e);
        return new Response(null, { status: 400, statusText: "Bad Request" });
    }
}

const fetchTitleFromUrl = async (url: string): Promise<string> => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const title = $('title').text();
        return title;
    } catch (error) {
        console.error("Error fetching title:", error);
        throw new Error("Failed to fetch title from URL");
    }
};

const predict = async (title: string) => {
    try {
        const response = await axios.post(`${process.env.FLASK_APP_HOST}/predict`, {
            news_title: title
        });
        return response.data;
    } catch (err) {
        console.error("Error predicting:", err);
        throw new Error("Prediction failed");
    }
};

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

interface Data {
    [key: string]: string | number;
}

export async function GET(): Promise<NextResponse> {
    const results: Data[] = [];
    const filePath = path.resolve('./public/dataset/data_gold.csv');

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data: Data) => {
                const parsedData: Data = {};

                for (const key in data) {
                    let value = data[key];
                    if (typeof value === 'string') {
                        value = value.replace(/"/g, '');
                        if (key.trim().toLowerCase() === 'tanggal' || key.trim().toLowerCase() === '"tanggal"') {
                            parsedData['tanggal'] = value;
                        } else {
                            value = value.replace(/\./g, '').replace(/,/g, '.');
                            if (!isNaN(parseFloat(value))) {
                                parsedData[key] = parseFloat(value);
                            } else {
                                parsedData[key] = value;
                            }
                        }
                    } else {
                        parsedData[key] = value;
                    }
                }

                results.push(parsedData);
            })
            .on('end', () => {
                resolve(NextResponse.json(results));
            })
            .on('error', (error) => {
                reject(NextResponse.json({ error: 'Failed to read CSV file' }));
            });
    });
}

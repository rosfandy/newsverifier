import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

function Areachart() {
    return (
        <React.Fragment>
            <div className="container-fluid mb-3 mt-3">
                <h2>Areachart Github Style</h2>
                <Chart
                    type="area"
                    width={1380}
                    height={550}

                    series={[
                        {
                            name: "Commits",
                            data: [345, 27, 121, 676, 98, 321]
                        }
                    ]}

                    options={{
                        title: {
                            text: "Areachart Github Style",
                            style: { fontSize: 20 }
                        },

                        colors: ['#f90000'],
                        stroke: { width: 3, curve: 'smooth' },

                        xaxis: {
                            title: {
                                text: "Commit in Year",
                                style: { fontSize: 20, color: '#f90000' }
                            },
                            categories: [2005, 2006, 2007, 2008, 2009, 2010]
                        },
                        yaxis: {
                            title: {
                                text: "No of Commits",
                                style: { fontSize: 20 }
                            }
                        }
                    }}
                >
                </Chart>
            </div>
        </React.Fragment>
    );
}
export default Areachart;
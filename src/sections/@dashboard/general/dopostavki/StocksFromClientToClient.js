import {useEffect, useState} from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import {Box, Card, CardHeader, CircularProgress, TextField} from '@mui/material';
// components
import {chartOptionsMonth, chartOptionsYear} from "./Util";
import {BaseOptionChart} from "../../../../components/chart";
import axios from "../../../../utils/axios";

// ----------------------------------------------------------------------

// EXAMPLE
// const CHART_DATA = [
//     {
//         filter: "По месяцам",
//         data: [
//             { name: 'Выполнено', type: 'column', data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 99] },
//             { name: 'Отменено',type: 'area', data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 99] },
//             { name: 'В работе', type: 'line', data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 99] }
//         ],
//     },
//     {
//         filter: "По дням",
//         data: [
//             { name: 'Выполнено', type: 'column', data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
//             { name: 'Отменено',type: 'area', data: [12, 34, 62, 23, 95, 22, 24, 99, 11, 13, 12, 34, 62, 23, 95, 22, 24, 99, 11, 13, 12, 34, 62, 23, 95, 22, 24, 99, 11, 13] },
//             { name: 'В работе', type: 'line', data: [77, 22, 34, 55, 66, 77, 17, 91, 12, 10, 77, 22, 34, 55, 66, 77, 17, 91, 12, 10, 77, 22, 34, 55, 66, 77, 17, 91, 12, 10] }
//         ],
//     },
// ];


export default function StocksFromClientToClient({graphData}) {
    const [seriesData, setSeriesData] = useState("По месяцам")

    const handleChangeSeriesData = (event) => {
        setSeriesData(event.target.value);
    };
    return (
        <Card>
            {graphData.isLoading && <CircularProgress size={24} style={{marginLeft: 15, position: 'block', top: 4}}/>}
            <CardHeader
                title="Статистика остатков"
                subheader=""
                action={
                    <TextField
                        select
                        fullWidth
                        value={seriesData}
                        SelectProps={{native: true}}
                        onChange={handleChangeSeriesData}
                        sx={{
                            '& fieldset': {border: '0 !important'},
                            '& select': {pl: 1, py: 0.5, pr: '24px !important', typography: 'subtitle2'},
                            '& .MuiOutlinedInput-root': {borderRadius: 0.75, bgcolor: 'background.neutral'},
                            '& .MuiNativeSelect-icon': {top: 4, right: 0, width: 20, height: 20},
                        }}
                    >
                        {graphData.data.map((option) => (
                            <option key={option.filter} value={option.filter}>
                                {option.filter}
                            </option>
                        ))}
                    </TextField>
                }/>

            {graphData.data.map((item) => (
                <Box key={item.filter} sx={{mt: 3, mx: 3}} dir="ltr">
                    {item.filter === seriesData && (
                        <ReactApexChart type="area" series={item.data}
                                        options={seriesData === 'По месяцам' ? chartOptionsYear(BaseOptionChart()) : chartOptionsMonth(BaseOptionChart())}
                                        height={364}/>
                    )}
                </Box>
            ))}
        </Card>
    );
}

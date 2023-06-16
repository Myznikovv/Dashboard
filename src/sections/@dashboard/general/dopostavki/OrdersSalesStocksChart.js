import {useEffect, useState} from 'react';
import ReactApexChart from 'react-apexcharts';

// @mui
import {Box, Card, CardHeader, CircularProgress, TextField} from '@mui/material';
// components
import axios from '../../../../utils/axios'
import {chartOptionsMonth, chartOptionsYear} from "./Util";
import {BaseOptionChart} from "../../../../components/chart";


function postFilter(someData) {
    // CHARTDATA
    someData.forEach(chart => {
        chart.data.forEach(rowData => {
            const arrayOfChartsValues = rowData.data;
            arrayOfChartsValues[arrayOfChartsValues.length - 1] =
                arrayOfChartsValues[arrayOfChartsValues.length - 1] === 0 ?
                    arrayOfChartsValues[arrayOfChartsValues.length - 2] :
                    arrayOfChartsValues[arrayOfChartsValues.length - 1];
        })
    })
    return someData;
}

export default function OrdersSalesStocksChart() {
    const [seriesData, setSeriesData] = useState("По месяцам")
    const [CHART_DATA, setChart] = useState({
        data: [{filter: "По месяцам", data: []}],
        isLoading: true
    })

    useEffect(() => {
        axios.get('/api/data/get_orders_sales_stocks_chart').then(response => setChart(
                {
                    data: postFilter(response.data),
                    isLoading: false
                }))}, []);

    const handleChangeSeriesData = (event) => {
        setSeriesData(event.target.value);
    };

    return (
        <Card>
            {(CHART_DATA.isLoading) &&
            <CircularProgress size={24} style={{marginLeft: 15, position: 'block', top: 4}}/>}
            <CardHeader
                title="Заказы, продажи, остатки"
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
                        {CHART_DATA.data.map((option) => (
                            <option key={option.filter} value={option.filter}>
                                {option.filter}
                            </option>
                        ))}
                    </TextField>
                }/>

            {CHART_DATA.data.map((item) => (
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



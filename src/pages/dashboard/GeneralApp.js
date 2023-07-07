// @mui
import axios from 'axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { Button, Card, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState, useRef, useCallback } from "react";
import { StocksFromClientToClient, TableDopostavki } from '../../sections/@dashboard/general/dopostavki';
// hooks

import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';

// sections
import CustomOptions from "../../sections/@dashboard/general/dopostavki/CustomOptions";


import {
    getUniqueArticles,
    getUniqueBrands,
    getUniqueCategories,
    getuniqueSubjects,
    getUniqueTechSizes,
    isPresent
} from "../../sections/@dashboard/general/dopostavki/Util";
import useLocalStorage from "../../hooks/useLocalStorage";
																					 
import Iconify from "../../components/Iconify";
import { AppWidgetSummary } from "../../sections/@dashboard/general/app";
										   
import AppWelcomeVideo from "../../sections/@dashboard/general/app/AppWelcomeVideo";
											



// ----------------------------------------------------------------------
const _baseUrl = "https://ideav.online/api/magnet";



export default function GeneralApp() {

    const isMounted = useIsMountedRef();
    // const { user } = useAuth();
    //    const theme = useTheme();
    const { themeStretch } = useSettings();
    const [settings, setSettings] = useLocalStorage(`customOptions_${localStorage.getItem('accessToken')}`, {});
    const [warehouseName, setWarehouseName] = useState([{ label: 'Все', key: '%' }]);
    const [dashboardData, setDashboardData] = useState([]);
    const [chosedWarehouse, setChosedWarehouse] = useState("%");
    const [tableDataState, setTableDataState] = useState({
        data: null,
        isLoading: true,
    })
    const [graphData, setGraphData] = useState({
        data: [{ filter: "По месяцам", data: [] }],
        isLoading: true
    })

    const getInfo = async (url) => {

        try {
            const response = await axios.get(`${_baseUrl}${url}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': localStorage.getItem('accessToken'),
                },
            });

            return response;
        } catch (error) {
            // Обработка ошибок
        }
    };

    const postInfo = async (url, params) => {

        try {
            const response = await axios.post(`${_baseUrl}${url}`, params, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': localStorage.getItem('accessToken'),
                },
            });

            return response;
        } catch (error) {
            // Обработка ошибок
        }
    };


    const getDataTable = async (value) => {
        startDownloadState();
        await postInfo(`/report/42928?FR_warehouseID=${value}&JSON_KV`,
            {
                loadedDayCount: settings?.loadedDayCount || 30,
                warehouseName: value,
                //            lackOfGoodsMonth: isPresent(settings?.lackOfGoodsMonth) ? settings.lackOfGoodsMonth : false,
                //            lackOfGoodsQuarter: isPresent(settings?.lackOfGoodsQuarter) ? settings.lackOfGoodsQuarter : false,
                //            lackOfGoodsWeek: isPresent(settings?.lackOfGoodsWeek) ? settings.lackOfGoodsWeek : false,
                lackOfGoodsTotal: isPresent(settings?.lackOfGoodsTotal) ? settings.lackOfGoodsTotal : false,
                useRepurchasePercent: isPresent(settings?.useRepurchasePercent) ? settings.useRepurchasePercent : false,
                useMaxDemandRate: isPresent(settings?.useMaxDemandRate) ? settings.useMaxDemandRate : false,
                dopostavkaDate: settings?.dopostavkaDate || new Date().toISOString(),
                selectedArticles: settings.selectedArticles,
                selectedBrands: settings.selectedBrands,
                selectedCategories: settings.selectedCategories,
                selectedSubjects: settings.selectedSubjects,
                selectedTechSizes: settings.selectedTechSizes,
            })
            .then(response => {
                setTableDataState({
                    data: response.data,
                    isLoading: false
                })
                setCustomOptionsState({
                    ...customOptionsState,
                    uniqueBrands: getUniqueBrands(response.data),
                    uniqueCategories: getUniqueCategories(response.data),
                    uniqueSubjects: getuniqueSubjects(response.data),
                    uniqueArticles: getUniqueArticles(response.data),
                    uniqueTechSizes: getUniqueTechSizes(response.data),
                    isLoading: false
                })
            })
    }
    const getDataDashboard = useCallback(async (value) => {
        await getInfo(`/report/62934?FR_warehouseID=${value}&JSON_KV`)
            .then(response => {
                const result = Number(getTotalInfoFromDashboardData(response.data, "Излишек", chosedWarehouse));
                console.log(result)
                setDashboardData(response.data)

                return response.data;
            })
    }, [chosedWarehouse]) 

    const getWarehouse = async () => {
        await getInfo('/report/62941')
            .then(response => {
                console.log(response)
                if (response.data.data) {
                    Array.from({ length: response.data.data[0].length }).map((item, index) => {
                        setWarehouseName((prevState) => [...prevState, { label: response.data.data[0][index], key: response.data.data[2][index] }])
                        return 0
                    })
                }
            })
    }

    const getToken = (() => {
        getWarehouse();
        getDataDashboard(chosedWarehouse);
									  
							 
    })


    useEffect(() => {

        getToken();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);





    function getTotalInfoFromDashboardData(someData, name, chosedWarehouse) {


        if (chosedWarehouse === '%') {
            const result = someData.reduce((sum, item) => sum + Number(item[name]), 0)
            return result
        }
        let index = 0;
        if (name === "Остатки на складе") {
            index = 0;
        } else if (name === "Упущенные продажи") {
            index = 1;
        } else if (name === "Требуется допоставить") {
            index = 2;
        } else if (name === "Излишек") {
            index = 3
        }
        console.log(someData[0][name])

        if (!someData) return 0
        return someData[0][name]
    }


    const saveToLocalStorage = (values) => {
        setSettings({
            ...settings,
            ...values
        })
    };

   
									 
															   
				  
    const [customOptionsState, setCustomOptionsState] = useState({
        uniqueBrands: null,
        uniqueCategories: null,
        uniqueSubjects: null,
        uniqueArticles: null,
        uniqueTechSizes: null,
        isLoading: true,
    })
    useEffect(() => {
        getDataTable(chosedWarehouse)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings])

    function handleChoseWareHouse(value) {
        setChosedWarehouse(value);
        getDataDashboard(value);
        getDataTable(value)
    }

    function startDownloadState() {
        setTableDataState({
            data: null,
            isLoading: true
        })

        setGraphData({
            data: [{ filter: "По месяцам", data: [] }],
            isLoading: true
        })
    }

    function searchInResultData(tableDataState) {
        if (!tableDataState || !tableDataState.data) return tableDataState;
        const { selectedArticles, selectedBrands, selectedCategories, selectedSubjects, selectedTechSizes } = settings;

        const result = []
        result.data = tableDataState.data.filter(currentRow => {
            let match = true;
            if (match && selectedArticles && (selectedArticles.length > 0)) match = selectedArticles.some(v => v && v.toString().includes(currentRow.supplierArticle));
            if (match && selectedBrands && (selectedBrands.length > 0)) match = selectedBrands.some(v => v && v.toString().includes(currentRow.brand));
            if (match && selectedCategories && (selectedCategories.length > 0)) match = selectedCategories.some(v => v && v.toString().includes(currentRow.category));
            if (match && selectedSubjects && (selectedSubjects.length > 0)) match = selectedSubjects.some(v => v && v.toString().includes(currentRow.subject));
            if (match && selectedTechSizes && (selectedTechSizes.length > 0)) match = selectedTechSizes.some(v => v && v.toString().includes(currentRow.techSize));

            return match;
        })

        return result;
    }



    return (
        <Page title="ЛК сервиса сквозной аналитики MagnetX">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Grid item xs={12} md={8}>
                    <AppWelcomeVideo text={'Видео-инструкция'} />
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12} py={2} my={2}>

                        <Card sx={{ py: 3, px: 3 }}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, mb: 5 }}>
                                <Typography variant="subtitle1" component="span">
                                    Шаг 1. Выберите склад для которого необходимо рассчитать статистику и допоставку
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ flexGrow: 1 }}>
                                {warehouseName.map((value) => (
                                    <Button value={value.key} key={value.key}
                                        onClick={(e) => handleChoseWareHouse(e.target.value)}
                                        style={value.key === chosedWarehouse ? {} : {
                                            color: '#888888',
                                            borderColor: '#888888'
                                        }}
                                        variant={value.key === chosedWarehouse ? "contained" : "outlined"}
                                        endIcon={value.key === chosedWarehouse ?
                                            <Iconify icon={'eva:checkmark-circle-2-fill'} /> : null}>
                                        {value.label}
                                    </Button>
                                ))}
                            </Stack>

                        </Card>
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <AppWidgetSummary
                            title="Общие остатки"
                            image="/images/ostatki.svg"
                            total={Number(getTotalInfoFromDashboardData(dashboardData, "Остатки на складе", chosedWarehouse))}
                            unit="шт."
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <AppWidgetSummary
                            title="Упущенные продажи"
                            image="/images/upushennie_prodaji.png"
                            total={Number(getTotalInfoFromDashboardData(dashboardData, "Упущенные продажи", chosedWarehouse))}
                            unit="шт."
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <AppWidgetSummary
                            title="Требуется допоставить"
                            image="/images/for_dopostavka.png"
                            total={Number(getTotalInfoFromDashboardData(dashboardData, "Требуется допоставить", chosedWarehouse))}
                            unit="шт."
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <AppWidgetSummary
                            title="Излишек"
                            image="/images/izlishek.png"
                            total={Number(getTotalInfoFromDashboardData(dashboardData, "Излишек", chosedWarehouse))}
                            unit="шт."
                        />
                    </Grid>


                    {/* <Grid item xs={12} md={12} lg={12}>
                            <Card sx={{ display: 'flex', alignItems: 'center', p: 3, border: "dashed red" }}>
                                <Stack direction="row" alignItems="center">
                                    <CircularProgress size={24} style={{
                                        marginLeft: 5,
                                        marginRight: 20,
                                        position: 'relative',
                                        top: 0
                                    }} />
                                    <Typography variant="subtitle1" component="span">
                                        Собираем статистику. <br />
                                        Первичный сбор занимает до 30 минут. <br />Дальнейшие обновления ,как правило, не
                                        более 2-3 минут. <br /> После обновления достаточно
                                        перезагрузить страницу. <br />
                                    </Typography>
                                </Stack>

                            </Card>
                        </Grid> */}

                    <Grid item xs={12} md={12} lg={12}>
                        <CustomOptions customOptionsState={customOptionsState}
                            settings={settings}
                            onChange={(values) => {
                                saveToLocalStorage(values);
                            }}
                        />
                    </Grid>

                    {/* <Grid item xs={12} md={12} lg={12}> */}
                    {/*    <OrdersSalesStocksChart/> */}
                    {/* </Grid> */}

                    {/* <Grid item xs={12} md={12} lg={6}> */}
                    {/*    <OrdersChart/> */}
                    {/* </Grid> */}

                    {/* <Grid item xs={12} md={12} lg={6}> */}
                    {/*    <CancelRejectionReturnChart/> */}
                    {/* </Grid> */}


                    {/* <Grid item xs={12} md={12} lg={12}>
                        <StocksFromClientToClient graphData={graphData} />
                    </Grid> */}

                    <Grid item xs={12} md={12} lg={12}>
                        <TableDopostavki tableDataState={searchInResultData(tableDataState)} />
                    </Grid>

                </Grid>
            </Container>
        </Page>
    );
}


// const getData = (value) => {
//         startDownloadState();
//          axios.post('/api/data/get_table_data', {
        //     loadedDayCount: settings?.loadedDayCount || 30,
        //     warehouseName: value,
        // //            lackOfGoodsMonth: isPresent(settings?.lackOfGoodsMonth) ? settings.lackOfGoodsMonth : false,
        // //            lackOfGoodsQuarter: isPresent(settings?.lackOfGoodsQuarter) ? settings.lackOfGoodsQuarter : false,
        // //            lackOfGoodsWeek: isPresent(settings?.lackOfGoodsWeek) ? settings.lackOfGoodsWeek : false,
        //     lackOfGoodsTotal: isPresent(settings?.lackOfGoodsTotal) ? settings.lackOfGoodsTotal : false,
        //     useRepurchasePercent: isPresent(settings?.useRepurchasePercent) ? settings.useRepurchasePercent : false,
        //     useMaxDemandRate: isPresent(settings?.useMaxDemandRate) ? settings.useMaxDemandRate : false,
        //     dopostavkaDate: settings?.dopostavkaDate || new Date().toISOString(),
        // })

//             .then(response => {
//                 setTableDataState({
//                     data: response.data.data,
//                     isLoading: false
//                 })
//                 setCustomOptionsState({
//                     ...customOptionsState,
//                     uniqueBrands: getUniqueBrands(response.data.data),
//                     uniqueCategories: getUniqueCategories(response.data.data),
//                     uniqueSubjects: getuniqueSubjects(response.data.data),
//                     uniqueArticles: getUniqueArticles(response.data.data),
//                     uniqueTechSizes: getUniqueTechSizes(response.data.data),
//                     isLoading: false
//                 })
//             })

//         axios.post('/api/data/get_stocks_fromclient_toclient_chart', {
//             warehouseName: value,
//             selectedArticles: settings.selectedArticles,
//             selectedBrands: settings.selectedBrands,
//             selectedCategories: settings.selectedCategories,
//             selectedSubjects: settings.selectedSubjects,
//             selectedTechSizes: settings.selectedTechSizes,
//         }).then(response => setGraphData(
//             {
//                 data: response.data,
//                 isLoading: false
//             }))
//     };

    // useEffect(() => {
    //     // if (auth) {
    //     //     getData(chosedWarehouse);
    //     // } else {
    //     //     // Authorise();
    //     // }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [settings, chosedWarehouse]);

    // function getTotalInfoFromGraphData(someData, name) {
    //     if (someData.isLoading) return 0;
    //     let index = 0;
    //     if (name === "Остатки на складе") {
    //         index = 0;
    //     } else if (name === "Едут от клиента") {
    //         index = 1;
    //     } else if (name === "Едут к клиенту") {
    //         index = 2;
    //     } else if (name === "Упущенные продажи") {
    //         return someData.data.reduce((sum, current) => {
    //             const val = parseInt(current[27], 10);
    //             if (Number.isInteger(val)) return sum + val;
    //             return sum;
    //         }, 0);
    //     } else if (name === "Требуется допоставить") {
    //         return someData.data.reduce((sum, current) => {
    //             const val = parseInt(current[9], 10);
    //             if (Number.isInteger(val)) return sum + val;
    //             return sum;
    //         }, 0);
    //     } else if (name === "Излишек") {
    //         return someData.data.reduce((sum, current) => {
    //             const val = parseInt(current[11], 10);
    //             if (Number.isInteger(val)) return sum + val;
    //             return sum;
    //         }, 0);
    //     }

    //     const { data } = someData.data[1].data[index];

    //     return data[data.length - 1];
    // }
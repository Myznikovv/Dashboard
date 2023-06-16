import PropTypes from 'prop-types';
import {useMemo} from 'react';
import {useSnackbar} from 'notistack';
// form
import {Controller, useForm} from 'react-hook-form';
// @mui
import {
    Button,
    Card,
    CircularProgress,
    Grid,
    IconButton,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import {alpha} from "@mui/material/styles";
import styled from "@emotion/styled";
import {LocalizationProvider, MobileDatePicker} from "@mui/lab";
import {ru} from "date-fns/esm/locale";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {FormProvider, RHFSwitch} from "../../../../components/hook-form";
import RHFInteger from "../../../../components/hook-form/RHFInteger";
import RHFMultiSelect from "../../../../components/hook-form/RHFMultiSelect";
import {isPresent} from "./Util";
import {IconButtonAnimate} from "../../../../components/animate";
import Iconify from "../../../../components/Iconify";


// ----------------------------------------------------------------------

CustomOptions.propTypes = {
    isEdit: PropTypes.bool,
    currentUser: PropTypes.object,
};


const IconWrapperStyle = styled('div')(({theme}) => ({
    width: 24,
    height: 24,
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.warning.main,
    backgroundColor: alpha(theme.palette.warning.main, 0.16),
}));

export default function CustomOptions({customOptionsState, settings, onChange}) {

    const {enqueueSnackbar} = useSnackbar();

    const defaultValues = useMemo(
        () => ({
//            lackOfGoodsMonth: isPresent(settings?.lackOfGoodsMonth) ? settings.lackOfGoodsMonth : false,
//            lackOfGoodsQuarter: isPresent(settings?.lackOfGoodsQuarter) ? settings.lackOfGoodsQuarter : false,
//            lackOfGoodsWeek: isPresent(settings?.lackOfGoodsWeek) ? settings.lackOfGoodsWeek : false,
            lackOfGoodsTotal: isPresent(settings?.lackOfGoodsTotal) ? settings.lackOfGoodsTotal : false,
            useRepurchasePercent: isPresent(settings?.useRepurchasePercent) ? settings.useRepurchasePercent : false,
            useMaxDemandRate: isPresent(settings?.useMaxDemandRate) ? settings.useMaxDemandRate : false,
            selectedArticles: settings?.selectedArticles || [],
            selectedBrands: settings?.selectedBrands || [],
            selectedCategories: settings?.selectedCategories || [],
            selectedSubjects: settings?.selectedSubjects || [],
            selectedTechSizes: settings?.selectedTechSizes || [],
            loadedDayCount: settings?.loadedDayCount || 30,
            dopostavkaDate: settings?.dopostavkaDate || new Date().toISOString(),
        }),
        [settings]
    );

    const resetValues = {
//        lackOfGoodsMonth: false,
//        lackOfGoodsQuarter: false,
//        lackOfGoodsWeek: false,
        lackOfGoodsTotal: false,
        useRepurchasePercent: false,
        useMaxDemandRate: false,
        selectedArticles: [],
        selectedBrands: [],
        selectedCategories: [],
        selectedSubjects: [],
        selectedTechSizes: [],
        loadedDayCount: 30,
        dopostavkaDate: new Date().toISOString(),
    };


    const methods = useForm({defaultValues});

    const {
        handleSubmit,
        control,
        formState: {isSubmitting},
        reset,
    } = methods;


    const onSubmit = async (values) => {
        try {
            await onChange(values);
            enqueueSnackbar('Данные сохранены');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{py: 3, px: 3}}>
                {!customOptionsState || customOptionsState.isLoading &&
                <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}}/>}
                <Grid container spacing={3} sx={{display: customOptionsState.isLoading ? "none" : "flex"}}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{mt: 2, mb: 2}}>
                            <Typography component="span" variant="subtitle1">
                                Шаг 2. Укажите параметры для расчета допоставки
                            </Typography>
                        </Stack>
                    </Grid>

                    {/* <Grid item xs={12} sm={6} md={6} lg={4}> */}
                    {/*    <RHFMultiSelect name="selectedWarehouses" label="Склады" placeholder="Склады" */}
                    {/*                    allValues={customOptionsState.uniqueWarehouses}> */}
                    {/*        <option value=""/> */}
                    {/*    </RHFMultiSelect> */}
                    {/* </Grid> */}
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <RHFMultiSelect name="selectedArticles" label="Артикул" placeholder="Артикул"
                                        allValues={customOptionsState.uniqueArticles}>
                            <option aria-label='selectedArticles' value=""/>
                        </RHFMultiSelect>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <RHFMultiSelect  name="selectedBrands" label="Бренд" placeholder="Бренд"
                                        allValues={customOptionsState.uniqueBrands}>
                            <option aria-label='selectedBrands' value=""/>
                        </RHFMultiSelect>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <RHFMultiSelect name="selectedCategories" label="Категория" placeholder="Категория"
                                        allValues={customOptionsState.uniqueCategories}>
                            <option aria-label='selectedCategories' value=""/>
                        </RHFMultiSelect>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <RHFMultiSelect name="selectedSubjects" label="Название" placeholder="Название"
                                        allValues={customOptionsState.uniqueSubjects}>
                            <option  aria-label='selectedSubjects' value=""/>
                        </RHFMultiSelect>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <RHFMultiSelect name="selectedTechSizes" label="Размер" placeholder="Размер"
                                        allValues={customOptionsState.uniqueTechSizes}>
                            <option  aria-label='selectedTechSizes' value=""/>
                        </RHFMultiSelect>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <RHFInteger name="loadedDayCount" label="На сколько дней загружаем склад"
                                    placeholder="На сколько дней загружаем склад"/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <Controller
                            name="dopostavkaDate"
                            control={control}
                            render={({field}) => (
                                <LocalizationProvider locale={ru} dateAdapter={AdapterDateFns}>
                                    <MobileDatePicker
                                        {...field}
                                        minDate={new Date()}
                                        toolbarTitle="Выберите дату допоставки"
                                        label="Дата допоставки"
                                        cancelText="Отмена"
                                        placeholder="Дата допоставки"
                                        renderInput={(params) => <TextField {...field} {...params} fullWidth/>}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Paper> </Paper>
                    </Grid>
                    {/* <Grid item xs={12} sm={6} md={6} lg={4}> */}
                    {/*    <RHFSwitch */}
                    {/*        name="lackOfGoodsQuarter" */}
                    {/*        labelPlacement="end" */}
                    {/*        label={ */}
                    {/*            <> */}
                    {/*                <Typography variant="body2" sx={{color: 'text.secondary'}}> */}
                    {/*                    С учетом отсутствия товара (квартал) */}
                    {/*                </Typography> */}
                    {/*            </> */}
                    {/*        } */}
                    {/*        sx={{mx: 0, width: 1}} */}
                    {/*    /> */}
                    {/* </Grid> */}
                    {/* <Grid item xs={12} sm={6} md={6} lg={4}> */}
                    {/*    <RHFSwitch */}
                    {/*        name="lackOfGoodsMonth" */}
                    {/*        labelPlacement="end" */}
                    {/*        label={ */}
                    {/*            <> */}
                    {/*                <Typography variant="body2" sx={{color: 'text.secondary'}}> */}
                    {/*                    С учетом отсутствия товара (месяц) */}
                    {/*                </Typography> */}
                    {/*            </> */}
                    {/*        } */}
                    {/*        sx={{mx: 0, width: 1}} */}
                    {/*    /> */}
                    {/* </Grid> */}
                    {/* <Grid item xs={12} sm={6} md={6} lg={4}> */}
                    {/*    <RHFSwitch */}
                    {/*        name="lackOfGoodsWeek" */}
                    {/*        labelPlacement="end" */}
                    {/*        label={ */}
                    {/*            <> */}
                    {/*                <Typography variant="body2" sx={{color: 'text.secondary'}}> */}
                    {/*                    С учетом отсутствия товара (неделя) */}
                    {/*                </Typography> */}
                    {/*            </> */}
                    {/*        } */}
                    {/*        sx={{mx: 0, width: 1}} */}
                    {/*    /> */}
                    {/* </Grid> */}
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <RHFSwitch
                            name="lackOfGoodsTotal"
                            labelPlacement="end"

                            label={
                                <>
                                    <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                        С учетом отсутствия товара  на складе
                                        <Tooltip  title={<h2 style={{ color: "lightblue" }}>Включить в расчет дни, когда товара не было на складе</h2>} >
                                            <IconButton>
                                                <Iconify icon={'eva:question-mark-circle-fill'} sx={{ width: 20, height: 20 }}/>
                                            </IconButton>
                                        </Tooltip>
                                    </Typography>
                                </>
                            }

                            sx={{mx: 0, width: 1}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <RHFSwitch
                            name="useRepurchasePercent"
                            labelPlacement="end"
                            label={
                                <>
                                    <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                        Учитывать % выкупа товара
                                        <Tooltip  title={<h2 style={{ color: "lightblue" }}>Учесть % выкупа товара, чтобы не перезагрузить склад</h2>} >
                                            <IconButton>
                                                <Iconify icon={'eva:question-mark-circle-fill'} sx={{ width: 20, height: 20 }}/>
                                            </IconButton>
                                        </Tooltip>
                                    </Typography>
                                </>
                            }
                            sx={{mx: 0, width: 1}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <RHFSwitch
                            name="useMaxDemandRate"
                            labelPlacement="end"
                            label={
                                <>
                                    <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                        Загрузить склад с учётом макс. спроса
                                        <Tooltip  title={<h2 style={{ color: "lightblue" }}>Включите если на Ваш товар есть растущий или стабильный спрос. Если товар сезонный и спрос снижается оставьте фильтр выключенным</h2>} >
                                            <IconButton>
                                                <Iconify icon={'eva:question-mark-circle-fill'} sx={{ width: 20, height: 20 }}/>
                                            </IconButton>
                                        </Tooltip>
                                    </Typography>
                                </>
                            }
                            sx={{mx: 0, width: 1}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Stack direction="row" alignItems="flex-end" sx={{mt: 3}} spacing={1.5}>
                            <Button variant="contained" color="warning" onClick={() => {
                                reset(resetValues);
                            }}>
                                Сбросить настройки
                            </Button>
                            <Button type="submit" variant="contained" >
                                Применить изменения
                            </Button>
                        </Stack>
                    </Grid>

                    {/* <RHFSwitch */}
                    {/*    name="useCalculationByWarehouse" */}
                    {/*    labelPlacement="end" */}
                    {/*    label={ */}
                    {/*        <> */}
                    {/*            <Typography variant="body2" sx={{color: 'text.secondary'}}> */}
                    {/*                Расчет поставки по складам */}
                    {/*            </Typography> */}
                    {/*        </> */}
                    {/*    } */}
                    {/*    sx={{mx: 0, width: 1}} */}
                    {/* /> */}
                    {/* <RHFSwitch */}
                    {/*    name="userGroupBySize" */}
                    {/*    labelPlacement="end" */}
                    {/*    label={ */}
                    {/*        <> */}
                    {/*            <Typography variant="body2" sx={{color: 'text.secondary'}}> */}
                    {/*                Группировка по размерам */}
                    {/*            </Typography> */}
                    {/*        </> */}
                    {/*    } */}
                    {/*    sx={{mx: 0, width: 1}} */}
                    {/* /> */}

                </Grid>
            </Card>
        </FormProvider>
    );
}

import MUIDataTable, {debounceSearchRender} from "mui-datatables";
import {Button, Card, CircularProgress, Typography} from '@mui/material';
import {columns} from "./TableOptions";


// ----------------------------------------------------------------------

function modifyData(buildHead, buildBody, columns, data) {
    data.forEach(s => {
        const tableData = s.data;
        for (let i = 4; i < tableData.length; i += 1) {
            if(tableData[i])
                tableData[i] = tableData[i].replace('-', ' ').replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ");
        }
    })
    return `\uFEFF${buildHead(columns)}${buildBody(data)}`;


}

const storageKey = "MainDataTableOptions";

export default function TableDopostavki({tableDataState}) {

    
    function getDefaultColumnOrder() {
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
    }

    const options = {
        filterType: 'multiselect',
        filter: true,
        selectableRows: "none",
        fixedHeader: true,
        responsive: 'scroll',
        page: 0,
        rowsPerPage: 50,
        serverSide: false,
        confirmFilters: true,
        customFilterDialogFooter: (currentFilterList, applyNewFilters) => (
            <div style={{marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Button variant="contained" onClick={() => applyNewFilters()}>Применить
                    фильтр</Button>
            </div>
        ),
        draggableColumns: {
            enabled: true
        },
        storageKey,
        customSearchRender: debounceSearchRender(1000),
        downloadOptions: {
            filename: "data.csv",
            separator: ";",
            filterOptions: {
                useDisplayedColumnsOnly: true,
                useDisplayedRowsOnly: true
            }
        },
        onDownload: (buildHead, buildBody, columns, data) => modifyData(buildHead, buildBody, columns, data),
        rowsPerPageOptions: [10, 50, 200, 500, 1000],
        setTableProps: () => ({
            size: `small`,
        }),
        onTableInit: (action, tableState) => {
            console.log(`${action} - onTableInit`);
            console.log(tableState);
            if (action === "tableInitialized") {
                const storedValue = localStorage.getItem(storageKey);
                tableState.columnOrder = storedValue ? JSON.parse(storedValue).columnOrder : getDefaultColumnOrder();
            }

            return tableDataState.data;
        },
        textLabels: {
            body: {
                noMatch: "Нет строк, подходящих под выборку",
                toolTip: "Сортировка",
                columnHeaderTooltip: column => `Сортировка по ${column.label}`
            },
            pagination: {
                next: "Следующая страница",
                previous: "Предыдущая страница",
                rowsPerPage: "Строк на странице:",
                displayRows: "of",
            },
            toolbar: {
                search: "Поиск",
                downloadCsv: "Скачать CSV",
                print: "Распечатать",
                viewColumns: "Колонки",
                filterTable: "Фильтр",
            },
            filter: {
                all: "Все",
                title: "Выберите поле для фильтрации",
                reset: "Очистить",
            },
            viewColumns: {
                title: "Показать колонки",
                titleAria: "Показать/Скрыть колонки",
            },
            selectedRows: {
                text: "строк(а) выбрано",
                delete: "Удалить",
                deleteAria: "Удалить выбранные строки",
            },
        },

    }


    return (
        <Card>
        <MUIDataTable
            title={
                <Typography variant="h6">
                    Допоставки
                    {tableDataState.isLoading &&
                    <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}}/>}
                </Typography>
            }
            data={tableDataState.data ? tableDataState.data : [['Loading Data...']]}
            columns={columns}
            options={options}
        />
    </Card>);


}

// ----------------------------------------------------------------------

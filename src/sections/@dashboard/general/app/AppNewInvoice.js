import {useEffect, useState} from 'react';
import { sentenceCase } from 'change-case';
import PropTypes from 'prop-types';
import MUIDataTable from "mui-datatables";
// @mui

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  Button,
  Divider,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  IconButton,
  TableContainer,
  CircularProgress,
  Typography
} from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// _mock_
import { _appInvoices, _appInvoices1} from '../../../../_mock';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import MenuPopover from '../../../../components/MenuPopover';
import axios from "../../../../utils/axios";


// ----------------------------------------------------------------------

export function AppNewInvoice() {
  const theme = useTheme();

  return (
    <Card>
      <CardHeader title="Самый ходовой товар" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice ID</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {_appInvoices.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{`INV-${row.id}`}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{fCurrency(row.price)}</TableCell>
                  <TableCell>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={
                        (row.status === 'in_progress' && 'warning') ||
                        (row.status === 'out_of_date' && 'error') ||
                        'success'
                      }
                    >
                      {sentenceCase(row.status)}
                    </Label>
                  </TableCell>
                  <TableCell align="right">
                    <MoreMenuButton />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button size="small" color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
          View All
        </Button>
      </Box>
    </Card>
  );
}



export function InvoiceTable(url, config) {
  const theme = useTheme();

  const [state, setState] = useState({
    page: 0,
    rowsPerPage: 50,
    count: 0,
    data: [['Loading Data...']],
    isLoading: true
  })

  const changePage = (page, rowsPerPage) => {
    axios.get(`/api/data/test?page=${page}&rowsPerPage=${rowsPerPage}`).then(response => {
      setState({
        isLoading: false,
        rowsPerPage: response.data.rowsPerPage,
        page: response.data.page,
        data: response.data.data,
        count: response.data.count,
      });
    });
  };

  useEffect(() => {
    axios.get('/api/data/test').then(response => {
      setState({
        isLoading: false,
        rowsPerPage: response.data.rowsPerPage,
        page: response.data.page,
        data: response.data.data,
        count: response.data.count,
      });
    })
  }, []);

  const columns = [
    {
      name: "Артикул",
      options: {
        filter: true,
      }
    },
    {
      name: "Название",
      options: {
        filter: true,
      }
    },
    {
      name: "Размер",
      options: {
        filter: true
      }
    },
    {
      name: "Потребность",
      options: {
        filter: true,
      }
    },
    {
      name: "Обеспеченность",
      options: {
        filter: true
      }
    },
    {
      name: "%выкупа",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "Категория",
      options: {
        filter: true,
      }
    },
    {
      name: "Бренд",
      options: {
        filter: true,
      }
    },
    {
      name: "Склад",
      options: {
        filter: true,
      }
    },
    {
      name: "Штрихкод",
      options: {
        filter: true,
      }
    },
    {
      name: "Излишки",
      options: {
        filter: true,
      }
    }
  ];


  const options = {
    filterType: 'dropdown',
    responsive: 'vertical',
    serverSide: true,
    page: state.page,
    count: state.count,
    rowsPerPage: state.rowsPerPage,
    rowsPerPageOptions: [50,200,500],
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
        all: "All",
        title: "Заголовок",
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

  };

  return (
    <Card>
      <MUIDataTable
          title={
            <Typography variant="h6">
              Допоставки
              {state.isLoading && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
            </Typography>
          }
        data={state.data}
        columns={columns} 
        options={options} 
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

function MoreMenuButton() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <IconButton size="large" onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -0.5,
          width: 160,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:download-fill'} sx={{ ...ICON }} />
          Download
        </MenuItem>

        <MenuItem>
          <Iconify icon={'eva:printer-fill'} sx={{ ...ICON }} />
          Print
        </MenuItem>

        <MenuItem>
          <Iconify icon={'eva:share-fill'} sx={{ ...ICON }} />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}

import {Link} from "@mui/material";
import Integer from "lodash/string";
import Image from "../../../../components/Image";

function getWidthStyle(width) {
    return {style: {minWidth: `${width}px`, maxWidth: `${width}px`}};
}

function getSpecialStyle(width,color) {
    return {style: {minWidth: `${width}px`, maxWidth: `${width}px`, backgroundColor: `${color}`, fontWeight: 800}};
}



const handleOnError = (e, value) => {
    if (!value) return;
    const {src} = e.target;
    const isWBStatic = src.includes("images.wbstatic");
    if (isWBStatic)
    {
        e.target.src = `https://basket-01.wb.ru/vol${getSubstring(value, 0, value.length - 5)}/part${getSubstring(value, 0, value.length - 3)}/${value}/images/c246x328/1.jpg`;
        return;
    }

    const countBasket = Integer.parseInt(src.substr(0, 17).match(/\d*$/)[0]);
    if (!countBasket || countBasket > 8) return;

    e.target.src = `https://basket-0${countBasket+1}.wb.ru/vol${getSubstring(value, 0, value.length - 5)}/part${getSubstring(value, 0, value.length - 3)}/${value}/images/c246x328/1.jpg`;
}

function numberComparator() {
    return (order) => (obj1, obj2) => {
        const specialConst = (order === 'asc' ? 1 : -1);
        const value1 = obj1.data.replace(/,/g, '.');
        const value2 = obj2.data.replace(/,/g, '.');
        const val1 = !Number.isNaN(parseFloat(value1)) ? parseFloat(value1) : 9999 * specialConst;
        const val2 = !Number.isNaN(parseFloat(value2)) ? parseFloat(value2) : 9999 * specialConst;
        return (val1 - val2) * specialConst;
    };
}

export const columns = [
    { // 13
        name: "nmId",
        label: " ",
        options: {
            filter: false,
            searchable: false,
            sort: false,
            viewColumns: false,
            customBodyRender: (value, tableMeta, updateValue) => (
                <Link href={`https://www.wildberries.ru/catalog/${value}/detail.aspx`} target="_blank">
                    {
                        <Image
                            src={`https://images.wbstatic.net/c246x328/new/${getSubstring(value, 0, 4)}0000/${value}-1.jpg`}
                            sx={{
                                width: 48
                            }}

                            onError={(e) => handleOnError(e, value)}
                        />
                    }
                </Link>
            ),
            setCellProps: () => ({
                style: {
                    whiteSpace: "nowrap",
                    position: "sticky",
                    left: "0",
                    background: "white",
                    zIndex: 100
                }
            }),
            setCellHeaderProps: () => ({
                style: {
                    whiteSpace: "nowrap",
                    position: "sticky",
                    left: 0,
                    background: "white",
                    zIndex: 101
                }
            })
        }
    },
    { // 0
        name: "supplierArticle",
        label: "Артикул",
        options: {
            filter: true,
            hint: "Артикул поставщика",
        }
    },
    { // 1
        name: "subject",
        label: "Категория",
        options: {
            filter: true,
        }
    },
    { // 2
        name: "brand",
        label: "Бренд",
        options: {
            filter: true,
        }
    },
    { // 3
        name: "barcode",
        label: "Штрихкод",
        options: {
            filter: true,
        }
    },
    { // 4
        name: "techSize",
        label: "Размер",
        options: {
            filter: true,
            sortCompare: numberComparator()
        }
    },
    { // 5
        name: "quantity",
        label: "Остаток на сайте, шт",
        options: {
            filter: false,
            hint: "Товары доступные на сайте, шт.",
            setCellProps: () => (getWidthStyle(150)),
            sortCompare: numberComparator(),
        }
    },
    { // 6
        name: "К допоставке, шт",
        label: "В поставке, шт",
        options: {
            filter: false,
            hint: "Товары в принято складом шт.",
            setCellProps: () => (getWidthStyle(170)),
            sortCompare: numberComparator(),
        }
    },
    { // 7
        name: "Реальный остаток, шт.",
        label: "Реальный остаток, шт.",
        options: {
            filter: false,
            hint: "Товары на складе + (заказы - (заказы * % процент выкупа ))",
            setCellProps: () => (getWidthStyle(200)),
            sortCompare: numberComparator()
        }
    },
    { // 9
        name: "К допоставке, шт",
        label: "К допоставке, шт",
        options: {
            filter: false,
            hint: "Нужно поставить товаров, шт.",
            setCellProps: () => (getSpecialStyle(200, "#bdefd6")),
            setCellHeaderProps: () => ({style: {backgroundColor: `#bdefd6`}}),
            sortCompare: numberComparator()
        }
    },
    { // 10
        name: "Хватит на, дн",
        label: "Хватит на, дн",
        options: {
            filter: false,
            hint: "На сколько хватит товаров, дн.",
            sortCompare: numberComparator()
        }
    },
    { // 11
        name: "Излишки, шт",
        label: "Излишки, шт",
        options: {
            filter: false,
            hint: "Лишнее количество товаров, шт.",
            sortCompare: numberComparator(),
        }
    },
    { // 12
        name: "Выкуп, %",
        label: "Выкуп, %",
        options: {
            filter: false,
            sortCompare: numberComparator(),
        }
    },
    { // 14
        name: "nmId",
        label: "Код WB",
        options: {
            filter: true,
            sortCompare: numberComparator(),
        }
    },
    { // 15
        name: "Спрос по продажам (квартал), шт",
        label: "Спрос по продажам (квартал), шт",
        options: {
            filter: false,
            setCellProps: () => (getWidthStyle(200)),
            sortCompare: numberComparator(),
        }
    },
    { // 16
        name: "Спрос по продажам (месяц), шт",
        label: "Спрос по продажам (месяц), шт",
        options: {
            filter: false,
            setCellProps: () => (getWidthStyle(200)),
            sortCompare: numberComparator(),
        }
    },
    { // 17
        name: "Спрос по продажам (неделя), шт",
        label: "Спрос по продажам (неделя), шт",
        options: {
            filter: false,
            setCellProps: () => (getWidthStyle(200)),
            sortCompare: numberComparator(),
        }
    },
    { // 18
        name: "Допоставка на, дн",
        label: "Допоставка на, дн",
        options: {
            filter: false,
            setCellProps: () => (getWidthStyle(150)),
            sortCompare: numberComparator(),
        }
    },
    { // 19
        name: "Максимальная скорость спроса, шт",
        label: "Скорость спроса, шт",
        options: {
            filter: false,
            setCellProps: () => (getWidthStyle(200)),
            sortCompare: numberComparator(),
        }
    },
    { // 20
        name: "Спрос по заказам (неделя), шт",
        label: "Спрос по заказам (неделя), шт",
        options: {
            filter: false,
            setCellProps: () => (getWidthStyle(200)),
            sortCompare: numberComparator(),
        }
    },
    { // 21
        name: "Дней отсутствия на складе (квартал)",
        label: "Дней отсутствия на складе (квартал)",
        options: {
            filter: false,
            setCellProps: () => (getWidthStyle(200)),
            sortCompare: numberComparator(),
        }
    },
    { // 22
        name: "Дней отсутствия на складе (месяц)",
        label: "Дней отсутствия на складе (месяц)",
        options: {
            filter: false,
            setCellProps: () => (getWidthStyle(200)),
            sortCompare: numberComparator(),
        }
    },
    { // 23
        name: "Дней отсутствия на складе (неделя)",
        label: "Дней отсутствия на складе (неделя)",
        options: {
            filter: false,
            setCellProps: () => (getWidthStyle(200)),
            sortCompare: numberComparator(),
        }
    },
    { // 24
        name: "qtyFull",
        label: "Остаток на складе, шт",
        options: {
            filter: false,
            hint: "Товары доступные на складе, шт.",
            setCellProps: () => (getWidthStyle(150)),
            sortCompare: numberComparator(),
        }
    },
    { // 25
        name: "Хватит до, дни",
        label: "Хватит до, дни",
        options: {
            filter: false,
            hint: "Хватит товара до, дни",
            setCellProps: () => (getWidthStyle(200)),
        }
    },
    { // 26
        name: "Средняя стоимость продажи, р.",
        label: "Средняя стоимость продажи, р.",
        options: {
            filter: false,
            hint: "Средняя стоимость продажи, р.",
            sortCompare: numberComparator(),
        }
    },
    { // 27
        name: "Упущенные продажи за месяц, р.",
        label: "Упущенные продажи за месяц, р.",
        options: {
            filter: false,
            hint: "Упущенные продажи за месяц, р.",
            sortCompare: numberComparator(),
        }
    },
    { // 28
        name: "Используемая для расчетов скорость спроса, шт",
        label: "Используемая для расчетов скорость спроса, шт",
        options: {
            filter: true,
            setCellProps: () => (getWidthStyle(200)),
            sortCompare: numberComparator(),
        }
    },
    
];

function getSubstring(value, from, length) {
    if (value == null) return value;
    return value.substr(from, length);
};
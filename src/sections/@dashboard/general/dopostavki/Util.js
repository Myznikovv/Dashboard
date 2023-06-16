import merge from "lodash/merge";

const getMonths = function () {
    const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Нояб', 'Дек'];
    const a = [];
    let monthIndex = new Date().getMonth() + 1;
    const lastMonthIndex = monthIndex + 12;
    for (; monthIndex < lastMonthIndex; monthIndex += 1) {
        a.push(monthNames[monthIndex % 12]);
    }
    ;
    return a;
};

const getDaysArray = () => {
    const s = new Date().setDate(new Date().getDate() - 29);
    const a = [];
    const d = new Date(s);
    for (; d <= new Date(); d.setDate(d.getDate() + 1)) {
        a.push((new Date(d)).getDate());
    }
    return a;
};

export const  isPresent = (value)  => {
    return (value !== undefined) && (value !== null)
}

export const getUniqueBrands = (data) => {
    if (!data ) return null;
    return [...new Set(data.map(s => s.brand))].sort();
};

export const getUniqueTechSizes = (data) => {
    if (!data ) return null;
    return [...new Set(data.map(s => s.techSize))].sort();;
};

export const getUniqueCategories = (data) => {
    if (!data  ) return null;
    return [...new Set(data.map(s => s.category))].sort();
};

export const getuniqueSubjects = (data) => {
    if (!data  ) return null;
    return [...new Set(data.map(s => s.subject))].sort();
};

export const getUniqueArticles = (data) => {
    if (!data  ) return null;
    return [...new Set(data.map(s => s.supplierArticle))].sort();
};

export const chartOptionsYear = (baseOptionsChart) => merge(baseOptionsChart, {
    xaxis: {
        categories: getMonths(),
    }
});

export const chartOptionsMonth = (baseOptionsChart) => merge(baseOptionsChart, {
    xaxis: {
        categories: getDaysArray(),
    }
});


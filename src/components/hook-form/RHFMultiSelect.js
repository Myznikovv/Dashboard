import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import {
    Checkbox,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    TextField
} from '@mui/material';
import {useState} from "react";
import {warehouses} from "../../sections/@dashboard/general/dopostavki/warehouses";

// ----------------------------------------------------------------------

RHFMultiSelect.propTypes = {
    children: PropTypes.node,
    name: PropTypes.string,
};

export default function RHFMultiSelect({ name, label, allValues, children, ...other }) {

    const { control } = useFormContext();

    return (
        <FormControl sx={{width: '100%' }}>
            <InputLabel >{label}</InputLabel>
            <Controller
                name={name}
                control={control}
                render={({ field:{ onChange, onBlur, value, name, ref }, fieldState: { error } }) => (
                    <Select
                        onChange = {onChange}
                        onBlur = {onBlur}
                        value = {value}
                        name = {name}
                        ref = {ref}
                        multiple
                        fullWidth
                        selectprops={{ native: false }}
                        error={!!error}
                        helpertext={error?.message}
                        input={<OutlinedInput label={label}/>}
                        renderValue={(selected) => selected.join(', ')}
                        {...other}
                    >
                        {allValues ? allValues.map((item) => (
                            <MenuItem key={item} value={item}>
                                <Checkbox checked={value.indexOf(item) > -1}/>
                                <ListItemText primary={item}/>
                            </MenuItem>
                        )) : []}
                    </Select>
                )}
            />
        </FormControl>

    );
}


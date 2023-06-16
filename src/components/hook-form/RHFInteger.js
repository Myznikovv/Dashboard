import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';
import {useState} from "react";

// ----------------------------------------------------------------------

RHFInteger.propTypes = {
  name: PropTypes.string,
};

export default function RHFInteger({ name, ...other }) {
  const { control } = useFormContext();

  return (
      <Controller
          name={name}
          control={control}
          render={({field, fieldState: {error}}) => (
              <TextField {...field} fullWidth error={!!error}
                         helperText={error?.message} {...other}
                         variant="standard"
                         name="price"
                         type="tel"
                         inputProps={{
                             pattern: "[0-9]*",
                         }}
              />
          )}
      />
  );
}

import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const { register } = useAuth();
  const[error, setError] =useState('');

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('Укажите имя'),
    lastName: Yup.string().required('Укажите фамилию'),
    apiKeyWB: Yup.string().required('Укажите API-ключ Wildberries'),
    login: Yup.string().email('Введите валидный Email').required('Укажите Email'),
    password: Yup.string().required('Придумайте Password'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    apiKeyWB:'',
    login: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const tokens = (Math.random().toString(36)+Math.random().toString(36)+Math.random().toString(36)).replace(/\./g,'').substring(1,32);
      await register(data.firstName, data.lastName, data.apiKeyWB, data.login, data.password, tokens, tokens);
      console.log(data.firstName, data.lastName, data.apiKeyWB, data.login, data.password, tokens, tokens)

    } catch (error) {
      setError(error.message);
      
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!error && <Alert severity="error">{error}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="Имя" />
          <RHFTextField name="lastName" label="Фамилия" />
        </Stack>
        <RHFTextField name="apiKeyWB" label="Ключ API WB" />
        <RHFTextField name="login" label="Email" />

        <RHFTextField
          name="password"
          label="Пароль"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Зарегистрироваться
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

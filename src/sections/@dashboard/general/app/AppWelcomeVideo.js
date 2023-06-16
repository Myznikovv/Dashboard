import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Button, Card, CardContent } from '@mui/material';
import { SeoIllustration } from '../../../../assets';
import Video from "../../../../components/Video";

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.lighter,
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between',
      boxShadow:'0 0 2px 0 rgb(145 158 171 / 20%), 0 12px 24px -4px rgb(145 158 171 / 12%)',
  },
}));

// ----------------------------------------------------------------------

AppWelcomeVideo.propTypes = {
  text: PropTypes.string,
};

export default function AppWelcomeVideo({ text }) {
  return (
    <RootStyle>
      <CardContent
        sx={{
          p: { md: 0 },
          pl: { md: 5 },
          color: 'grey.800',
        }}
      >
        <Typography gutterBottom variant="h4">
            {text}
        </Typography>

        <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
          Мы собираем много данных из разных источников, чтобы помогать вам делать рутинные дела проще. <br/>
            Вы можете ознакомиться с видео-инструкцией, где мы отвечаем на большинство вопросов по нашему сервису.
        </Typography>

      </CardContent>
        <Video/>
    </RootStyle>
  );
}

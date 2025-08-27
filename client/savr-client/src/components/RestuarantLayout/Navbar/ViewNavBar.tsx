import CalendarTodaySharpIcon from '@mui/icons-material/CalendarTodaySharp';
import Box from '@mui/joy/Box';
import * as React from 'react';

const ViewNavBar = ({ style }: { style: React.CSSProperties }) => {
  const [currentDate, setCurrentDate] = React.useState('');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(
        new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Box
        style={style}
        sx={{
          height: '60px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#ede7f6',
          borderBottom: '2px solidrgb(3, 1, 10)',
          color: 'white',
          px: 3,
          py: 2,
        }}>
        <h1
          style={{
            margin: 0,
            fontWeight: 'bold',
            fontSize: 28,
            color: '#333',
            flex: 1,
            textAlign: 'center',
          }}>
          <CalendarTodaySharpIcon sx={{ marginRight: 1 }} />
          {currentDate}
        </h1>
      </Box>
    </>
  );
};

export default ViewNavBar;

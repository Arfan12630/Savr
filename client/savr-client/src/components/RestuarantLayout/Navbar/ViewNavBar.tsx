import * as React from 'react';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import Button from '@mui/joy/Button';
import Snackbar from '@mui/material/Snackbar';
import Avatar from '@mui/joy/Avatar';
import IconButton from '@mui/joy/IconButton';
import CalendarTodaySharpIcon from '@mui/icons-material/CalendarTodaySharp';
const ViewNavBar = ({style,restaurantCardData, addChair, isChairPressed, setIsChairPressed, addTable, isTablePressed, setIsTablePressed, saveLayout}: {style: React.CSSProperties, restaurantCardData: any, addChair: () => void, isChairPressed: boolean, setIsChairPressed: (isChairPressed: boolean) => void, addTable: (shape:string) => void, isTablePressed: boolean, setIsTablePressed: (isTablePressed: boolean) => void, saveLayout: () => void}) => {
  
  const [open, setOpen] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState('');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(
        new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleDrawer =
    (inOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpen(inOpen);
    };

   
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
        }}
      >
   
        <h1 style={{
          margin: 0,
          fontWeight: 'bold',
          fontSize: 28,
          color: '#333',
          flex: 1,
          textAlign: 'center'
        }}>
         <CalendarTodaySharpIcon sx={{marginRight: 1}} />
         {currentDate}
        </h1>
       
    
      </Box>
    
    </>
  );
}

export default ViewNavBar;
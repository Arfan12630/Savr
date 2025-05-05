import * as React from 'react';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import Button from '@mui/joy/Button';
import Snackbar from '@mui/material/Snackbar';
import Avatar from '@mui/joy/Avatar';
const NavBar = ({addChair, isChairPressed, setIsChairPressed, addTable, isTablePressed, setIsTablePressed, saveLayout}: {addChair: () => void, isChairPressed: boolean, setIsChairPressed: (isChairPressed: boolean) => void, addTable: () => void, isTablePressed: boolean, setIsTablePressed: (isTablePressed: boolean) => void, saveLayout: () => void}) => {
  const [open, setOpen] = React.useState(false);

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
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#ede7f6', // light background, optional
          borderBottom: '2px solid #512da8', // underline, optional
          px: 3,
          py: 2,
        }}
      >
        <Button sx = {{
          color: 'black',
          border: '1px solid #512da8',
          '&:hover': {
            color: 'white',
            bgcolor: '#512da8',
          },
        }}variant="outlined" color="primary" onClick={toggleDrawer(true)}>
          Edit Layout
        </Button>
        <h1 style={{
          margin: 0,
          fontWeight: 'bold',
          fontSize: 28,
          color: '#333',
          flex: 1,
          textAlign: 'center'
        }}>
          Restaurant Name
        </h1>
        {/* Empty Box to balance the flex layout, or you can put another button here */}
        <Button sx = {{
          color: 'black',
          border: '1px solid #512da8',
          '&:hover': {
            color: 'white',
            bgcolor: '#512da8',
          },
        }}variant="outlined" color="primary" onClick={saveLayout}>
          Save Layout
        </Button>
    
        <Box sx={{ width: 120 }} />
      </Box>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box
          role="presentation"
          sx={{
            minWidth: 260,
            bgcolor: 'background.body',
            height: '100%',
            boxShadow: 3,
            borderRadius: 2,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ mb: 3, fontWeight: 'bold', fontSize: 24, letterSpacing: 1 }}>
            <Button variant="outlined" color="neutral" onClick={toggleDrawer(false)}>

            Exit
            </Button>
           
          </Box>

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              onClick={() => addChair()}
              variant="soft"
              color="primary"
              sx={{
                borderRadius: 3,
                fontWeight: 500,
                fontSize: 16,
                boxShadow: 1,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'primary.solidBg',
                  color: 'white',
                  boxShadow: 3,
                  transform: 'translateY(-2px) scale(1.03)',
                },
              }}
              fullWidth
            >
              Add Chair
            </Button>
            <Button
              onClick={() => addTable()}
              variant="soft"
              color="primary"
              sx={{
                borderRadius: 3,
                fontWeight: 500,
                fontSize: 16,
                boxShadow: 1,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'primary.solidBg',
                  color: 'white',
                  boxShadow: 3,
                  transform: 'translateY(-2px) scale(1.03)',
                },
              }}
              fullWidth
            >
              Add Table
            </Button>
            <Button
              variant="soft"
              color="primary"
              sx={{
                borderRadius: 3,
                fontWeight: 500,
                fontSize: 16,
                boxShadow: 1,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'primary.solidBg',
                  color: 'white',
                  boxShadow: 3,
                  transform: 'translateY(-2px) scale(1.03)',
                },
              }}
              fullWidth
            >
              Add Table 2nd option 
            </Button>

            <Button
              variant="soft"
              color="primary"
              sx={{
                borderRadius: 3,
                fontWeight: 500,
                fontSize: 16,
                boxShadow: 1,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'primary.solidBg',
                  color: 'white',
                  boxShadow: 3,
                  transform: 'translateY(-2px) scale(1.03)',
                },
              }}
              fullWidth
            >
              Add Round Table
            </Button>
          </Box>
        </Box>
        <Snackbar
      color="success"
      open={isChairPressed}
      autoHideDuration={4000}
      onClose={() => setIsChairPressed(false)}
      message="Chair added ✅"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
    <Snackbar
      color="success"
      open={isTablePressed}
      autoHideDuration={4000}
      onClose={() => setIsTablePressed(false)}
      message="Table added ✅"
      />
      </Drawer>
    </>
  );
}

export default NavBar;
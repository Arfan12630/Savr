import * as React from 'react';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import Button from '@mui/joy/Button';
import List from '@mui/joy/List';
import Divider from '@mui/joy/Divider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';

const NavBar = ({addChair}: {addChair: () => void}) => {
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
    <Box sx={{ display: 'flex' }}>
      <Button variant="outlined" color="neutral" onClick={toggleDrawer(true)}>
        Edit Layout
      </Button>
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

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
         
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
          </Box>
           

          
        </Box>
      </Drawer>
    </Box>
  );
}

export default NavBar;
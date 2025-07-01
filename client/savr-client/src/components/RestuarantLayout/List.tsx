import * as React from 'react';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemButton from '@mui/joy/ListItemButton';
import Typography from '@mui/joy/Typography';
import Home from '@mui/icons-material/Home';

export default function SizesList({contextMenu, setContextMenu}: {contextMenu: {x: number, y: number}, setContextMenu: (contextMenu: {x: number, y: number} | null) => void}) {
  return (
    <div onMouseLeave={() => {
      setContextMenu(null)
    }}>
    <Box
      sx={{
        backgroundColor: 'white',
        position: 'absolute',
        top: contextMenu.y,
        left: contextMenu.x,
  
        color: 'white',
        padding: '10px',
        borderRadius: '6px',
        listStyle: 'none',
        zIndex: 999,
      }}
    >
        
          <List
            size={'md'}
            variant="outlined"
            sx={{ maxWidth: 300, borderRadius: 'sm' }}
          >
            <ListItem>
              <ListItemButton>
                <ListItemDecorator>
                  <Home />
                </ListItemDecorator>
                Home
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton>Projects</ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton>Settings</ListItemButton>
            </ListItem>
          </List>
        
      
    </Box>
    </div>
  );
}

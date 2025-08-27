import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
export default function SizesList({
  onAddDetails,
  contextMenu,
  setContextMenu,
}: {
  onAddDetails: () => void;
  contextMenu: { x: number; y: number };
  setContextMenu: (contextMenu: { x: number; y: number } | null) => void;
}) {
  return (
    <div>
      <Box
        sx={{
          position: 'absolute',
          top: contextMenu.y,
          left: contextMenu.x,
          minWidth: '220px',
          backgroundColor: 'white',
          // borderRadius: '10px',
          //boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
          // border: '1px solid #e0e0e0',
          fontFamily: 'Inter, sans-serif',
          // fontSize: '14px',
          // color: '#2e2e2e',
          zIndex: 1000,
        }}>
        <List
          size={'md'}
          variant="outlined"
          sx={{ maxWidth: 300 }}>
          <ListItem>
            <ListItemButton
              onClick={() => {
                onAddDetails();
                setContextMenu(null);
              }}>
              Add Details
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );
}

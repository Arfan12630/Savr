import React, { useState } from "react";
import Textarea from '@mui/joy/Textarea';
import Box from '@mui/joy/Box';

const DoubleClickedText = ({ handleDoubleClickDelete, tableNumber, setTableNumber, handleTableNumberSubmit }:
  
  { handleDoubleClickDelete: () => void,
    tableNumber:string,
    setTableNumber: (tableNumber:string) => void,
    handleTableNumberSubmit: (tableNumber:string) => void
  }) => {
  const [isHovered, setIsHovered] = useState(false);
 

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      
    >
      <Box
        sx={{
          py: 2,
          display: 'grid',
          gap: 2,
          alignItems: 'center',
          flexWrap: 'wrap',
          width: '100%',
        }}
      >
        <Textarea
          name="Primary"
          placeholder="Type in here…"
          variant="plain"
          color="primary"
          sx={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            textAlign: 'center',
            '& textarea': {
              textAlign: 'center',
            },
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: 'black',
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderRadius: '10px',
          }}
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          onBlur={() => handleTableNumberSubmit(tableNumber)}
        />
      </Box>
      {isHovered && (
        <button
          onClick={handleDoubleClickDelete}
          style={{
           
            top: 8,
            right: 8,
            zIndex: 10,
            background: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: 30,
            height: 30,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: 18,
            position: 'absolute',
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default DoubleClickedText;
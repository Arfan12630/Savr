import * as React from 'react';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
  
  const handleSelect = (role: string) => {
    setSelectedRole(role);
    console.log(role);
  };

  return (
    <Box
      component="ul"
      sx={{
        display: 'flex',
        gap: 4,
        flexWrap: 'wrap',
        p: 4,
        m: 0,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <Card 
        component="li" 
        onClick={() => handleSelect('user')}
        sx={{
          minWidth: 300,
          maxWidth: 400,
          height: 400,
          cursor: 'pointer',
          position: 'relative',
          transition: 'transform 0.3s, box-shadow 0.3s',
          border: selectedRole === 'user' ? '3px solid #2196f3' : '1px solid #ddd',
          boxShadow: selectedRole === 'user' 
            ? '0 12px 28px rgba(0, 0, 0, 0.2)' 
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        <CardCover>
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800"
            srcSet="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&dpr=2 2x"
            loading="lazy"
            alt="Restaurant customer"
            style={{ objectFit: 'cover', filter: 'brightness(0.7)' }}
          />
        </CardCover>
        <CardContent sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center',
          p: 4
        }}>
          <Typography
            level="h2"
            textColor="#fff"
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            User
          </Typography>
          <Typography
            level="body-lg"
            textColor="#fff"
            sx={{ 
              maxWidth: '80%',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)'
            }}
          >
            Browse restaurants, make reservations, and order food
          </Typography>
          
          {selectedRole === 'user' && (
            <CheckCircleIcon 
              sx={{ 
                position: 'absolute',
                top: 16,
                right: 16,
                fontSize: 40,
                color: '#2196f3',
                backgroundColor: 'white',
                borderRadius: '50%'
              }} 
            />
          )}
        </CardContent>
      </Card>

      <Card 
        component="li"
        onClick={() => handleSelect('owner')}
        sx={{
          minWidth: 300,
          maxWidth: 400,
          height: 400,
          cursor: 'pointer',
          position: 'relative',
          transition: 'transform 0.3s, box-shadow 0.3s',
          border: selectedRole === 'owner' ? '3px solid #2196f3' : '1px solid #ddd',
          boxShadow: selectedRole === 'owner' 
            ? '0 12px 28px rgba(0, 0, 0, 0.2)' 
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        <CardCover>
          <img
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800"
            srcSet="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&dpr=2 2x"
            loading="lazy"
            alt="Restaurant owner"
            style={{ objectFit: 'cover', filter: 'brightness(0.7)' }}
          />
        </CardCover>
        <CardContent sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center',
          p: 4
        }}>
          <Typography
            level="h2"
            textColor="#fff"
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Owner
          </Typography>
          <Typography
            level="body-lg"
            textColor="#fff"
            sx={{ 
              maxWidth: '80%',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)'
            }}
          >
            Manage your restaurant, customize layouts, and handle orders
          </Typography>
          
          {selectedRole === 'owner' && (
            <CheckCircleIcon 
              sx={{ 
                position: 'absolute',
                top: 16,
                right: 16,
                fontSize: 40,
                color: '#2196f3',
                backgroundColor: 'white',
                borderRadius: '50%'
              }} 
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

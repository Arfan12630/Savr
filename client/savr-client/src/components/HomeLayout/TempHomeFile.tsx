import React, { useEffect, useState } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';
import Fade from '@mui/material/Fade';
import { useNavigate } from 'react-router-dom';

const userImages = [
  'https://images.unsplash.com/photo-1527549993586-dff825b37782',
  'https://images.unsplash.com/photo-1556740749-887f6717d7e4',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1',
];

const ownerImages = [
  'https://images.unsplash.com/photo-1576866209830-72b83111d782',
  'https://images.unsplash.com/photo-1586190848861-99aa4a171e90',
  'https://images.unsplash.com/photo-1556745757-8d76bdb6984b',
];

const ImageSlideshow = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '250px',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      {images.map((img, i) => (
        <img
          key={i}
          src={`${img}?auto=format&fit=crop&w=800`}
          alt={`Slide ${i}`}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === index && fade ? 1 : 0,
            transition: 'opacity 0.7s ease-in-out',
          }}
        />
      ))}
    </div>
  );
};

const TempHomeFile = () => {
  const navigate = useNavigate();

  const cardStyle = {
    width: '45vw',
    minHeight: 450,
    bgcolor: '#1a1d26',
    borderRadius: '20px',
    boxShadow: 'lg',
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  };

  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: '#0f1117',
        minHeight: '100vh',
        padding: '50px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
      }}
    >
      {/* USER Card */}
      <Fade in timeout={1000}>
        <Card sx={cardStyle}>
          <div>
            <Typography level="h2" sx={{ color: 'white' }}>
              User
            </Typography>
            <Typography level="body-md" sx={{ color: '#c1c1c1' }}>
              Reserve, Order, & Pay all at once
            </Typography>
            <IconButton
              aria-label="bookmark user"
              variant="plain"
              color="neutral"
              size="sm"
              sx={{ position: 'absolute', top: '1rem', right: '1rem' }}
            >
              <BookmarkAdd sx={{ color: '#8f8f8f' }} />
            </IconButton>
          </div>
          <ImageSlideshow images={userImages} />
          <CardContent orientation="horizontal" sx={{ pt: 3 }}>
            <Button
              variant="solid"
              size="md"
              color="primary"
              onClick={() => navigate('/chat')}
              sx={{
                ml: 'auto',
                fontWeight: 600,
                borderRadius: '10px',
                bgcolor: '#1976d2',
                '&:hover': { bgcolor: '#1565c0' },
              }}
            >
              Explore
            </Button>
          </CardContent>
        </Card>
      </Fade>

      {/* OWNER Card */}
      <Fade in timeout={1200}>
        <Card sx={cardStyle}>
          <div>
            <Typography level="h2" sx={{ color: 'white' }}>
              Owner
            </Typography>
            <Typography level="body-md" sx={{ color: '#c1c1c1' }}>
              Add Menu & Customize Layout
            </Typography>
            <IconButton
              aria-label="bookmark owner"
              variant="plain"
              color="neutral"
              size="sm"
              sx={{ position: 'absolute', top: '1rem', right: '1rem' }}
            >
              <BookmarkAdd sx={{ color: '#8f8f8f' }} />
            </IconButton>
          </div>
          <ImageSlideshow images={ownerImages} />
          <CardContent orientation="horizontal" sx={{ pt: 3 }}>
            <Button
              variant="solid"
              size="md"
              color="primary"
              onClick={() => navigate('/owner/restaurant-entry')}
              sx={{
                ml: 'auto',
                fontWeight: 600,
                borderRadius: '10px',
                bgcolor: '#1976d2',
                '&:hover': { bgcolor: '#1565c0' },
              }}
            >
              Explore
            </Button>
          </CardContent>
        </Card>
      </Fade>
    </div>
  );
};

export default TempHomeFile;

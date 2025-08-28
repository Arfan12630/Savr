import {
  Box,
  CardProps,
  Card as JoyCard,
  CardContent as JoyCardContent,
  Typography,
} from '@mui/joy';

export function Card({ children, ...props }: CardProps) {
  return <JoyCard {...props}>{children}</JoyCard>;
}

export function CardHeader({ children, ...props }: any) {
  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        ...props.sx,
      }}
      {...props}>
      <Typography
        level="h4"
        component="h2">
        {children}
      </Typography>
    </Box>
  );
}

export function CardContent({ children, ...props }: any) {
  return <JoyCardContent {...props}>{children}</JoyCardContent>;
}

export function CardFooter({ children, ...props }: any) {
  return (
    <Box
      sx={{
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        ...props.sx,
      }}
      {...props}>
      {children}
    </Box>
  );
}

export function OutlineCard({ children, ...props }: CardProps) {
  return (
    <JoyCard
      variant="outlined"
      {...props}>
      {children}
    </JoyCard>
  );
}

export function SoftCard({ children, ...props }: CardProps) {
  return (
    <JoyCard
      variant="soft"
      {...props}>
      {children}
    </JoyCard>
  );
}

export function OutlineSoftCard({ children, ...props }: CardProps) {
  return (
    <JoyCard
      variant="outlined"
      {...props}>
      {children}
    </JoyCard>
  );
}

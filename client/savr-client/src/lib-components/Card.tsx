import { CardProps, Card as JoyCard } from '@mui/joy';

export function Card({ children, ...props }: CardProps) {
  return <JoyCard {...props}>{children}</JoyCard>;
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

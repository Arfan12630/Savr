import Button from '@mui/joy/Button';
import DialogContent from '@mui/joy/DialogContent';
import DialogTitle from '@mui/joy/DialogTitle';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

type ReservationModalProps = {
  open: boolean;
  onClose: () => void;
  onReserve: () => void;
  onCancel?: () => void;
  reserved?: boolean;
  tableNumber?: string;
  restaurantInfo?: any;
  reservationData?: any;
};

const ReservationModal = ({
  open,
  onClose,
  onReserve,
  onCancel,
  reserved,
  tableNumber,
  restaurantInfo,
  reservationData,
}: ReservationModalProps) => {
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const reserveTable = () => {
    navigate('/menu-card-display', {
      state: {
        tableNumber: tableNumber,
        restaurantInfo: restaurantInfo,
        reservationData: reservationData,
        name: name,
      },
    });
    setName('');
  };
  return (
    <Fragment>
      <Modal
        open={open}
        onClose={onClose}>
        <ModalDialog>
          <DialogTitle>
            {reserved ? 'Cancel Reservation' : 'Reserve Table'}
          </DialogTitle>
          <DialogContent>
            {reserved
              ? 'Are you sure you want to cancel this reservation?'
              : 'Fill in the reservation information.'}
          </DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              if (reserved && onCancel) {
                onCancel();
              } else {
                onReserve();
                console.log('Reserved');
              }
            }}>
            <Stack spacing={2}>
              {!reserved && (
                <>
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      autoFocus
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </FormControl>
                </>
              )}
              <Button
                type="submit"
                onClick={reserveTable}>
                {reserved ? 'Cancel Reservation' : 'Reserve'}
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </Fragment>
  );
};

export default ReservationModal;

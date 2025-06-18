import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';

const ReservationModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onReserve: () => void;
  onCancel?: () => void;
  reserved?: boolean;
  
  



}> = ({ open, onClose, onReserve, onCancel, reserved }) => {

  const [name, setName] = React.useState('');
  const [completedReservation, setCompletedReservation] = React.useState(false);
  return (
    <React.Fragment>
      <Modal open={open} onClose={onClose}>
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
                console.log("Reserved");
  
              }
            }}
          >
            <Stack spacing={2}>
              {!reserved && (
                <>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input autoFocus required />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input required />
              </FormControl>
                </>
              )}
              <Button type="submit" onClick={() => {

              }}>
                {reserved ? 'Cancel Reservation' : 'Reserve'}
               
              </Button>
           

            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};

export default ReservationModal;
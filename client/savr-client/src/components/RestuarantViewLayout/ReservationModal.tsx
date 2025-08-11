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
import { useNavigate } from 'react-router-dom';

const ReservationModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onReserve: () => void;
  onCancel?: () => void;
  reserved?: boolean;
  tableNumber?: string;
  restaurantInfo?: any;
  reservationData?: any;
  



}> = ({ open, onClose, onReserve, onCancel, reserved, tableNumber, restaurantInfo, reservationData }) => {
  //console.log(tableNumber);
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [completedReservation, setCompletedReservation] = React.useState(false);
  const reserveTable = () => {
    console.log("Reserved");
  
    navigate("/menu-card-display", {state: {tableNumber: tableNumber, restaurantInfo: restaurantInfo, reservationData: reservationData, name: name}});
    setName("")
  }
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
                <Input autoFocus required value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
              {/* <FormControl>
                <FormLabel>Description</FormLabel>
                <Input required />
              </FormControl> */}
                </>
              )}
              <Button type="submit" onClick={reserveTable}>
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
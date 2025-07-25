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
import Textarea from '@mui/joy/Textarea';

const DetailsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onReserve: () => void;
  addDetails?: boolean;
  onSubmitDetails: (formData:{description:string, maxPartySizeRange:string}) => void;
}> = ({ open, onClose, onReserve, addDetails, onSubmitDetails }) => {
  const [formData, setFormData] = React.useState({
    description: '',
    maxPartySizeRange: '',
  });

 

  return (
    <Modal open={open} onClose={onClose}>
       
      <ModalDialog>
       
          <DialogTitle>{addDetails ? 'Edit Details' : 'Add Details'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Max Party Size Range</FormLabel>
                <Input
                  autoFocus
                  required
                  value={formData.maxPartySizeRange}
                  onChange={(e) => setFormData({ ...formData, maxPartySizeRange: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </FormControl>
            </Stack>
          </DialogContent>
          <Button
      type="submit"
      onClick={e => {
        e.preventDefault();                   
        console.log("Finish clicked");      
        console.log("Form submitted", formData);
        onSubmitDetails(formData)
        onReserve();                           
        onClose();                             
      }}
    >
      Finish
    </Button>
        </ModalDialog>
   
    </Modal>
  );
};

export default DetailsModal;

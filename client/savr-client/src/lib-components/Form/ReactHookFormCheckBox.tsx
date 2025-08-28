import { Checkbox, FormControl, FormHelperText, FormLabel } from '@mui/joy';
import { Box } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface CheckboxRHFProps {
  name: string;
  label: string;
  required?: boolean;
}

export const CheckboxRHF = ({
  name,
  label,
  required = false,
}: CheckboxRHFProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl
          error={!!error}
          required={required}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Checkbox
              {...field}
              checked={field.value}
            />
            <FormLabel sx={{ cursor: 'pointer', mb: 0 }}>{label}</FormLabel>
          </Box>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

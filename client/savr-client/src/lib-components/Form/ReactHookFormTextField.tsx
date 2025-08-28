import { FormControl, FormHelperText, FormLabel, Input } from '@mui/joy';
import { Controller, useFormContext } from 'react-hook-form';

interface TextFieldRHFProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export const TextFieldRHF = ({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
}: TextFieldRHFProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl
          error={!!error}
          required={required}>
          <FormLabel>{label}</FormLabel>
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            error={!!error}
          />
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

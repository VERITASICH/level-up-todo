import { useState } from 'react';
import { useAppDispatch, useAuth } from '@/store/hooks';
import { registerUser } from '@/store/authSlise';
import type { RegisterData } from '@/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper
} from '@mui/material';

export const RegisterForm = () => {
  const [userData, setUserData] = useState<RegisterData>({
    email: '',
    password: '',
    age: undefined,
  });
  const [errors, setErrors] = useState<Partial<RegisterData & { confirmPassword: string }>>({});
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterData & { confirmPassword: string }> = {};

    if (!userData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!userData.password) {
      newErrors.password = 'Password is required';
    } else if (userData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (userData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (userData.age !== undefined && (userData.age < 1 || userData.age > 120)) {
      newErrors.age = 'Age must be between 1 and 120';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await dispatch(registerUser(userData)).unwrap();
      toast.success('Registration successful! Welcome aboard!');
      navigate('/');
    } catch (error: any) {
      toast.error(error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === 'age' ? parseInt(e.target.value) || undefined : e.target.value;
    setUserData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  return (
    <Box sx={{ maxWidth: 'sm', mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Register
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={userData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            required
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={userData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            required
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            margin="normal"
            required
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Age (optional)"
            name="age"
            type="number"
            value={userData.age || ''}
            onChange={handleChange}
            error={!!errors.age}
            helperText={errors.age}
            margin="normal"
            variant="outlined"
            inputProps={{
              min: 1,
              max: 120
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

import { useState } from 'react';
import { useAuth } from '@/store/hooks';
import { useAppDispatch } from '@/store/hooks';
import { changePassword } from '@/store/authSlise';
import { toast } from 'react-toastify';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Grid,
  Divider,
  Container
} from '@mui/material';

interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ProfilePage = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<PasswordChangeData>>({});

  const validatePasswordChange = (): boolean => {
    const newErrors: Partial<PasswordChangeData> = {};

    if (!passwordData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordChange()) {
      return;
    }

    setIsChangingPassword(true);
    
    try {
      await dispatch(changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })).unwrap();
      
      toast.success('Password changed successfully!');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors({});
    } catch (error: any) {
      toast.error(error || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof PasswordChangeData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, p: 3 }}>
      <Grid container spacing={4}>
        {/* User Profile Section */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom color="text.primary">
              Profile Information
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email
              </Typography>
              <Typography variant="h6" color="text.primary">
                {user.email}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Age
              </Typography>
              <Typography variant="h6" color="text.primary">
                {user.age ? `${user.age} years old` : 'Not specified'}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Member Since
              </Typography>
              <Typography variant="h6" color="text.primary">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Password Change Section */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom color="text.primary">
              Change Password
            </Typography>
            
            <Box component="form" onSubmit={handlePasswordChange} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Current Password"
                name="oldPassword"
                type="password"
                value={passwordData.oldPassword}
                onChange={handleInputChange}
                error={!!errors.oldPassword}
                helperText={errors.oldPassword}
                margin="normal"
                variant="outlined"
                required
              />

              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handleInputChange}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                margin="normal"
                variant="outlined"
                required
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                margin="normal"
                variant="outlined"
                required
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isChangingPassword}
                sx={{ mt: 3, mb: 2 }}
              >
                {isChangingPassword ? 'Changing Password...' : 'Change Password'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

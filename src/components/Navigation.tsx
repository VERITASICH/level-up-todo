import { Link } from 'react-router-dom';
import { useAuth } from '@/store/hooks';
import { logout } from '@/store/authSlise';
import { useAppDispatch } from '@/store/hooks';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box,
  Container
} from '@mui/material';

export const Navigation = () => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {isAuthenticated ? (
            <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  component={Link} 
                  to="/" 
                  color="inherit"
                  sx={{ textTransform: 'none' }}
                >
                  HomePage
                </Button>
                <Button 
                  component={Link} 
                  to="/addForm" 
                  color="inherit"
                  sx={{ textTransform: 'none' }}
                >
                  Add
                </Button>
                <Button 
                  component={Link} 
                  to="/profile" 
                  color="inherit"
                  sx={{ textTransform: 'none' }}
                >
                  Profile
                </Button>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Welcome, {user?.email}
                </Typography>
                <Button 
                  onClick={handleLogout} 
                  color="inherit"
                  sx={{ textTransform: 'none' }}
                >
                  Logout
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
              <Button 
                component={Link} 
                to="/register" 
                color="inherit"
                sx={{ textTransform: 'none' }}
              >
                Registration
              </Button>
              <Button 
                component={Link} 
                to="/login" 
                color="inherit"
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;

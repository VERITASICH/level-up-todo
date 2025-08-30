// Token management utilities
export const tokenStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },
  
  setTokens: (accessToken: string, refreshToken?: string): void => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  },
  
  clearTokens: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = tokenStorage.getAccessToken();
  if (!token) return false;
  
  return !tokenStorage.isTokenExpired(token);
};

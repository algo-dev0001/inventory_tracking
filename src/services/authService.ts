//  This is a mock authentication service
// In a real application, you would connect to your backend API

export const loginUser = async (email: string, password: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes only - in reality, would validate with server
  if (email && password.length >= 6) {
    return {
      success: true,
      user: {
        id: '123456',
        name: 'Demo User',
        email: email,
        picture: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      token: 'mock_jwt_token'
    };
  } else {
    throw new Error('Invalid credentials');
  }
};

export const registerUser = async (name: string, email: string, password: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes only - in reality, would register with server
  if (name && email && password.length >= 6) {
    return {
      success: true,
      user: {
        id: '123456',
        name: name,
        email: email,
        picture: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      token: 'mock_jwt_token'
    };
  } else {
    throw new Error('Invalid registration data');
  }
};

export const googleAuth = async () => {
  // Simulate Google OAuth flow
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes only - in reality, would trigger Google OAuth
  return {
    success: true,
    user: {
      id: 'google_123456',
      name: 'Google User',
      email: 'google.user@example.com',
      picture: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
    token: 'mock_google_oauth_token'
  };
};
 
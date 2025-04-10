//  This is a mock Service Worker file to simulate the Google OAuth flow
// In a real application, you would use Firebase Auth or another OAuth provider

self.addEventListener('fetch', event => {
  // Intercept requests to the Google OAuth endpoint
  if (event.request.url.includes('google-oauth')) {
    event.respondWith(
      new Response(
        JSON.stringify({
          success: true,
          user: {
            id: 'google_123456',
            name: 'Google User',
            email: 'google.user@example.com',
            picture: 'https://randomuser.me/api/portraits/men/4.jpg'
          },
          token: 'mock_google_oauth_token'
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    );
  }
});
 
// import { google } from 'googleapis';

// export async function getAccessToken(email: string, key: string): Promise<string> {
//   const jwtClient = new google.auth.JWT({
//     email: email,
//     key: key,
//     scopes: ['https://www.googleapis.com/auth/androidpublisher'],
//   });

//   try {
//     await jwtClient.authorize();
//     return jwtClient.credentials.access_token!;
//   } catch (error) {
//     console.error('Error getting access token:', error);
//     throw new Error('Failed to get access token');
//   }
// }

export interface User {
    iduser?: number; // Optional since it’s generated by backend
    username: string;
    useremail: string;
    password: string; // Only sent during creation/update
    profilePicture: string; // URL or base64 string
    role: string; // e.g., 'USER' or 'ADMIN'
  }
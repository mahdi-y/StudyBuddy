export interface User {
  
    id: number;
    name: string;
    username: string;
    address: string;
    mobileNo: string;
    age: number;
    role: string;
    password?: string; // Optional for create/update
   }
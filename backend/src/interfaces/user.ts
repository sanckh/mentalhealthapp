export interface User {
    userId: string;
    name: string;
    email?: string;
    profilePicture?: string;
    createdAt: Date; 
}
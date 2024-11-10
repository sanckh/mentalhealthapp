export interface userModel {
    userId: string;
    name: string;
    email?: string;
    profilePicture?: string;
    createdAt: Date;
}
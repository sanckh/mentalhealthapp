export interface userModel {
    userId: string;
    name: string;
    email?: string;
    profileImageUrl?: string;
    createdAt: Date;
}
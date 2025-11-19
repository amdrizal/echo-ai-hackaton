export interface User {
    id: number;
    email: string;
    password_hash: string;
    full_name: string;
    phone_number?: string;
    created_at: Date;
    updated_at: Date;
}
export interface CreateUserInput {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
}
export interface UserResponse {
    id: number;
    email: string;
    fullName: string;
    phoneNumber?: string;
    createdAt: Date;
}
export declare const createUser: (input: CreateUserInput) => Promise<User>;
export declare const findUserByEmail: (email: string) => Promise<User | null>;
export declare const findUserById: (id: number) => Promise<User | null>;
export declare const verifyPassword: (password: string, hash: string) => Promise<boolean>;
export declare const userToResponse: (user: User) => UserResponse;
//# sourceMappingURL=user.model.d.ts.map
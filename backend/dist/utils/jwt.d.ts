export declare const generateToken: (payload: {
    id: number;
    email: string;
}) => string;
export declare const verifyToken: (token: string) => {
    id: number;
    email: string;
};
//# sourceMappingURL=jwt.d.ts.map
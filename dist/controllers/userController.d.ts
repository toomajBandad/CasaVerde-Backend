import { Request, Response } from "express";
export declare const getMe: (req: Request, res: Response) => Promise<void>;
export declare const getUsers: (req: Request, res: Response) => Promise<void>;
export declare const getUserById: (req: Request, res: Response) => Promise<void>;
export declare const createUser: (req: Request, res: Response) => Promise<void>;
export declare const sendMail: (req: Request, res: Response) => Promise<void>;
export declare const updateUser: (req: Request, res: Response) => Promise<void>;
export declare const deleteUser: (req: Request, res: Response) => Promise<void>;
export declare const loginUser: (req: Request, res: Response) => Promise<void>;
export declare const searchUsersByName: (req: Request, res: Response) => Promise<void>;
export declare const getUserFavorite: (req: Request, res: Response) => Promise<void>;
export declare const addUserFavorite: (req: Request, res: Response) => Promise<void>;
export declare const deleteUserFavorite: (req: Request, res: Response) => Promise<void>;
export declare const changeAvatar: (req: Request, res: Response) => Promise<void>;
export declare const contactUs: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map
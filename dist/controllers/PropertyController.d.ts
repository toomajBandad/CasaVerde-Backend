import { Request, Response } from "express";
export declare const getProperties: (req: Request, res: Response) => Promise<void>;
export declare const getPropertyById: (req: Request, res: Response) => Promise<void>;
export declare const createProperty: (req: Request, res: Response) => Promise<void>;
export declare const updateProperty: (req: Request, res: Response) => Promise<void>;
export declare const deleteProperty: (req: Request, res: Response) => Promise<void>;
export declare const assignOwner: (req: Request, res: Response) => Promise<void>;
export declare const getPropertiesByOwner: (req: Request, res: Response) => Promise<void>;
export declare const getPropertiesByCity: (req: Request, res: Response) => Promise<void>;
export declare const assignCategoryToProperty: (req: Request, res: Response) => Promise<void>;
export declare const getPropertiesByCategory: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=PropertyController.d.ts.map
import mongoose, { Document, Types } from "mongoose";
export interface IUser {
    username: string;
    email: string;
    password: string;
    recentSearches?: Record<string, any>;
    messages?: any[];
    favorites?: Types.ObjectId[];
    image?: string;
}
export type UserDocument = IUser & Document;
declare const User: mongoose.Model<UserDocument, {}, {}, {}, mongoose.Document<unknown, {}, UserDocument> & IUser & mongoose.Document<unknown, any, any> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=userModel.d.ts.map
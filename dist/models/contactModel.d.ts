import mongoose, { Document } from "mongoose";
export interface IContact {
    name: string;
    family: string;
    message: string;
    email: string;
}
export type ContactDocument = IContact & Document;
declare const Contact: mongoose.Model<ContactDocument, {}, {}, {}, mongoose.Document<unknown, {}, ContactDocument> & IContact & mongoose.Document<unknown, any, any> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Contact;
//# sourceMappingURL=contactModel.d.ts.map
import mongoose, { Document } from "mongoose";
export interface ICity {
    province: string;
    name: string;
    location?: string[];
}
export type CityDocument = ICity & Document;
declare const City: mongoose.Model<CityDocument, {}, {}, {}, mongoose.Document<unknown, {}, CityDocument> & ICity & mongoose.Document<unknown, any, any> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default City;
//# sourceMappingURL=cityModel.d.ts.map
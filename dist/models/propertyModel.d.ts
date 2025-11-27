import mongoose, { Document, Types } from "mongoose";
export interface IProperty {
    title: string;
    desc: string;
    location: string;
    price: string;
    duration: string;
    bedrooms: string;
    bathrooms: string;
    pets: string;
    couples: string;
    minors: string;
    owner: Types.ObjectId;
    contractCategory: Types.ObjectId;
    typeCategory: Types.ObjectId;
    image?: string;
    city: string;
    latlng?: any[];
    area: string;
}
export type PropertyDocument = IProperty & Document;
declare const Property: mongoose.Model<PropertyDocument, {}, {}, {}, mongoose.Document<unknown, {}, PropertyDocument> & IProperty & mongoose.Document<unknown, any, any> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Property;
//# sourceMappingURL=propertyModel.d.ts.map
import mongoose from "mongoose";
export interface ITypeCategory {
    name: "Apartment" | "Villa" | "Flat" | "Room" | "Office" | "Garage" | "Storage";
    desc: string;
}
declare const TypeCategory: mongoose.Model<ITypeCategory & mongoose.Document<unknown, any, any>, {}, {}, {}, mongoose.Document<unknown, {}, ITypeCategory & mongoose.Document<unknown, any, any>> & ITypeCategory & mongoose.Document<unknown, any, any> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default TypeCategory;
//# sourceMappingURL=typeCategoryModel.d.ts.map
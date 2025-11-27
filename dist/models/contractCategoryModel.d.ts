import mongoose, { Document } from "mongoose";
export interface IContractCategory {
    name: "BUY" | "RENT" | "SHARE";
    desc: string;
}
export type ContractCategoryDocument = IContractCategory & Document;
declare const ContractCategory: mongoose.Model<ContractCategoryDocument, {}, {}, {}, mongoose.Document<unknown, {}, ContractCategoryDocument> & IContractCategory & mongoose.Document<unknown, any, any> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default ContractCategory;
//# sourceMappingURL=contractCategoryModel.d.ts.map
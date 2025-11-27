import mongoose, { Document } from "mongoose";
export interface INewsItem {
    title: string;
    desc: string;
    img?: string;
    type?: Record<string, any>;
}
export interface INews {
    category: string;
    mainTitle: string;
    items: INewsItem[];
}
export type NewsDocument = INews & Document;
declare const News: mongoose.Model<NewsDocument, {}, {}, {}, mongoose.Document<unknown, {}, NewsDocument> & INews & mongoose.Document<unknown, any, any> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default News;
//# sourceMappingURL=newsModel.d.ts.map
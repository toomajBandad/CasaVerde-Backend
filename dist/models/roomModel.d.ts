import mongoose, { Document, Types } from "mongoose";
export interface IRoom {
    users: Types.ObjectId[];
    property: Types.ObjectId;
}
export type RoomDocument = IRoom & Document;
declare const Room: mongoose.Model<RoomDocument, {}, {}, {}, mongoose.Document<unknown, {}, RoomDocument> & IRoom & mongoose.Document<unknown, any, any> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Room;
//# sourceMappingURL=roomModel.d.ts.map
import mongoose, { Document, Types } from "mongoose";
export interface IMessage {
    senderId: Types.ObjectId;
    senderName: string;
    receiverId: Types.ObjectId;
    receiverName: string;
    roomId: Types.ObjectId;
    message: string;
    time?: string;
    date?: string;
}
export type MessageDocument = IMessage & Document;
declare const Message: mongoose.Model<MessageDocument, {}, {}, {}, mongoose.Document<unknown, {}, MessageDocument> & IMessage & mongoose.Document<unknown, any, any> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Message;
//# sourceMappingURL=messageModel.d.ts.map
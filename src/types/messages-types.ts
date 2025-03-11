export interface Messages {
  status: "SENT" | "READ" | "DELIVERED";
  receiver_id: string;
  createdDate: Date;
  message_id: string;
  message: string;
  sender_id: string;
}
export interface GetMessagesApiRespnse {
  messages: Messages[];
  nextCursor: string;
}

export interface IRoom {
    name: string;
    id: string;
    sockets: string[];
    lastActivity: number;
    chats: IChat[];
}

export type IChat =
    | {
          type: "system";
          message: string;
      }
    | {
          type: "user";
          name: string;
          socket_id: string;
          message: string;
      };

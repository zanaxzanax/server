import Socket = SocketIO.Socket;

export interface PlayerItem {
    name: string;
    uuid: string;
    state: number;
}

export interface UserItem extends PlayerItem {
    socket: Socket;
}

export interface PlayerOptions {
    name: string;
    uuid: string;
}

export interface PlayerInterface {
    name: string;
    uuid: string;
    state: number;
    isReady: () => boolean;
    setState: (value: number) => void;
    toJSON: () => PlayerItem;
    isLoser: () => boolean;
    isWinner: () => boolean;
}

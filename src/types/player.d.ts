export interface PlayerItem {
    name: string;
    uuid: string;
    state: number;
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
    toJSON: () => PlayerItem;
}

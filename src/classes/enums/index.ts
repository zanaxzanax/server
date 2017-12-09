export enum GameState {
    CREATED, PLAY, WIN, LOSE, DELETED
}

export enum GameTypes {
    SINGLE, MULTIPLAYER
}

export enum GameEventType {
    PIVOT, TICK
}

export enum GameSide {
    LEFT, RIGHT
}

export enum PlayerState {
    NOT_READY, READY
}

export enum PivotPointType {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

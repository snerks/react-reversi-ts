import * as React from 'react';

import { GameCellIsWhiteStatus } from '../types/CustomTypes';
import GameBoard from './GameBoard';

export const initialGameBoard: GameCellIsWhiteStatus[] = [
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, true, false, undefined, undefined, undefined,
    undefined, undefined, undefined, false, true, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
];

export interface GamePageProps {
}

class GamePage extends React.Component<GamePageProps, {}> {
    render(): JSX.Element {
        return (
            <GameBoard board={initialGameBoard} />
        );
    }
}

export default GamePage;

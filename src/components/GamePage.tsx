import * as React from 'react';

import { GameCellIsWhiteStatus } from '../types/CustomTypes';
import GameBoard from './GameBoard';

export interface GamePageProps {
}

class GamePage extends React.Component<GamePageProps, {}> {
    render(): JSX.Element {
        const board: GameCellIsWhiteStatus[] = [
            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, true, false, undefined, undefined, undefined,
            undefined, undefined, undefined, false, true, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        ];

        return (
            <GameBoard board={board} />
        );
    }
}

export default GamePage;

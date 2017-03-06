import * as React from 'react';

import './GameBoard.css';

import { GameCellStatus } from '../types/CustomTypes';

import GameCell from './GameCell';

export interface GameBoardProps {
    board: GameCellStatus[];
}

export interface GameBoardState {
    board: GameCellStatus[];

    currentPlayerIsWhite: boolean;

    validCells: number[];
}

interface CellStatusAndIndex {
    status: GameCellStatus;
    index: number;
}

class GameBoard extends React.Component<GameBoardProps, GameBoardState> {
    constructor(props: GameBoardProps) {
        super(props);

        this.state = {
            board: props.board,
            currentPlayerIsWhite: true,
            validCells: []
        };
    }

    getBoardCellIndex(row: number, column: number): number {
        return row * 8 + column;
    }

    getBoardCellCoords(index: number): { row: number, column: number } {
        const column = index % 8;
        const row = (index - column) / 8;

        return { row, column };
    }

    getAdjacentCellCoords(row: number, column: number): number[][] {
        const allAdjacentCellRefs = [
            [row - 1, column - 1], [row - 1, column], [row - 1, column + 1],
            [row, column - 1], [row, column + 1],
            [row + 1, column - 1], [row + 1, column], [row + 1, column + 1]
        ];

        const adjacentRealCellRefs = allAdjacentCellRefs.filter(
            cellRef => cellRef[0] > -1 && cellRef[1] > -1 && cellRef[0] < 8 && cellRef[1] < 8
        );

        return adjacentRealCellRefs;
    }

    getValidCells(currentState: GameBoardState): number[] {
        const emptyCells = currentState.board.map((status: GameCellStatus, index: number): CellStatusAndIndex => {
            const isEmptyCell = status === undefined;

            if (isEmptyCell) {
                return {
                    status,
                    index
                };
            }

            return {
                status,
                index: -1
            };
        });

        const emptyCellsOnly = emptyCells.filter(emptyCell => emptyCell.index > -1);
        console.log(`Empty Cells Only: [${emptyCellsOnly}]`);

        const emptyCellsWithAdjacentOpponentCell: CellStatusAndIndex[] = [];

        for (let emptyCell of emptyCellsOnly) {
            const column = emptyCell.index % 8;
            const row = (emptyCell.index - column) / 8;

            // tslint:disable-next-line:no-console
            console.log(`Empty Cell: [${emptyCell.index}]`);
            console.log(`Empty Cell at [${row}.${column}]`);

            const adjacentCellCoords = this.getAdjacentCellCoords(row, column);
            console.log(`adjacentCellCoords: [${adjacentCellCoords}]`);

            for (let adjacentCellCoordsItem of adjacentCellCoords) {
                const adjacentCellIndex = this.getBoardCellIndex(adjacentCellCoordsItem[0], adjacentCellCoordsItem[1]);
                const adjacentCellStatus = currentState.board[adjacentCellIndex];

                const adjacentCellIsPopulatedCell = adjacentCellStatus !== undefined;

                const adjacentCellIsOpponentCell = (
                    adjacentCellIsPopulatedCell &&
                        currentState.currentPlayerIsWhite ? !adjacentCellStatus : adjacentCellStatus
                );

                if (adjacentCellIsOpponentCell) {
                    emptyCellsWithAdjacentOpponentCell.push(emptyCell);
                    continue;
                }
            }
        }

        return emptyCellsWithAdjacentOpponentCell.map(emptyCell => emptyCell.index);
    }

    componentWillMount() {
        this.setState({ validCells: this.getValidCells(this.state) });
    }

    handleCellClick(row: number, column: number) {
        // alert(`Clicked Row: ${row} - Col: ${column}`);

        const boardCellIndex = this.getBoardCellIndex(row, column);
        const selectedGameCellStatus: GameCellStatus = this.state.currentPlayerIsWhite;

        const cellsBefore = this.state.board.slice(0, boardCellIndex);
        const cellsAfter = this.state.board.slice(boardCellIndex + 1);

        const nextBoard = [
            ...cellsBefore,
            selectedGameCellStatus,
            ...cellsAfter
        ];

        const nextState = {
            board: nextBoard,
            currentPlayerIsWhite: !this.state.currentPlayerIsWhite,
            validCells: []
        };

        const validCells = this.getValidCells(nextState);

        this.setState({
            board: nextBoard,
            currentPlayerIsWhite: !this.state.currentPlayerIsWhite,
            validCells
        });
    }

    render(): JSX.Element {
        const gameCellRows: JSX.Element[] = [];

        for (let i = 0; i < 8; i++) {
            let gameCellColumns: JSX.Element[] = [];

            for (let j = 0; j < 8; j++) {
                const boardCellIndex = this.getBoardCellIndex(i, j);

                const isValidCell = this.state.validCells.indexOf(boardCellIndex) > -1;

                // tslint:disable-next-line:no-empty
                const noOp = () => { };
                const handleClickFunction = (row: number, column: number) => this.handleCellClick(row, column);

                gameCellColumns.push(
                    <td key={j} className="cell" width={20}>
                        <GameCell
                            row={i}
                            column={j}
                            isWhite={this.state.board[boardCellIndex]}
                            handleClick={isValidCell ? handleClickFunction : noOp}
                            isValid={isValidCell}
                        />
                    </td>
                );
            }

            gameCellRows.push(<tr key={i}>{gameCellColumns}</tr>);
        }

        return (
            <div>
                <table className="table table-bordered" style={{ tableLayout: 'fixed' }}>
                    <tbody>
                        {gameCellRows}
                    </tbody>
                </table>
                <div>Current Player is White?: <span>{this.state.currentPlayerIsWhite ? 'Yes' : 'No'}</span></div>

                <div>Valid Cells</div>
                <pre style={{ height: '500px', textAlign: 'left' }}>
                    {
                        JSON.stringify(
                            this.state.validCells.map(index => this.getBoardCellCoords(index)),
                            null,
                            2)
                    }
                </pre>
            </div>
        );
    }
}

export default GameBoard;

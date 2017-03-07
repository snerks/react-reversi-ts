import * as React from 'react';

import './GameBoard.css';

import { GameCellIsWhiteStatus } from '../types/CustomTypes';

import GameCell from './GameCell';

export interface GameBoardProps {
    board: GameCellIsWhiteStatus[];
}

export interface GameBoardState {
    board: GameCellIsWhiteStatus[];

    currentPlayerIsWhite: boolean;

    validCells: number[];
}

interface CellStatusAndIndex {
    status: GameCellIsWhiteStatus;
    index: number;
}

interface CellLine {
    items: CellStatusAndIndex[];
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

    getAdjacentCellLines(row: number, column: number): CellLine[] {

        const result: CellLine[] = [];

        // start at 12 o'clock
        result.push(this.getAdjacentCellLine(row, column, -1, 0));
        result.push(this.getAdjacentCellLine(row, column, -1, 1));
        result.push(this.getAdjacentCellLine(row, column, 0, 1));
        result.push(this.getAdjacentCellLine(row, column, 1, 1));
        result.push(this.getAdjacentCellLine(row, column, 1, 0));
        result.push(this.getAdjacentCellLine(row, column, 1, -1));
        result.push(this.getAdjacentCellLine(row, column, 0, -1));
        result.push(this.getAdjacentCellLine(row, column, -1, -1));

        return result;
    }

    getAdjacentCellLine(
        row: number,
        column: number,
        rowOffest: number,
        columnOffset: number): CellLine {

        const result: CellLine = {
            items: []
        };

        let currentRowIndex = row;
        let currentColumnIndex = column;

        let adjacentCellStatusAndIndex: CellStatusAndIndex | null;

        do {
            adjacentCellStatusAndIndex =
                this.getAdjacentCellStatusAndIndex(
                    currentRowIndex,
                    currentColumnIndex,
                    rowOffest,
                    columnOffset
                );

            if (adjacentCellStatusAndIndex) {
                result.items.push(adjacentCellStatusAndIndex);

                currentRowIndex += rowOffest;
                currentColumnIndex += columnOffset;
            }
        } while (!!adjacentCellStatusAndIndex);

        return result;
    }

    getAdjacentCellStatusAndIndex(
        row: number,
        column: number,
        rowOffest: number,
        columnOffset: number): CellStatusAndIndex | null {

        const candidateCellLineItemRowIndex = row + rowOffest;
        const candidateCellLineItemColumnIndex = column + columnOffset;

        const candidateCellLineItemRowIndexIsInRange =
            candidateCellLineItemRowIndex > -1 &&
            candidateCellLineItemRowIndex < 8;

        const candidateCellLineItemColumnIndexIsInRange =
            candidateCellLineItemColumnIndex > -1 &&
            candidateCellLineItemColumnIndex < 8;

        const candidateCellLineItemCoordsInRange =
            candidateCellLineItemRowIndexIsInRange &&
            candidateCellLineItemColumnIndexIsInRange;

        if (!candidateCellLineItemCoordsInRange) {
            return null;
        }

        const candidateCellLineItemIndex =
            this.getBoardCellIndex(candidateCellLineItemRowIndex, candidateCellLineItemColumnIndex);

        const candidateCellLineItemIsWhiteStatus = this.state.board[candidateCellLineItemIndex];

        return {
            status: candidateCellLineItemIsWhiteStatus,
            index: candidateCellLineItemIndex
        };
    }

    getValidCells(currentState: GameBoardState): number[] {
        const emptyCells = currentState.board.map(
            (status: GameCellIsWhiteStatus, index: number): CellStatusAndIndex => {
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
        // tslint:disable-next-line:no-console
        // console.log(`Empty Cells Only: [${emptyCellsOnly}]`);

        const emptyCellsWithAdjacentOpponentCell: CellStatusAndIndex[] = [];

        for (let emptyCell of emptyCellsOnly) {
            const column = emptyCell.index % 8;
            const row = (emptyCell.index - column) / 8;

            const willDebug = emptyCell.index === 20;

            if (willDebug) {
                // tslint:disable-next-line:no-console
                console.log('willDebug');
            }

            const adjacentCellLines = this.getAdjacentCellLines(row, column);

            for (let adjacentCellLine of adjacentCellLines) {
                if (adjacentCellLine.items.length) {

                    let adjacentOpponentCellCount = 0;
                    // let firstAdjacentCellStatusAndIndex = adjacentCellLine.items[0];

                    for (let i = 0; i < adjacentCellLine.items.length; i++) {
                        let currentAdjacentCellStatusAndIndex = adjacentCellLine.items[i];

                        let adjacentCellIsWhiteStatus = currentAdjacentCellStatusAndIndex.status;
                        let adjacentCellIsPopulated = adjacentCellIsWhiteStatus !== undefined;

                        if (!adjacentCellIsPopulated) {
                            break;
                        }

                        let adjacentCellIsOpponentCell = (
                            adjacentCellIsPopulated &&
                                currentState.currentPlayerIsWhite ?
                                !adjacentCellIsWhiteStatus : adjacentCellIsWhiteStatus
                        );

                        if (adjacentCellIsOpponentCell) {
                            adjacentOpponentCellCount++;
                        } else {
                            // Is current player cell
                            if (adjacentOpponentCellCount > 0) {
                                emptyCellsWithAdjacentOpponentCell.push(emptyCell);
                            }

                            break;
                        }
                    }
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
        const selectedGameCellStatus: GameCellIsWhiteStatus = this.state.currentPlayerIsWhite;

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

                <div>Current Player: <span>{this.state.currentPlayerIsWhite ? 'White' : 'Black'}</span></div>

                <div>Valid Cells</div>
                <pre style={{ height: '500px', textAlign: 'left' }}>
                    {
                        JSON.stringify(
                            this.state.validCells.map(index => this.getBoardCellCoords(index)),
                            null,
                            2
                        )
                    }
                </pre>
            </div>
        );
    }
}

export default GameBoard;

import * as React from 'react';

export interface GameCellProps {
    row: number;
    column: number;

    isWhite?: boolean;

    isValid: boolean;

    handleClick: (row: number, column: number) => void;
}

class GameCell extends React.Component<GameCellProps, {}> {
    render() {
        const { row, column, isWhite, handleClick, isValid } = this.props;

        const isOccupied = isWhite !== undefined;

        const discColor = isOccupied ? isWhite ? 'white' : 'black' : null;

        let emptyCellContent = '\u00a0';

        if (!isOccupied && isValid) {
            emptyCellContent = '\u2713';
        }

        const discContent = isOccupied ? '🌑' : emptyCellContent;

        const content = <span style={{ fontSize: '40px', color: discColor }}>{discContent}</span>;

        return (
            <div
                // tslint:disable-next-line:no-empty
                onClick={isOccupied ? () => { } : () => handleClick(row, column)}
                style={{ cursor: isValid ? 'pointer' : 'not-allowed' }}
            >
                {content}
            </div>
        );
    }
}

export default GameCell;

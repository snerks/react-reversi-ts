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

        let emptyCellText = '\u00a0';

        if (!isOccupied && isValid) {
            emptyCellText = '\u2713';
        }

        const emptyCellContent = <span style={{ fontSize: '25px', color: discColor }}>{emptyCellText}</span>;

        // const discContent = isOccupied ? '🌑' : emptyCellContent;
        const discContent = isOccupied ? (
            // <i className="glyphicon glyphicon-certificate" aria-hidden="true" />
            <span
                style={{
                    display: 'inline-block',
                    width: '2em',
                    height: '2em',
                    borderRadius: '1em',
                    margin: '0.25em',
                    backgroundColor: discColor
                }}
            />
        ) : emptyCellContent;

        // const content = <span style={{ fontSize: '10px', color: discColor }}>{discContent}</span>;
        const content = discContent;

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

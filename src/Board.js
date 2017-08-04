
import React, {Component} from 'react';
import Cell from './Cell.js';

class Board extends Component {
    static propTypes = {
        board: React.PropTypes.any,
        Reveal: React.PropTypes.func,
        Flag: React.PropTypes.func,
        superman: React.PropTypes.bool
    };
    //Defines what the board will look like in each situation and what will be in each cell in each situation.
    //If -1 is then a mine, if 0 is then empty and if a number then assigns the number
    renderRow(row, rowIndex) {
        return (
            row.map((cell, cellIndex)=> {
                    let cellColor, cellText;
                    if (this.props.superman) {
                        cell.cellValue === -1 ? cellText = '💣111' :
                            cell.cellValue === 0 ? cellText = null :
                                cellText = cell.cellValue.toString();
                        cell.revealed ?
                            cellColor = "#FF1493" :
                            cell.flagged ?
                                (cellColor = "#FF1493" ,cellText = '🚩'):
                                cellColor = "#FF1493"
                    }
                    else {
                        if (cell.revealed) {
                            cellColor = "#6A5ACD";
                            cell.cellValue === -1 ? cellText = '💣' :
                                cell.cellValue === 0 ? cellText = null :
                                    cellText = cell.cellValue.toString();
                        }
                        else if (cell.flagged) {
                            cellColor = "#6A5ACD";
                            cellText = '🚩';
                        } else {
                            cellColor = "#FF1493";
                            cellText = null;
                        }
                    }
                    return (<td key={cellIndex}>
                        <Cell
                            text={cellText}
                            color={cellColor}
                            onClick={() => this.props.Reveal(rowIndex, cellIndex)}
                            onShiftClick={() => this.props.Flag(rowIndex, cellIndex)}
                        />
                    </td>);
                }
            )
        );
    }

    render() {
        return (
            <table style={{userSelect: "none"}}>
                {this.props.board.map((row, rowIndex)=> {
                    return (<tr key={rowIndex}>{this.renderRow(row, rowIndex)}</tr>);
                })}
            </table>
        );
    }
}

export default Board;

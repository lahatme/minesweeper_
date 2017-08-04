import React, {Component} from 'react';
import deepcopy from 'deepcopy';
import Board from './Board.js';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';


class Game extends Component {
    static propTypes = {
        boardHeight: React.PropTypes.number,
        boardWidth: React.PropTypes.number,
        mines: React.PropTypes.number,
        superman: React.PropTypes.bool,
        startNewGame: React.PropTypes.bool
    };

    componentWillMount() {
        this.start_Game();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.startNewGame) {
            this.props = newProps;
            this.start_Game();
        }
    }

    start_Game() {
        let board = this.init_Board();
        this.setState({
            boardArray: board,
            status: "PLAYING",
            numOfCellFlagged: this.props.mines ,
            numOfCellFlaggedCorrectly: this.props.mines,
            
        });
    }

    init_Board() {
        let boardArray = [];
        for (let i = 0; i < this.props.boardHeight; i++) {
            boardArray.push([]);
            for (let j = 0; j < this.props.boardWidth; j++) {
                boardArray[i].push({cellValue: 0, revealed: false, flagged: false});
            }
        }

        let randomRow, randomCol;
        let i=0;
        //Put mines (in the number of mines defined) in random cells
        while(i<this.props.mines){
            randomCol = Math.floor(Math.random() * this.props.boardWidth);
            randomRow = Math.floor(Math.random() * this.props.boardHeight);
            if (!this.is_Mine(boardArray, randomRow, randomCol)){
                boardArray[randomRow][randomCol].cellValue = -1;
                i++;
            }

        }


        //Calculate the value of the cells around each mine, by adding 1 to each cell around each mine

        for (let i = 0; i < this.props.boardHeight; i++) {
            for (let j = 0; j < this.props.boardWidth; j++) {
                if (this.is_Mine(boardArray, i, j)){
                    this.up_value(boardArray, i-1,j-1);
                    this.up_value(boardArray, i-1,j);
                    this.up_value(boardArray, i-1,j+1);
                    this.up_value(boardArray, i,j-1);
                    this.up_value(boardArray, i+1,j-1);
                    this.up_value(boardArray, i+1,j+1);
                    this.up_value(boardArray, i+1,j);
                    this.up_value(boardArray, i,j+1);



                }
            }
        }

        return boardArray;
    }
    //Raising the value of the cell if one of the neighboring cells has a mine
    up_value(boardArray,i,j){
        if (!(i<0 || i>this.props.boardHeight-1 || j<0 || j>this.props.boardWidth-1 )){
            if (!(this.is_Mine(boardArray, i, j))){
              return boardArray[i][j].cellValue ++;
            }
        }
    }
    


    is_Mine(boardArray, i, j) {
        return boardArray[i][j].cellValue === -1;
    }

    

   
    //reveal cell when pressed
    reveal_Cell(row, col) {
        if (this.state.status !== "PLAYING"||this.check_flag_revealed(this.state.boardArray,row,col))
            return;
     
        let boardArrCpy = deepcopy(this.state.boardArray);
        boardArrCpy[row][col].revealed = true;

        //If the cell value is 0 then expose the possible neighbors of this cell

        if (boardArrCpy[row][col].cellValue === 0){
            boardArrCpy = this.Neighbors(boardArrCpy, row, col);
        }
        this.setState({boardArray: boardArrCpy});

        if (this.is_Mine(this.state.boardArray, row, col))
            this.gameOver();
    }
   //Exposing neighbors
    Neighbors(boardArray, row, col) {
        if (boardArray[row][col].cellValue > 0)
            return boardArray;
        if (this.check_Bounds(row,col))
            return boardArray;
        for (let x = 0; x <= 2; x++) {
            for (let y = 0; y <= 2; y++) {
                if (!this.check_Bounds((row - 1 + x), (col - 1 + y )) && ( boardArray[row - 1 + x][col - 1 + y].cellValue >= 0)) {
                        if (!this.check_flag_revealed(boardArray,row-1+x,col-1+y)) {
                            boardArray[row - 1 + x][col - 1 + y].revealed = true;
                            boardArray = this.Neighbors(boardArray, (row - 1 + x), ( col - 1 + y));
                        }
                }
            }
        }
    
        return boardArray;
    }
    
    //Check if the cell is within the boundaries of the matrix
    check_Bounds(row,col){
        return (row<0 || row>this.props.boardHeight-1 || col<0 || col>this.props.boardWidth-1 )

    }
    

    check_flag_revealed(boardArray,row,col){
    return ((boardArray[row][col].revealed) && !(boardArray[row][col].flagged))
    }


    flag_Cell(row, col) {
        if (this.state.status !== "PLAYING" || this.state.boardArray[row][col].revealed )
            return;

        let boardArrCpy = deepcopy(this.state.boardArray);
        let numOfCellFlaggedCpy = this.state.numOfCellFlagged;
        let numOfCellFlaggedCorrectlyCpy = this.state.numOfCellFlaggedCorrectly;

        //Remove flag from cell
        if (this.state.boardArray[row][col].flagged) {
            boardArrCpy[row][col].flagged = false;
            numOfCellFlaggedCpy++;
            if (this.is_Mine(boardArrCpy, row, col)) 
                numOfCellFlaggedCorrectlyCpy++;
        }
        //Put a flag on the cell
        else {
            if (numOfCellFlaggedCpy > 0) {
                boardArrCpy[row][col].flagged = true;
                numOfCellFlaggedCpy--;
                if (this.is_Mine(boardArrCpy, row, col)){
                     numOfCellFlaggedCorrectlyCpy--;
                     //All the flags in their right places
                    if (numOfCellFlaggedCorrectlyCpy === 0)
                        this.gameWinner();
                 }
            }

            //All the flags were gone
            else {
                this.setState({
                    showAlert: true,
                    alertTitle: "No More Flags!",
                    alertType: 'warning',
                    alertConfirmButtonText: 'Back'
                });
            }
        }

        this.setState({
            boardArray: boardArrCpy,
            numOfCellFlagged: numOfCellFlaggedCpy,
            numOfCellFlaggedCorrectly: numOfCellFlaggedCorrectlyCpy
        });

       
    }

    gameOver() {
        this.setState({
            showAlert: true,
            alertTitle: "GAME OVER!",
            alertType: 'error',
            alertConfirmButtonText: 'New Game'
        });
    }

    gameWinner() {
        this.setState({
            showAlert: true,
            alertTitle: "You WIN!",
            alertType: 'success',
            alertConfirmButtonText: 'New Game'
        });
    }

    render() {
        return (
            <div style={{color:'#4682B4', display: 'inline-block', fontSize:'16'}}>
                {this.state.status} <br />
                Flags Left:{ this.state.numOfCellFlagged} <br />

                <Board
                    board={this.state.boardArray}
                    Reveal={(row, col) => this.reveal_Cell(row, col)}
                    Flag={(row, col) => this.flag_Cell(row, col)}
                    superman={this.props.superman}
                />

                <SweetAlert
                    show={this.state.showAlert}
                    title={this.state.alertTitle}
                    type={this.state.alertType}
                    confirmButtonText={this.state.alertConfirmButtonText}
                    onConfirm={() => this.setState({showAlert: false})}
                />
            </ div >
        );
    }
}

export default Game;

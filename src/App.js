import React, {Component} from 'react';
import Game from './Game.js';
import {Button} from 'react-mdl';

class App extends Component {

    constructor() {
        super();
        this.state = {
            width: 10,
            height: 8,
            mines: 9,
            superman: false,
            txtWidth: 10,
            txtHeight: 8,
            txtMines: 9,
            startNewGame: false,
            maxMines: 8*10,
        };
    }
    //When the width field changes, we change the width of the matrix and limit the number of mines to the number of cells in the new matrix

    set_Board_Width(width) {
        if (width < 1) this.width = 1;
        if (width > 300) this.width = 300;
        let updateMaxMines = width * this.state.height;
        if (this.state.mines > updateMaxMines) this.state.mines=updateMaxMines;
        this.setState({width:width, txtWidth: width, txtMines:this.props.mines , maxMines:updateMaxMines, startNewGame: false});
    }
    //When the height field changes, we change the width of the matrix and limit the number of mines to the number of cells in the new matrix

    set_Board_Height(height) {
        if (height < 1) {this.height = 1;}
        if (height > 300) {this.height = 300;}
        let updateMaxMines = height * this.state.width;
        this.setState({ height:height, txtHeight: height, txtMines: this.props.mines,maxMines: updateMaxMines, startNewGame: false});
    }
    //Check that the number of mines is greater than 1 and smaller / equal to the size of the matrix and update the number of mines

    set_Board_Mines(mines) {
        if (mines < 1) {this.mines = 1;}
        if (mines > this.state.maxMines) {mines = this.state.maxMines;}
        this.setState({mines: mines, txtMines : mines, startNewGame: false});
    }
    //If the button is checked then you will expose the board
    set_Superman(superman) {
        this.setState({superman:superman , startNewGame: false});
    }

    restart_Game() {
        let newHeight = this.state.txtHeight;
        let newWidth = this.state.txtWidth;
        let newMines = this.state.txtMines;
        let updateSuperman = false;

        this.setState({
            height: newHeight,
            width: newWidth,
            mines: newMines,
            superman: updateSuperman,
            startNewGame: true
        });
    }

    render() {
        return (
            <div className="App">
                <h1 style={{color:'#841584'}}>
                    My Minesweeper
                </h1>
                <table style={{width: '1000', textAlign: 'center', color:"#841584", fontSize:'20'}}>
                    <tr>
                        <td>
                            Superman:
                            <input name="Superman" type="checkbox" onChange={(e) => this.set_Superman(e.target.checked)} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Height: 
                            <input onChange={(e) => this.set_Board_Height(e.target.value)}
                                    defaultValue={this.state.txtHeight}/>
                        </td>
                        <td>
                            Width:
                            <input onChange={(e) => this.set_Board_Width(e.target.value)} 
                                    defaultValue={this.state.txtWidth}/>
                        </td>
                        <td>
                            Mines:
                            <input onInput={(e) => this.set_Board_Mines(e.target.value)}
                                    defaultValue={this.state.txtMines} />
                        </td>
                        <td>
                            <Button raised colored onClick={() => this.restart_Game()}>New Game</Button>
                        </td>
                    </tr>
                </table>

                <div className="game">
                    <Game
                        boardHeight={this.state.height} boardWidth={this.state.width} mines={this.state.mines}
                        superman={this.state.superman} startNewGame={this.state.startNewGame}/>
                </div>
            </div>
        );
    }
}

export default App;

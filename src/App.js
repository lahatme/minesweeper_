import React, {Component} from 'react';
import Game from './Game.js';
import {Button} from 'react-mdl';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
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
            showAlert: false,
            alertTitle: "Allowed up to 300!",
            alertType: 'warning',
            alertConfirmButtonText: 'Back'
        };
    }
    //When the width field changes, we change the width of the matrix and limit the number of mines to the number of cells in the new matrix

    set_Board_Width(width) {
        if (width < 1) width = 1;
        if (width > 300) {
            width = 300;
            this.setState({
                showAlert: true,
                alertTitle: "Allowed up to 300!",
                alertType: 'warning',
                alertConfirmButtonText: 'Back'
                });
        }
        this.set_Board_Mines(this.state.mines,this.state.height,width);

        
        this.setState({width:width, txtWidth: width, txtMines:this.state.txtMines ,  startNewGame: false});


    }
    //When the height field changes, we change the width of the matrix and limit the number of mines to the number of cells in the new matrix

    set_Board_Height(height) {
        if (height < 1) height = 1;
        if (height > 300) {
            height = 300;
            this.setState({
                showAlert: true,
                alertTitle: "Allowed up to 300!",
                alertType: 'warning',
                alertConfirmButtonText: 'Back'
                });
        }      

        this.set_Board_Mines(this.state.mines,height,this.state.width);

        this.setState({ height:height, txtHeight: height, txtMines: this.state.txtMines, startNewGame: false});

    }
    //Check that the number of mines is greater than 1 and smaller / equal to the size of the matrix and update the number of mines

    set_Board_Mines(mines,height,width) {
        if (mines < 1) {this.mines = 1;}
        if (mines >height*width) {
            mines =height*width;
                this.setState({
                showAlert: true,
                alertTitle: "Allowed up to " +  height*width + " mines",
                alertType: 'warning',
                alertConfirmButtonText: 'Back'
                });}
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
                            <input onInput={(e) => this.set_Board_Mines(e.target.value,this.state.txtHeight,this.state.txtWidth)}
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
                <SweetAlert
                    show={this.state.showAlert}
                    title={this.state.alertTitle}
                    type={this.state.alertType}
                    confirmButtonText={this.state.alertConfirmButtonText}
                    onConfirm={() => this.setState({showAlert: false})}
                />
            </div>
        );
    }
}

export default App;

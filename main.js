// //用户态代码
// // for ( let i of [1,2,3]){
// //     console.log(i);
// // }
// // let a = <div></div>
// import { createElement, Component, render } from './toy-react';
// class MyComponent extends Component {
//     constructor() {
//         super();
//         this.state = {
//             a: 1,
//             b: 2,
//         }
//     }
//     render() {
//         return <div>
//             <h1>依赖真实节点Dom</h1>
//             <h2> {this.children} </h2>
//             <h2>2020/9/8/星期二/23:43</h2>
//             <p>{this.state.a.toString()}</p>
//             <button onClick={()=>{
//                 // this.state.a++;this.rerender()
//                 this.setState({a:this.state.a + 1})
//             }}>
//                 add
//             </button>
//             {this.state.a.toString()}
//             {this.state.b.toString()}
//         </div>
//     }
// }
// //this.state.a++;this.rerender() 手动进行合并  相当于 setState  区别 ：setState会自动进行对象合并 把旧的state和新的state合并起来 不会把旧的干掉


// render(<MyComponent id="a" class="b">
//     {/* style={{textAlign:"center"}} 无法解析 */}
//     <div style={{ textAlign: "center" }}>bobby</div>
//     <div></div>
// </MyComponent>, document.body)
import { createElement, Component, render } from './toy-react';
class Square extends Component {
    render(){
        return (
            //props.onClick  props ---> this.props  class based API 和 this 是强相关的
            <button className="square" onClick={this.props.onClick}>
              {this.props.value}
            </button>
          );
        }
    }
   
  
  class Board extends Component {
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null)
          }
        ],
        stepNumber: 0,
        xIsNext: true
      };
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }
  
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
  
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
  
      let status;
      if (winner) {
        status = "Winner: " + winner;
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
render(<Game />, document.getElementById("root"));
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
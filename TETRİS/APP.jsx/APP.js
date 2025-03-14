
import { useEffect, useState} from "react";
import "./App.css";

const BOARD_COL = 10;
const BOARD_ROW = 20;
const BOARD_GRID = 20;
const FPS = 20;
const tetrominos = {
    'I':[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    'O':[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],
    'T':[[0,0,0,0],[0,1,0,0],[1,1,1,0],[0,0,0,0]],
    'S':[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],
    'Z':[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],
    'J':[[0,0,0,0],[1,0,0,0],[1,1,1,0],[0,0,0,0]],
    'L':[[0,0,0,0],[0,0,1,0],[1,1,1,0],[0,0,0,0]],
};
const colors={
    I:"green",
    O:"#E3B23C",
    T:"orange",
    S:"$6441a5",
    Z:"purple",
    J:"yellow",
    L:"blue",
}
function App() {
    const [isgameOver,setIsGameOver] = useState();
    const [level,setLevel]=useState(1);
    const [point, setPoint]=useState(0);
    let board = [];
    let interval;
    let canvas;
    let context;
    let tetromino;
    let count = 0;
    let sequence=[];
    let gameLevel=1;
    let gamePoint=0;
    useEffect(()=>{
        document.addEventListener("keydown",keydown);
        return () => {
    document.removeEventListener("keydown", keydown);
        };
    }, []);

    useEffect(() =>{
        if (point >= level * 100 ) {
            setLevel((prev)=> prev+1);
        }
    },[point]);



    useEffect(() => {
        initializeGame();
    }, [isGameOver]);

    const keydown=(e)=>{
        if(e.which === 37 || e.which=== 39){
            const col = e.which === 37 ? tetromino.col -1 : tetromino.col +1:
            if( isValid(tetromino.matrix, tetromino.row, col)){
                tetromino.col = col;
            }
        }


        if (e.which === 40){
            const row =tetromino.row +1;
            if (isValid(tetromino.matrix, row, col)){
                tetromino.row = row;
            }
        } 
        if (e.which === 38){
            const newMatrix= rotateTetromino(tetromino.matrix)
            if (isValid(newMatrix, tetromino.row, tetromino.col)){
                tetromino.matrix= newMatrix;
            }
        }
        if (e.which=== 38){
            const newMatrix= rotateTetromino(tetromino.matrix)
            if (isValid(newMatrix, tetromino.row, tetromino.col)){
                tetromino.matrix= newMatrix;
            }
            
        }


    };
    const initializeGame = ()=>{
        for(let i=0; i<BOARD_ROW; i++)
            {
                board[i] = []
                for (let j=0;j<BOARD_COL;j++){
                    board[i][j] = 0;
                }
            }
            generateSequence();
    };

    const startGame = ( ) => {
        canvas = document.getElementById("game");
        context = canvas.getContext("2d");
        generateSequence();
        tetromino = getNextTetromino();
        interval = setInterval(update, 1000/FPS);

       };
    const update = () => {
        contexxt.clearRect(0,0,canvas.width,canvas.height);
           if (++count>FPS/gameLevelvel){  
            tetromino.row++;
            count = 0;
            if (!isValid(tetromino.matrix, tetromino.row, tetromino.col)){
                tetromino.row--;
                placeTetromino()
            }

        }  
        renderTetromino(); 
        renderBoard();
       
    };
     
    const renderBoard = () => { for(let row = 0; row < board.length; row++){
        for(let col = 0; col <  board[0].length; col++){
            if(board[row][col]){
                context.fillRect(
                col * BOARD_GRID, 
                row * BOARD_GRID,
                BOARD_GRID -1,
                BOARD_GRID-1);
            }
        }
    }
};

    const renderTetromino = () =>{
        for(let row = 0; row < tetromino.matrix.length; row++){
            for(let col = 0; col < tetromino.matrix[0].length; col++){
                if(tetromino.matrix[row][col] === 1){
                    context.fillRect(
                    (tetromino.col + col) * BOARD_GRID, 
                    (tetromino.row +row) * BOARD_GRID,
                    BOARD_GRID -1,
                    BOARD_GRID-1
                );
                }
            }
        }
    };

    const randomNumber = (max) => {
        return Math.floor(Math.random() * max) ;
    };
    const generateSequence=() =>{
        let newSequence=['I','O','T','S','Z','J','L'];
        while(newSequence.length > 0){
            let random=randomNumber(newSequence.length,0);
            let val=newSequence.splice(random,1);
            sequence.push(val[0]);
        }
        
    };

    
    const getNextTetromino = () => {
        const name= sequence[0];
        const matrix = tetrominos[sequence[name]];
        const row = 0;
        const col = 4;

        return {
            name,
            row, 
            col, 
            matrix,        }
    }

    const isValid = (matrix, tetroRow, tetroCol) => {
        for (let row =0; row < matrix.length;row++){
            for(let col=0;col < matrix[0].length;col++){
                if(
                    matrix[row][col] === 1 && 
                    (tetroRow + row === board.length ||
                     tetroCol + col === board[0].length ||
                     tetroCol + col < 0 || 
                    board[tetroRow.row + row] [tetroCol.col + col ])

                ){
                    return false
                }
            }
        }
        return true;
    };

    const placeTetromino = () => {

        for (let row=0; row < tetromino.matrix.length; row++) {
            for (let col=0; col < tetromino.matrix[0].length; col++){
                if (tetromino.matrix[row][col]){
                    if(tetromino.row+row<0){
                       gameOver() 
                    }
                board[tetromino.row + row][tetromino.col + col]=tetromino.name;
            }
        }

        if(sequence.length-1 ==0){
            generateSequence();
        }
        

        sequence.splice(0,1);
        tetromino = getNextTetromino();



        for(let i=board.length-1; i>0;i--){
            if(board[i].every((val) => val)){
                setPoint((prev)=>prev+100);
               
                    
                gamePoint+=100;
                if (gamePoint >= gameLevel * 400 ) {
                    gameLevel++;
                }
                
                for(let row =i; row>0; row--){
                    for(let col=0; col < board[0].length; col++){
                        board[row][col]=board[row-1][col];
                    }
                }
                i++;
            }
        }
    };

    const rotateTetromino = (matrix) =>{
        let newMatrix = [];
        let n=matrix.length-1;
        for(let i=0; i<n; i++)
            {
                newMatrix[i] = []
                for (let j=0; j<n; j++){
                    newMatrix[i][j] = 0;
                }
            }
      
        
        for (let i =0; i< matrix.length; i++){
            for (let j =0; j <matrix[0].length; j++) {
                newMatrix[n-1-j][i]=matrix[i][j];

            }
        }

        return newMatrix;
    };

    const gameOver=()=>{
        clearInterval(interval);
        setIsGameOver(true);
    }

    return ( <div style={{display:'flex', flexDirection:'column', 
    maxWidth:"150px", alignItems:'center' ,gap:16}} >
    {isgameOver ? (
        <>
    <div>GAME OVER</div>
    <button onClick={()=>
        setİsGameOver(false)}>PLAY AGAİN</button>
    </>
    ) : (
        <>
        
        <div style={{display='flex',gap:"16px"}}>
        <div>level: {level}</div>
        <div>Point: {point}</div>
        </div>
    <canvas id="game"
     height={400} 
     width={200} 
     style={{border: "1px solid white"} }/>
     <button onClick={startGame}>START GAME</button>
     </>
    
    )}

     </div>
     );
}

export default App;

// everything related to gameboard will be in this
const gameboard=(()=>{
    let board=["","","","","","","","",""];

    const get_board=()=>board;
    const get_idx=(idx)=>board[idx];
    const put_on_board=(idx,val)=>{
        if(board[idx]!==""){
            return false;
        }
        board[idx]=val;
        return true;
        
        
    }

    const reset_board=()=>{
        for(let i=0;i<9;i++){
            board[i]="";
        }
    }
    return {get_board,put_on_board,reset_board,get_idx};

})();


//player details
const player=(name,mark)=>{
    return {name,mark};
}

//function to control flow of game
const play_game=(()=>{
    let player1=player("one","o");
    let player2=player("two","x");

    let curr_player;
    const select_start_player=()=>{
        const prob=Math.random();
        if(prob<=0.5){
            curr_player=player1;
        }
        else{
            curr_player=player2;
        }
    }

    let game_over=false;

    const get_cur_player=()=>curr_player;
    const switch_player=()=>{
        if(curr_player===player1){
            curr_player=player2;
        }    
        else{
            curr_player=player1;
        }
    }

    const play_round=(idx)=>{
        if(game_over){
            return "game over";
        }
        const active_player=get_cur_player();
        const mark=active_player.mark;
        if(gameboard.put_on_board(idx,mark)){
            const winner=check_winner();
            if(winner){
                game_over=true;
                return `${active_player.name} wins!`;
            }
            const tie=check_tie();
            if(tie){
                game_over=true;
                return "The Game is Tied";
            }
            switch_player();
            return `${curr_player.name}'s turn`;
        }
        else{
            return "The spot is alreaady taken";
        }

    }

    const check_winner=()=>{
        const board=gameboard.get_board();
        const winning_combos=[
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];
        for(let combo of winning_combos){
            const [a,b,c]=combo;
            if(board[a]!=="" && board[a]===board[b] && board[a]===board[c])return true;
        }
        return false;
    }

    const check_tie=()=>{
        const board=gameboard.get_board();
        return board.every((spot)=>spot!=="");
    }

    const reset_game=()=>{
        gameboard.reset_board();
        gameboard.get_board();
        select_start_player();
        const player=get_cur_player();
        game_over=false;
        return `${player.name}Turn!`;
    }
    const update_name=(playerone_name,playertwo_name)=>{
        player1.name=playerone_name || "Player1";
        player2.name=playertwo_name || "Player2";
    }
    return {update_name,reset_game,play_round,select_start_player,get_cur_player,check_tie,check_winner,switch_player};


})();

const display=(()=>{
    const play=document.querySelector(".play");
    const start=document.querySelector(".start");
    const dialog=document.querySelector(".dialog-box");
    const cells=document.querySelectorAll(".cell");
    const message=document.querySelector(".messages");
    play.addEventListener('click',()=>dialog.showModal());
    start.addEventListener('click',(event)=>{
        event.preventDefault();
        const p1=document.getElementById("player1");
        const pl1=p1.value;
        const p2=document.getElementById("player2");
        const pl2=p2.value;
        play_game.update_name(pl1,pl2);
        message.innerText=`${play_game.reset_game()}`;
        cells.forEach(cell => cell.innerText = "");
        dialog.close();
    })



    cells.forEach((cell)=>{
        cell.addEventListener('click',(e)=>{
            const clicked=e.target.dataset.index;
            message.innerText=`${play_game.play_round(clicked)}`;
            cell.innerText=`${gameboard.get_idx(clicked)}`;
        });
    })
});

display();
import React,{useState,useEffect} from 'react'
import styled from 'styled-components';
import {socket} from './socket/Socket'
import Player from './parts/Player';
import Enemy from './parts/Enemy';
import { useNavigate } from 'react-router-dom';
var timer : any = null;
var timerenemy : any = null
var btnpress : boolean = false;
var enemybtnpress : boolean = false
var enemyinter : any = null;
const Home : React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem('winner',"Nobody wins!")
    setTimeout(() => {
      navigate('/winner');
      console.log('done')
    },5*60*1000);
    socket.on('connect', () => {
      // var socketId = socket.id
      console.log('Connected Socket',socket.id);
      localStorage.setItem('socketid',socket.id);
      socket.on('server',(args) => {
        console.log("server ====> ",args);
      })
    })
    socket.on('data',(args) => {
      setenemyPos(args.playerPos)
      console.log(args)
      if(!enemybtnpress) { setenemybulletPos(pos => { return {x : pos.x, y : args.playerPos}})}
    })

    socket.on('bulletpos',(args) => {
      enemybtnpress = true
      console.log(args)
      var setSize = 5
      if(timerenemy === null){
        timerenemy = setInterval(() => {
          setenemybulletPos(pos => {
          return {x : pos.x - setSize, y : pos.y}
        });
       },1);
      }
    })
    socket.on('score',(args) => {
      localStorage.setItem('playerscore',args.playerscore); 
      localStorage.setItem('enemyscore',args.enemyscore);
    })
    localStorage.setItem('playerpos','0');
    
  },[])


  type point = {
    x : number, y : number
  }
  const [playPos,setplayPos] = useState<number>(0);
  const [bulletPos,setbulletPos] = useState<point>({
    x : 30, y : 0
  });
  const [enemybulletPos,setenemybulletPos] = useState<point>({
    x : window.innerWidth-40, y : 0
  });
  const [enemyPos,setenemyPos] = useState<number>(0);
  const [playerscore,setplayerscore] = useState<number>(0);
  const [enemyscore,setenemyscore] = useState<number>(0);

  // Player's bullet has crossed the right window so bring back the bullet to the player
  if(bulletPos.x >= window.innerWidth-20){
    if(timer !== null){
      clearInterval(timer);
      btnpress = false;
      timer = null;
    }
    setbulletPos({x : 30 , y : playPos + 5});
  }


  if(enemybulletPos.x <= 20){
    // console.log("timer ==>",timer);
    if(timerenemy !== null){
      clearInterval(timerenemy);
      enemybtnpress = false;
      timerenemy = null;
    }
    setenemybulletPos({x : window.innerWidth - 40 , y : enemyPos + 5});
  }

  // Offline Enemy movement logic : 
  // if(enemyPos >= window.innerHeight-60){
  //   localStorage.setItem('enemyinc','-10');
  //   // console.log(localStorage.getItem('enemyinc'));
  // }
  // if(enemyPos <= 5){
  //   localStorage.setItem('enemyinc','10');
  // }

  // if bullet hits the enemy player gets the point
  if(bulletPos.x >= window.innerWidth - 70 && bulletPos.x <= window.innerWidth - 10 && bulletPos.y >= enemyPos && bulletPos.y <= enemyPos+80){
    localStorage.setItem('score',`${Number(localStorage.getItem('score'))+.5}`);
    clearInterval(timer);
    setbulletPos({x : 30 , y : playPos + 5});
    btnpress = false; timer = null;
    const playsc = Number(localStorage.getItem('playerscore'));
    const enemysc = Number(localStorage.getItem('enemyscore'));
    socket.emit('score',{ playerscore : enemysc, enemyscore : playsc+1, playersocketId : localStorage.getItem('socketid') , enemySocketId : localStorage.getItem('opponentplayerid') })
    // localStorage.setItem('playerscore', String(playsc+1))
    setplayerscore(sc => sc+1);
    var hostName : any = localStorage.getItem('hostname')
    var playerName : any = localStorage.getItem('playerName');
    playerscore > enemyscore ? localStorage.setItem('winner',hostName) : localStorage.setItem('winner',playerName);
  }

  // if enemy bullet hits the player then enemy gets the point
  if(enemybulletPos.x <= 110 && enemybulletPos.y >= playPos && enemybulletPos.y <= playPos + 80){
    clearInterval(timerenemy);
    setenemybulletPos({ x : window.innerWidth - 40 , y : enemyPos + 5 })
    enemybtnpress = false; timerenemy = null;
    const playsc = Number(localStorage.getItem('playerscore'));
    const enemysc = Number(localStorage.getItem('enemyscore'));
    socket.emit('score',{ playerscore : enemysc+1, enemyscore : playsc , playersocketId : localStorage.getItem('socketid') , enemySocketId : localStorage.getItem('opponentplayerid')})
    // localStorage.setItem('enemyscore', String(enemysc+1))
    setenemyscore(sc => sc+1)
    var hostName : any = localStorage.getItem('hostname')
    var playerName : any = localStorage.getItem('playerName');
    playerscore > enemyscore ? localStorage.setItem('winner',hostName) : localStorage.setItem('winner',playerName);
  }

  useEffect(() => {
    localStorage.setItem('enemyinc','10');
    // Offline enemy motion logic : 
    // if(enemyinter === null){
    //   enemyinter = setInterval(() => {
    //     // console.log("run")
    //     setenemyPos(pos =>  pos + Number(localStorage.getItem('enemyinc')));
    //   },100);
    // }

  
    window.addEventListener('keydown',(event) => {
      console.log("reload")
      var setSize = 5;
      if(event.key === 'ArrowDown'){
        setplayPos((pos) => {
          if(localStorage.getItem('socketid')){
          console.log("playerpos => ",pos);
          socket.emit('playerPos',{ playerPos : pos + setSize, playersocketId : localStorage.getItem('socketid') , enemySocketId : localStorage.getItem('opponentplayerid')});
        }
          return pos + setSize;
        }); 
        if(!btnpress) { setbulletPos(pos => { return {x : pos.x, y : pos.y + setSize}})}
      }
      else if(event.key === 'ArrowUp'){
        setplayPos((pos) => { 
          socket.emit('playerPos',{ playerPos : pos - setSize, playersocketId : localStorage.getItem('socketid') , enemySocketId : localStorage.getItem('opponentplayerid')});
          return pos - setSize
        });
        if(!btnpress) setbulletPos(pos => { return {x : pos.x, y : pos.y - setSize}})
      }
      else if(event.key === ' '){
        btnpress = true;
        setbulletPos(pos => {
          socket.emit('bulletpos',{ bulletpos : pos , playersocketId : localStorage.getItem('socketid'), enemySocketId : localStorage.getItem('opponentplayerid') })
          return pos;
        })
        // if the bullet is fired by player move the bullet towards the enemy
        if(timer === null){
          timer = setInterval(() => {
            setbulletPos(pos => {
            return {x : pos.x + setSize, y : pos.y}
          });
         },1);
        }
      }
      else if(event.key === 'a'){
        enemybtnpress = true;
        if(timerenemy === null){
          timerenemy = setInterval(() => {
           setenemybulletPos(pos => {return {x : pos.x - setSize, y : pos.y}});
         },1);
        }
      }
      // console.log(btnpress);
    })
  },[]);
  return (
    <Page>
      <PlayerDiv>
        <Player pos = {playPos} />
        <div id="bullet" style = {{ top : bulletPos.y + 5, left : bulletPos.x }}>
          <img src="https://cdn-icons-png.flaticon.com/128/2218/2218103.png" alt="" className="" id="bullet-img" />
        </div>
      </PlayerDiv>
      <div id = "score">{localStorage.getItem('hostname')} : {playerscore}</div>
      <div id = "score">{localStorage.getItem('playerName')} : {enemyscore}</div>
      <PlayerDiv>
        <Enemy pos = {enemyPos} />
        <div id = "bullet-enemy" style = {{ top : enemybulletPos.y + 5, left : enemybulletPos.x }}>
          <img src="https://cdn-icons-png.flaticon.com/128/2218/2218103.png" alt="" className="" id="bullet-img" />
        </div>
      </PlayerDiv>

    </Page>
  )
}
const PlayerDiv = styled.div`
    width : 10vw;
    height : 100vh;
    display : flex; flex-direction : column;
    .player,#enemy{
      height : 10vh; width : 10vh; position : fixed; z-index : 10; 
      // left : 10px;
    }
    .player{
      left : 10px;
    }
    #enemy{
      right : 25px;
    }
    #player-img,#enemy-img{
      height : 80px; width : 80px; 
    }
    #enemy-img{
      transform: rotate3d(0, 1, 0, 180deg);
    }
    #bullet{
      height : 25px; width : 25px; position : absolute; z-index : 1;
      left : 25px;
    }
    #bullet-enemy{
      height : 25px; width : 25px; position : absolute; z-index : 1; 
      transform: rotate3d(0, 1, 0, 180deg);
    }
    #bullet-img{
      height: 100%; width: 100%;
    }
`;
const Page = styled.div`
  height : 100vh; width : 100vw;
  display : flex; flex-direction : row;
  #score{
    width : 80vw;
  }
`
export default Home
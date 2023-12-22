import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { backendUrl } from '../../urlConfig'
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket/Socket';

function Modal(props : any) {
//   console.log(backendUrl)
  const [roomid,setroomid] = useState("");
  const [password,setPassword] = useState("");
  const [dis,setdis] = useState("input");
  const [hostName,sethostName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('userconnect',(args) => {
      console.log(args);
      sessionStorage.setItem('opponentplayerid',args.id);
      sessionStorage.setItem('hostname',args.hostName);
      sessionStorage.setItem('playerName',args.playerName);
      navigate('/game');
    })
  },[])

  const handleRequest = () => {
    setdis('loading');
    console.log(JSON.stringify({roomName : roomid,password}));
    if(sessionStorage.getItem('type') === 'join'){
        fetch(`${backendUrl}/api/v1/updateroom/`,{
            method : "POST",
            body : JSON.stringify({roomName : roomid ,password , playerName : hostName , playerId : sessionStorage.getItem('socketid') }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
        .then(data => { 
          socket.emit('userconnect',data.data)
          console.log(data);  data.message === "Success" ? navigate('/game') : navigate('/') 
        })
        .catch(err => { navigate('/') });
    }
    else{
        fetch(`${backendUrl}/api/v1/addroom/`,{
            method : "POST",
            body : JSON.stringify({
                roomName : roomid ,
                password, 
                hostId : sessionStorage.getItem('socketid'),
                hostName,
                playerName : '',
                playerId : ''
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        // .then(response => response.json())
        .then(data => { console.log(data); setdis('loading'); })
        .catch(err => { setdis('input') })
    }
  }
  return (
    <Page>
        {dis === "loading" ? 
            <div>
            <div className ="load-wrapp">
            <div className ="load-1">
                <div className ="line"></div>
                <div className ="line"></div>
                <div className ="line"></div>
            </div>
            </div>
            </div>
            :<div className="container">
            <div id = "close" style ={{color:'red',marginLeft:'25vw',marginBottom:'5vh',marginTop:'2vh'}}
            onClick={() => {
                props.close();
            }}>Close</div>
            <div style={{marginRight : '17vw',marginBottom:'10px'}}>Enter Room ID : </div>
            <input onChange={(e) => {
                setroomid(e.target.value);
            }} type='text'></input>
            <div style={{marginRight : '14vw',marginBottom:'10px'}}>Enter Room Password</div>
            <input onChange={(e) => {
                setPassword(e.target.value);
            }} type = 'text'></input>
            <div style={{marginRight : '17vw',marginBottom:'10px'}}>Enter Your Name</div>
            <input onChange={(e) => {
                sethostName(e.target.value);
            }} type = 'text'></input>
            <button style={{marginBottom:'20px',marginTop:'20px'}} onClick = {handleRequest}>Done</button>
        </div>
        }
        
    </Page>
  )
}
const Page = styled.div`    
    height : 100vh;
    width  : 100vw;
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
    img {
        height : 40vh; width : 40vh;
    }
    button {
        height : 60px; width : 80px;
        margin-right : .5pc;
        margin-left : .5pc;
        border-radius : 10px;
        background-color : lightgreen;
        color : white;
        font-weight : bold;
        &:hover{
          transform : scale(1.1);
          cursor : pointer;
        }
    }
    .container{
        display : flex;
        flex-direction : column;
        height : 60vh; 
        width : 30vw;
        border-radius : 15px;
        background-color : lightgrey;
        justify-content : center;
        align-items : center;
    }
    input{
        width : 80%;
        height : 12%;
        margin-bottom : 2vh;
        font-size : 16px;
        border-radius : 5px;
    }
    #close:hover{
        cursor : pointer;
    }
    .load-wrapp {
        float: left;
        width: 100px;
        height: 100px;
        margin: 0 10px 10px 0;
        padding: 20px 20px 20px;
        border-radius: 5px;
        text-align: center;
      }
      
      .load-wrapp p {
        padding: 0 0 20px;
      }
      .load-wrapp:last-child {
        margin-right: 0;
      }
      
      .line {
        display: inline-block;
        width: 15px;
        height: 15px;
        border-radius: 15px;
        background-color: #4b9cdb;
      }
      .load-1 .line:nth-last-child(1) {
        animation: loadingA 1.5s 1s infinite;
      }
      .load-1 .line:nth-last-child(2) {
        animation: loadingA 1.5s 0.5s infinite;
      }
      .load-1 .line:nth-last-child(3) {
        animation: loadingA 1.5s 0s infinite;
      }

      @keyframes loadingA {
        0 {
          height: 15px;
        }
        50% {
          height: 35px;
        }
        100% {
          height: 15px;
        }
      }
`;

export default Modal
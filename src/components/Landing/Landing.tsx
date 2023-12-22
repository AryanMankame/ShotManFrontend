import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Modal from './Modal'
import { socket } from '../socket/Socket'

const Landing = () => {
  useEffect(() => {
    console.log(socket)
    socket.on('connect', () => {
      console.log('Connected Socket',socket.id);
      sessionStorage.setItem('socketid',socket.id)
    })
  },[]);
  const [open,setopen] = useState(false);
  const modalOpen = () => {
    setopen(true);
  }
  const modalClose = () => {
    setopen(false);
  }
  return (
    <Page>
    {  open ?
        <Modal close = {modalClose} /> : 
        <div>
            <img src = "gamelogo.png" alt = "img"></img>
            <div className="buttons">
                <button onClick={() => { modalOpen(); sessionStorage.setItem('type','join')}}>JOIN</button>
                <button onClick={() => { modalOpen(); sessionStorage.setItem('type','create')}}>CREATE</button>
            </div>
        </div> 
    }   
    </Page>
  )
}

const Page = styled.div`
    min-height : 100vh;
    min-width  : 100vw;
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
    img {
        height : 40vh; width : 40vh;
    }
    button {
        height : 50px; width : 80px;
        margin-right : .5pc;
        margin-left : .5pc;
        border-radius : 10px;
        background-color : lightgreen;
        color : white;
        font-weight : bold;
    }
`;
export default Landing
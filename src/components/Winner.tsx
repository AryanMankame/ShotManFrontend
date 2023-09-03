import React from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
function Winner() {
  const navigate = useNavigate();
  return (
    <Page>
        <h1>Winner</h1>
        <div className="win">
            <img src="https://img.icons8.com/?size=1x&id=X6CJMckcVrBj&format=png" alt="" />
            <div id = "name">{localStorage.getItem('winner')}</div>
        </div>
        <button onClick={() => { navigate('/'); }}>Home</button>
    </Page>
  )
}
const Page = styled.div`
    width : 100vw;
    height : 100vh;
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
    font-family : 'Comic Sans MS';
    .win{
        display : flex;
        flex-direction : row;
    }
    h1{
        font-size : 52px; color : rgb(255,215,0);
    }
    #name{
        margin-top : 10px;
        font-size : 20px;
    }
    button{
        margin-top : 10vh;
        background-color : lightgreen; color : white;
        height: 6vh; width: 6vw; border-radius : 10px;
        &:hover{
            transform : scale(1.1);
            cursor : pointer;
        }
    }

`;
export default Winner
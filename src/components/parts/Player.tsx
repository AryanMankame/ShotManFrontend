import React from 'react'
import styled from 'styled-components'
function Player(props : any) {
  const { pos } = props;
  // console.log(pos)
  return (
    <Page>
        <div className="player" style = {{top : pos}}>
            <img id = "player-img" src="https://cdn-icons-png.flaticon.com/128/3211/3211181.png" alt="" />
            {/* <div style={{color:"red"}}>{pos}</div> */}
        </div>
    </Page>
  )
}
const Page = styled.div`
    height : 90vh; width : 10vw;
    .player{
        height : 10vh; width : 10vh; position : fixed; z-index : 10; 
        left : 10px;
    }
    #player-img{
        height : 80px; width : 80px; 
      }
`;
export default Player
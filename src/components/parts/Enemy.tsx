import React from 'react'
import styled from 'styled-components'
function Enemy(props : any) {
  const { pos } = props; 
  return (
    <Page>
        <div id="enemy" style = {{ top : pos}}>
            <img id = "enemy-img" src="https://cdn-icons-png.flaticon.com/128/3211/3211181.png" alt="" />
        </div>
    </Page>
  )
}
const Page = styled.div`
    height : 90vh; width : 10vw;
    #enemy{
        height : 10vh; width : 10vh; position : fixed; z-index : 10; right : 10px;
    }
    #enemy-img{
        height : 80px; width : 80px; transform: rotate3d(0, 1, 0, 180deg);
    }
`;
export default Enemy
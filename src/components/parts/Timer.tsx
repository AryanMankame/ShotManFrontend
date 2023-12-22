import React from 'react'
import { useTimer } from 'react-timer-hook';
function Timer() {
  function MyTimer({ expiryTimestamp }  : any) {
    const {
      totalSeconds,
      seconds,
      minutes,
      hours,
      days,
      isRunning,
      start,
      pause,
      resume,
      restart,
    } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });
  
  
    return (
      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: '60px',color:'red'}}>
          <span>{minutes}</span>:<span>{seconds}</span>
        </div>
      </div>
    );
  }
  const time = new Date();
  time.setSeconds(time.getSeconds() + Number(sessionStorage.getItem('timer'))*60);
  return (
    <div>
       <MyTimer expiryTimestamp={time} />
    </div>
  )
}

export default Timer
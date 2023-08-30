import './App.css';
import Home from './components/Home';
import Landing from './components/Landing/Landing';
import Webrtc from './components/webRTC/Webrtc';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
const router = createBrowserRouter([
  {
    path : "/",
    element: <Landing />
  },
  {
    path : "/game",
    element : <Home />
  }
])
function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

import './App.css';
import Sidebar from './Components/Sidebar/Sidebar';
import Header from './Components/Header/Header';
import MainContainer from './Components/MainContainer/MainContainer';


function App() {
  return (
    <div className="App">
      <Header />
      <div className='wrapper'>
        <Sidebar />
        <MainContainer />
      </div>
    </div>
  );
}

export default App;

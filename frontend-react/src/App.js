import logo from './logo.svg';
import './App.css';
import Routes from './components/router'
import Navbar from './components/navbar'

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <div className="content">
        <Routes />
      </div>
    </div>
  );
}

export default App;

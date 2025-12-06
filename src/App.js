import './App.css';

import Detectors from './components/Detectors';
import Logo from './components/Logo';
import Header from './components/Header';
import NoiseMap from './components/NoiseMap';

function App() {
  return (
    <>
      <div className="App" >
        
        <Logo />
        
        <Header />

        {/* <Detectors /> */}

        <NoiseMap />
        
      </div>
    </>
  );
}

export default App;

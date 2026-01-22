import './App.css';

import Detectors from './components/Detectors';
import Logo from './components/Logo';
import Header from './components/Header';
import NoiseMap from './components/NoiseMap';
import NoiseMapSvg from './components/NoiseMapSvg';
import NoiseMapBackend from './components/NoiseMap-Backend';

function App() {
  return (
    <>
      <div className="App" >
        
        <Logo />
        
        <Header />

        {/* <Detectors /> */}
        {/* <NoiseMapSvg /> */}
        <NoiseMapBackend/>
        {/* <NoiseMap /> */}
        
      </div>
    </>
  );
}

export default App;

import detector from '../../img/detector.png'

export default function Detectors() {
    return (
      
        <div className="App-Detectors">
            {/* Lines */}
            {/* <div className="LineWrapper Line-TL">
            <div className="Line"></div>
            <div className="Label-TL">12m</div>
            </div>

            <div className="LineWrapper Line-TR">
            <div className="Line"></div>
            <div className="Label-TR">7m</div>
            </div>

            <div className="LineWrapper Line-Bottom">
            <div className="Line"></div>
            <div className="Label-Bottom">9m</div>
            </div> */}

            {/* Top corner */}
                <img
                    src={detector}
                    alt="Top"
                    className="App-DetectorTop"
                />

            {/* Bottom-left corner */}
                <img
                    src={detector}
                    alt="Bottom Left"
                    className="App-DetectorBotL"
                />

            {/* Bottom-right corner */}
                <img
                    src={detector}
                    alt="Bottom Right"
                    className="App-DetectorBotR"
                />
    </div>
  );
}
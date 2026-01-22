import { useEffect, useState } from "react";
import { getNoiseData } from "../../services/DecibelsService";
import { computeSourceFromReadings } from "../../utils/trilateration";
import { getLoudnessColor, getPercentageColor } from "../../utils/color";

export default function NoiseMap() {
    const [readings, setReadings] = useState([]);
    const [source, setSource] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const data = await getNoiseData();
            
            setReadings(data);
            const position = computeSourceFromReadings(data);
            setSource(position);
        }
        fetchData();
    }, []);

    return (
    <div style={{ padding: "20px", color: "white"}}>
      <h2>Device Readings</h2>
      <table border="1" cellPadding="6">
        <thead>
            <tr>
            <th>Device ID (newest post)</th>
            <th>Decibels</th>
            <th>Percentage</th>
            </tr>
        </thead>
        <tbody>
            {readings.slice(0,3).map((r) => (
            <tr key={r.dev_id}>
                <td>{r.dev_id}</td>
                <td style={{ backgroundColor: getLoudnessColor(r.decibels), color: "#fff" }}>
                {r.decibels}
                </td>
                <td style={{ backgroundColor: getPercentageColor(r.percentage), color: "#fff" }}>
                {r.percentage}%
                </td>
            </tr>
            ))}
        </tbody>
        </table>


      <h2>Noise Source</h2>
      {source ? (
          <p style={{ color: "white", paddingLeft: "20px" }}>
            Estimated position: x = {source.x.toFixed(2)} m, y = {source.y.toFixed(2)} m
          </p>
      ) : (
        <p>
          Cannot calculate source: one or more devices have validation less than 70
        </p>
      )}
    </div>
  );
}

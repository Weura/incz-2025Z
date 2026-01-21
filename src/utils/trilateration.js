//   IMPORTANT 
// find our reference sound
const length = 10;

// Convert dB readings to approximate distances
export function dbToDistance(db) {
    // reference sound
    // const I0 = 1;
    // const I = Math.pow(10, db / 10);
    // return Math.sqrt(I0 / I) * length;
    return (100 - db) * 0.15;
}

// Trilateration calculation
// ASSUMING
// our detectors are in a triangle
// with 100m sides
export function trilaterate(d1, d2, d3) {
    const D1 = [0, 0];
    const D2 = [length, 0];
    const D3 = [length/2, length/2*Math.sqrt(2)];

    const r1 = dbToDistance(d1);
    const r2 = dbToDistance(d2);
    const r3 = dbToDistance(d3);

    const A = 2*(D2[0]-D1[0]);
    const B = 2*(D2[1]-D1[1]);
    const C = r1*r1 - r2*r2 - D1[0]*D1[0] + D2[0]*D2[0] - D1[1]*D1[1] + D2[1]*D2[1];

    const D = 2*(D3[0]-D1[0]);
    const E = 2*(D3[1]-D1[1]);
    const F = r1*r1 - r3*r3 - D1[0]*D1[0] + D3[0]*D3[0] - D1[1]*D1[1] + D3[1]*D3[1];

    const x = (C*E - F*B) / (E*A - B*D);
    const y = (C*D - A*F) / (B*D - A*E);

    return { x, y };
}

export function computeSourceFromReadings(readings) {
    const d1 = readings.find(r => r.dev_id === 1)?.decibels ?? 0;
    const d2 = readings.find(r => r.dev_id === 2)?.decibels ?? 0;
    const d3 = readings.find(r => r.dev_id === 3)?.decibels ?? 0;
    
    const p1 = readings.find(r => r.dev_id === 1)?.percentage ?? 0;
    const p2 = readings.find(r => r.dev_id === 2)?.percentage ?? 0;
    const p3 = readings.find(r => r.dev_id === 3)?.percentage ?? 0;

    // Convert dB → distance
    if (p1 < 70 && p2 < 70 && p3 < 70) {
        return null;
    // } else if (p1 < 70 && p2 < 70) {
    //     return 
    }

    // Compute source position
    return trilaterate(d1, d2, d3);
}
// loudness going from ffba08 when quiet to 370617 
// yellow - purplish
// and percentages going 
// from df5601 when bad         orange
// to eeb902 when 69            yellow
// and at 70 change to 85b404   light green
// going to 90c819              dark green

// Linear interpolation between two hex colors
export function interpolateColor(color1, color2, factor) {
    let c1 = parseInt(color1.slice(1), 16);
    let c2 = parseInt(color2.slice(1), 16);

    let r1 = (c1 >> 16) & 0xff;
    let g1 = (c1 >> 8) & 0xff;
    let b1 = c1 & 0xff;

    let r2 = (c2 >> 16) & 0xff;
    let g2 = (c2 >> 8) & 0xff;
    let b2 = c2 & 0xff;

    let r = Math.round(r1 + factor * (r2 - r1));
    let g = Math.round(g1 + factor * (g2 - g1));
    let b = Math.round(b1 + factor * (b2 - b1));

    return `rgb(${r},${g},${b})`;
}

// Get loudness color: from ffba08 (quiet) to 370617 (loud)
export function getLoudnessColor(db) {
    // Assuming db range -20 (quiet) → 50 (very loud)
    const minDB = -20;
    const maxDB = 50;
    const factor = Math.min(Math.max((db - minDB) / (maxDB - minDB), 0), 1);
    return interpolateColor("#ffba08", "#370617", factor);
}

// Get percentage color
export function getPercentageColor(p) {
    if (p < 70) {
        // bad → from df5601 (very low) to eeb902 (69)
        const factor = Math.min(p / 69, 1);
        return interpolateColor("#df5601", "#eeb902", factor);
    } else {
        // good → from 85b404 (70) to 90c819 (90)
        const factor = Math.min((p - 70) / (90 - 70), 1);
        return interpolateColor("#85b404", "#90c819", factor);
    }
}

export async function getNoiseData() {
  // http://10.145.211.186:5000
  // const response = await fetch('http://192.168.11.101:5000/new-measurements');
  const response = await fetch('http://10.67.7.128:5000/new-measurements');
  const data = await response.json();
  return data;
}

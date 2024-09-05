import React, { useState } from 'react';
import fishingPorts from "./data.json";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function App() {
  const position = [35.4478, 139.6425];
  const colorSet = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#33FFF5",
    "#F5FF33", "#FF8C33", "#8C33FF", "#FF3333", "#33FF99",
    "#33A8FF", "#FF8333", "#FF3380", "#33FFA8", "#A833FF"
  ];

  const labels = ["2016", "2017", "2018"];
  const vals = [
    "魚類", "まぐろ類", "かじき類", "かつお類", "さけ・ます類",
    "いわし類", "あじ類", "ひらめ・かれい類", "たら類", "たい類",
    "えび類", "かに類", "貝類", "いか類", "海藻類"
  ];

  const [selectedVals, setSelectedVals] = useState(vals);
  const [selectedPort, setSelectedPort] = useState(fishingPorts[0]);

  const graphData = {
    labels: labels,
    datasets: selectedVals.map((val, valIndex) => ({
      label: val,
      data: labels.map((year) => selectedPort.data[year][vals.indexOf(val)]),
      borderColor: colorSet[vals.indexOf(val)]
    }))
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setSelectedVals(prev =>
      e.target.checked ? [...prev, value] : prev.filter(v => v !== value)
    );
  };

  return (
    <div>
      <div className="left-container">
        <MapContainer center={position} zoom={10} scrollWheelZoom={false} id="map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {fishingPorts.map(fishingPort => (
            <Marker
              position={[fishingPort.lat, fishingPort.lng]} key={fishingPort.name}
              eventHandlers={{
                click: () => {
                  setSelectedPort(fishingPort);
                },
              }}
            >
              <Popup>
                <a>{fishingPort.name}</a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <div id="controls">
          {vals.map((val, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={`fish-${index}`}
                name="fish"
                value={val}
                checked={selectedVals.includes(val)}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={`fish-${index}`}>{val}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="right-container">
        <Line height={500} width={500} data={graphData} /> 
      </div>
    </div>
  );
}

export default App;
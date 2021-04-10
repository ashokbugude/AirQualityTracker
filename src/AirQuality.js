import React, { useState, useEffect } from 'react';
import Chart from './Chart'

const AirQuality = () => {
  const [airQuality, setAirQuality] = useState([]);
  const [rows,setRows] = useState(new Map([]));
  const [cities,setCities] = useState([])

  useEffect(() => {
    const ws = new WebSocket('ws://city-ws.herokuapp.com');

    ws.onopen = () => {
      ws.send({});
    };
    
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log(response)
      for(let i=0;i<response.length;i++) {
        let tempRows = rows
        if(!cities.includes(response[i].city)) {
            let tmepCities = cities
            tmepCities = tmepCities.concat(response[i].city)
            setCities(tmepCities)
        }
        if(tempRows.get(response[i].city)) {
            let d = new Date().getTime()
            let timeDiff = (d - tempRows.get(response[i].city).updated)
            let tempAirQualityData = null
            if(tempRows.get(response[i].city).airQualityData != null) {
                tempAirQualityData = tempRows.get(response[i].city).airQualityData
                tempAirQualityData = tempAirQualityData.concat(Math.round(response[i].aqi *100)/100)
            } else {
                tempAirQualityData = [Math.round(response[i].aqi *100)/100]
            }
            tempRows.set(response[i].city, {name: response[i].city,aqi : Math.round(response[i].aqi *100)/100, updated : new Date().getTime(), lastUpdated: timeDiff, airQualityData : tempAirQualityData})
        } else {
            tempRows.set(response[i].city, {name: response[i].city,aqi : Math.round(response[i].aqi *100)/100, updated : new Date().getTime(), lastUpdated: 'now', airQualityData: [Math.round(response[i].aqi *100)/100]})
        }
        setRows(tempRows)
      }

      let tempAirQuality = []
      setAirQuality([])
      rows.forEach((item) => {
        let upSecs = Math.round(item.lastUpdated/1000)
        let upString = ''
        if(upSecs == 0) {
            upString = 'now'
        } else {
            upString =  Math.round(item.lastUpdated/1000) + ' seconds ago'
        }
        tempAirQuality = tempAirQuality.concat({
            name : item.name,
            aqi : item.aqi,
            lastUpdated : upString,
            airQualityData : item.airQualityData
        })
      })
      
      setAirQuality(tempAirQuality)
      //setAirQuality(response);
    };
    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, );
  
function getBackgroundColor(num) {
    if(num < 50) {
        return 'green'
    } else if(num <100) {
        return 'lightGreen'
    } else if(num <200) {
        return 'yellow'
    } else if (num <300) {
        return 'orange'
    } else if(num <400) {
        return 'Crimson'
    } else {
        return 'red'
    }

}

  return (
    <div className="air-quality-container">
      <table>
        <tbody>
        <tr>
            <td><b>City</b></td>
            <td><b>Current AQI</b></td>
            <td><b>Last updated</b></td>
        </tr>
        {       
            airQuality.map((item) => (
                <tr style = {{'backgroundColor' : getBackgroundColor(item.aqi)}}>
                    <td>{item.name}</td>
                    <td>{item.aqi}</td>
                    <td>{item.lastUpdated}</td>
                </tr>
            ))
        }
        </tbody>
      </table>
      <Chart
        rows = {rows}
        cities = {cities}
      />
    </div>
  );
};

export default AirQuality;

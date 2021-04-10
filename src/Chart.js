import LineChart from 'react-linechart';
import '../node_modules/react-linechart/dist/styles.css';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';

const Chart =  ({
    rows,
    cities,
}) => {

    const useStyles = makeStyles((theme) => ({
        formControl: {
          margin: theme.spacing(1),
          minWidth: 120,
        },
        selectEmpty: {
          marginTop: theme.spacing(2),
        },
      }));

    const classes = useStyles();
    const [city,setCity] = useState(null)
    let airQualityData = rows.get(city) && rows.get(city).airQualityData
    
    let data = []
    if(airQualityData!=null) {
        for(var i =0; i<airQualityData.length;i++) {
            data = data.concat({
                x : i,
                y : airQualityData[i]
            })
        } 
    }  

    const handleChange = (event) => {
        setCity(event.target.value);
      };
 
    const data1 = [
        {									
            color: "steelblue", 
            points: data
        }
    ];

    let screenWidth = window.screen.width
    screenWidth = screenWidth - 500

    return (
        <div>
            <div className="App">
                <h1>Air quality line chart</h1>
                <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Select city</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={city}
          onChange={handleChange}
          label="Select city"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {
              cities.map((item => (
                <MenuItem value={item}>{item}</MenuItem>
              )
                ))
          }
        </Select>

      </FormControl>
                <LineChart 
                    width={screenWidth}
                    height={400}
                    data={data1}
                    xLabel= {"X : Time in secs"}
                    yLabel= {"Y : AQI "}
                />
            </div>				
        </div>
    );

    
}

export default Chart;
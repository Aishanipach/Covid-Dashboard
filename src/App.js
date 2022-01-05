// import logo from './logo.svg';
import "./App.css";
import React, { useState, useEffect } from "react";
import { Card, MenuItem, FormControl, Select, CardContent } from "@mui/material";
import Infobox from "./Info/Infobox";
import Mapbox from "./Map/Mapbox";
import Table from "./Table/Table";
import { sortData } from "./util";
import LineGraph from "./Graph/LineGraph";
function App() {
  const [countries, setCountries] = useState([]);
  const [defaultCountry, setDefaultCountry] = useState("Worldwide");
const [countryInfo, setCountryInfo]=useState({});
const [tableData, setTableData]=useState([]);

useEffect(()=>{
  fetch("https://disease.sh/v3/covid-19/all")
  .then(response=> response.json())
  .then(data=>{
    setCountryInfo(data);
  });
},[])
  useEffect(() => {
    const getCountryData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data)
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountryData();
  }, []);

  const onCountryChange = async(event) => {
    const countryCode = event.target.value;
   
    const url= countryCode === 'worldwide' ? `https://disease.sh/v3/covid-19/all`:
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data =>{
      setDefaultCountry(countryCode);
      setCountryInfo(data);
     
    });
  };

console.log(countryInfo)

  return (
    <div className="App">
      <div className="containerLeft">
        <div className="Header">
        <h1>Covid-19 Tracker</h1>
        <FormControl className="appDropdown">
          {" "}
          {/*camelCase and PascalCase*/}
          <Select
            varient="outlined"
            onChange={onCountryChange}
            value={defaultCountry}
          >
            <MenuItem value="Worldwide">Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="appStats">
        <Infobox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />

        <Infobox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />

        <Infobox title="Deaths"  cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
      </div>
      <Mapbox />
      </div>

      <Card className="containerRight">
<CardContent>
  <h3>Live Cases by Country</h3>
  <Table countries={tableData}/>
  <h3>Worldwide new cases</h3>
</CardContent>
      </Card>
      
    </div>
  );
}

export default App;

// 2:40 LineGraph

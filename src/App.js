// import logo from './logo.svg';
import "./App.css";
import React, { useState, useEffect } from "react";
import {
  Card,
  MenuItem,
  FormControl,
  Select,
  CardContent,
} from "@mui/material";
import Infobox from "./Info/Infobox";
import Mapbox from "./Map/Mapbox";
import Table from "./Table/Table";
import { sortData, prettyPrintStat } from "./util";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("deaths");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  useEffect(() => {
    const getCountryData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);

          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };
    getCountryData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? `https://disease.sh/v3/covid-19/all`
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapZoom(4);
        setMapCenter({ lat: data.countryInfo.lat, lng: data.countryInfo.long });
      });
  };

 
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
              value={country}
            >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="appStats">
          <Infobox
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            onClick={(event) => setCasesType("cases")}
            cases={prettyPrintStat(countryInfo.active)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />

          <Infobox
            title="Recovered"
            active={casesType === "recovered"}
            onClick={(event) => setCasesType("recovered")}
            cases={prettyPrintStat(countryInfo.recovered)}
            total={numeral(countryInfo.tests).format("0.0a")}
          />

          <Infobox
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            cases={prettyPrintStat(countryInfo.critical)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>

        <Mapbox
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="containerRight">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
             
        
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

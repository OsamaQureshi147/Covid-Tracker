import {
  MenuItem,
  Select,
  FormControl,
  Card,
  CardContent
} from '@material-ui/core';
import './App.css';
import React, { useState, useEffect } from 'react'
import Infobox from './Infobox';
import Table from './Table';
import { sortData } from './util';
import LineGraph from './LineGraph';


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(res => res.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, [])

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(res => res.json())
        .then(data => {
          const countries = data.map(country => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ))
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountries();
  }, [])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const url = countryCode === 'worldwide' ?
      'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
      })
  }

  return (
    <div className="app">


      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant='outlined'
              value={country}
              onChange={e => onCountryChange(e)}
            >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {countries.map((country, index) => (
                <MenuItem
                  key={index}
                  value={country.value}
                >
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <Infobox title='Coronavirus Cases' cases={countryInfo.todayCases} total={countryInfo.cases} />
          <Infobox title='Recovered' cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <Infobox title='Deaths' cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>

        <Card className="app__graphs">
          <CardContent>
            <h3>Worldwide new cases</h3>
            <LineGraph className='app__lineGraph' />
          </CardContent>
        </Card>


      </div>



      <Card className="app__right">

        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
        </CardContent>


      </Card>


    </div>
  );
}

export default App;

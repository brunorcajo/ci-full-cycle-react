import React from 'react'
import { Header } from '../components/Header'
import { Chart } from '../components/Chart'

import "./index.css";

function App() {

  const [coinSelected, setCoinSelected] = React.useState('BTC');

  return (
    <div className="App">
      <Header onSelected={(coin) => setCoinSelected(coin)} />
      <Chart coin={coinSelected} />
    </div>
  )
}

export default App;

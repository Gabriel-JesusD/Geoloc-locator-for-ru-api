import logo from './logo.svg';
import './App.css';
import React, {useEffect, useRef, useState} from 'react'
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Select from 'react-select'


function App() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const coord = useRef([
    { value:'lagoa_do_sino', label: 'Lagoa do Sino' , xy: [-23.599527, -48.529693]},
    { value:'araras', label: 'Araras', xy: [-22.313563, -47.382834]},
    { value:'sorocaba', label: 'Sorocaba', xy: [-23.580750, -47.522547]},
    { value:'sao_carlos', label: 'São Carlos', xy: [-21.983855, -47.881744]},
  ]);
  const bestCampus = useRef(null);
  const [bestCampusIdx, setBestCampusIdx] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const load = useRef(false);
  const changeable = useRef(false);
  

  function getBestCampus(){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        bestCampus.current = { dist: Infinity, name: 'null' };
        navigator.geolocation.getCurrentPosition(function (position) {
          setLat(position.coords.latitude)
          setLng(position.coords.longitude)
        });
        console.log('DIST =  ', lat, lng);
        coord.current.forEach((campus) => {
          const dst = Math.sqrt((campus.xy[0] - lat) ** 2 + (campus.xy[1] - lng) ** 2)
          if (dst < bestCampus.current.dist) {
            bestCampus.current = { dist: dst, name: campus.value };
          }
        });
        console.log('Best campus = ', bestCampus.current);
        
        resolve(coord.current.findIndex((pos) => {
          return pos.value === bestCampus.current.name 
        }));        
      }, 2000);
    });
  }
  
  const selectedMenu = () =>{
    window.location.href = 'https://petbcc.ufscar.br/ru_api/menu/'+selectedCampus.value;
  };

  const getSelected = (ref) =>{
    setSelectedCampus(ref);
    changeable.current = true;
  }


  useEffect(() =>{
    getBestCampus().then((res) => {
      setBestCampusIdx(res);
      if(changeable.current == false)
      setSelectedCampus(coord.current[res]);
      // bestCampusIdx.current =  res;
    });
    load.current = lat != null && lng != null
    console.log('Best campus Index = ' + bestCampusIdx + ' ' + load.current);
  });
  return (
    <div className="App">
      <header className="App-header">
        {load.current === false? <p> Waiting for loading to show best option... </p> : (
          <div className='container'>
          <div className='mt-5 m-auto w-50'>
            <p>Escolha o campus desejado:</p><p>(opção mais próxima definida)</p>
            <Select className='react-select' value={coord.current.value} options={coord.current} defaultValue={coord.current[bestCampusIdx]} onChange={getSelected} />
            <button className='send-button' onClick={selectedMenu}> Testando </button>
          </div>
          </div>
        )
      }
      </header>
    </div>
  );
}

export default App;

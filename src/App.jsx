import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [city, setCity] = useState(null)
  const [search, setSearch] = useState("Meerut");

  useEffect(() =>{
    const fetchApi = async () =>{
      const url = `http://api.weatherapi.com/v1/current.json?key=65036d46f3ba4ddaa7a80846241201&q=${search}`
      const response = await fetch(url);
      const jsondata = await response.json();
      setCity(jsondata.current);
    }
    
    fetchApi();

  }, [search])



  return (
    <>
      <div className='bg-gray-700 h-screen container  flex justify-center items-center'>
        <div className='w-72 h-80 bg-gray-500 rounded-2xl border border-gray-600-2 items-center'>
          <input 
            className='h-10 w-60 m-3 p-3 rounded-2xl'
            type="search" 
            placeholder='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button>submit</button>
          {!city ? (<p>not found</p>):
            (
              <div className='w-52 h-52 bg-sky-300 m-auto rounded-lg'>
                <h1 className='text-black font-bold m-4 text-3xl'>{search}</h1>
                <p className='text-black font-small text-3xl'>Temp-{city.temp_c}</p>
                <p className='text-black font-small text-3xl'>Humidity-{city.humidity}</p>
                {/* <p className='text-black font-small text-3xl'>time-{city.last_updated}</p> */}

              </div>
            )
          }
        </div>
        
      </div>
    </>
  )
}

export default App

import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [city, setCity] = useState()
  const [search, setSearch] = useState("Meerut");
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchApi = async () => {
      const url = `https://api.weatherapi.com/v1/current.json?key=65036d46f3ba4ddaa7a80846241201&q=${search}`
      const response = await fetch(url);
      const jsondata = await response.json();
      setCity(jsondata);

    }

    fetchApi();

  }, [])

  const handleSubmit = async () => {
    const url = `https://api.weatherapi.com/v1/current.json?key=65036d46f3ba4ddaa7a80846241201&q=${search}`
    const response = await fetch(url);
    if (!response.ok) {
      setError("place not found");
    }
    if (response.ok) {
      const jsondata = await response.json();
      setCity(jsondata);
      setError("")
      console.log(jsondata);
    }

  }



  return (
    <>
      <div className='h-screen container  flex justify-center items-center bg-cover bg-center' style={{ backgroundImage: "url('https://png.pngtree.com/thumb_back/fh260/back_pic/04/39/71/36584e58be12c25.jpg')" }} >

        <div className='max-w-72 h-auto bg-gray-500 rounded-2xl border border-gray-600-2 items-center'>
          <div className='block'>
            <input
              className='h-10 max-w-36 m-3 p-3 rounded-2xl'
              type="search"
              placeholder='search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className='bg-blue-800 text-white rounded-xl w-16 h-10 mr-2' onClick={handleSubmit}>submit</button>
          </div>
          {
            !error.length == 0 && (
              <div className="text-red-800 font-semibold text-2xl mt-5">{error}</div>
            )
          }
          {!city ? (<p>not found</p>) :
            (
              <div className='max-w-52 h-auto bg-sky-300 m-auto rounded-lg mb-4'>
                <h1 className='text-black font-bold m-4 text-3xl'>{city.location && city.location.name}</h1>
                <div className='flex justify-center'><img src={city.current && city.current.condition.icon} alt="Weather Icon" className="w-12 h-12 fles" /></div>
                <p className='text-black font-small '>Temperature - {city.current && city.current.temp_c} &deg;C</p>
                <p className='text-black font-small '>Wind speed - {city.current && city.current.wind_kph} kph</p>
                <p className='text-black font-small '>Air pressur - {city.current && city.current.pressure_mb} hPa</p>
                <p className='text-black font-small '>UV - {city.current && city.current.uv}</p>
                <p className='text-black font-small  pb-4'>Humidity - {city.current && city.current.humidity} %</p>
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

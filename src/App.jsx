import { useState, useEffect } from 'react'
import { FaSearch } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { PiSunHorizonFill } from "react-icons/pi";
import { FaMoon } from "react-icons/fa";


function App() {
  const [current, setCurrent] = useState()
  const [location, setLocation] = useState()
  const [hour, setHour] = useState([]);
  const [day1, setDay1] = useState();
  const [day2, setDay2] = useState();
  const [day3, setDay3] = useState();
  const [forecast, setForecast] = useState();
  const [search, setSearch] = useState("");
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchApi = async () => {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=65036d46f3ba4ddaa7a80846241201&q=meerut&days=3&aqi=yes&alerts=no`
      const response = await fetch(url);
      const jsondata = await response.json();
      // console.log(jsondata);
      setCurrent(jsondata.current);
      setLocation(jsondata.location);
      setForecast(jsondata.forecast && jsondata.forecast.forecastday[0]);
      setHour(jsondata.forecast && jsondata.forecast.forecastday[0] && jsondata.forecast.forecastday[0].hour)
      setDay1(jsondata.forecast && jsondata.forecast.forecastday[0]);
      setDay2(jsondata.forecast && jsondata.forecast.forecastday[1]);
      setDay3(jsondata.forecast && jsondata.forecast.forecastday[2]);

    }

    fetchApi();

  }, [])

  const getDayFromEpoch = (epoch) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(epoch * 1000); // Convert epoch to milliseconds
    return days[date.getDay()]; // Get the day name
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', weekday: 'short' };
    return date.toLocaleDateString('en-US', options);
  };

  const lastUpdated = current && current.last_updated;
  const formattedDate = formatDate(lastUpdated);

  const handleSubmit = async () => {

    const url = `https://api.weatherapi.com/v1/forecast.json?key=65036d46f3ba4ddaa7a80846241201&q=${search}&days=7&aqi=yes&alerts=no`
    const response = await fetch(url);
    if (!response.ok) {
      setError("place not found");

    }
    if (response.ok) {
      const jsondata = await response.json();
      setCurrent(jsondata.current);
      setLocation(jsondata.location);
      setForecast(jsondata.forecast && jsondata.forecast.forecastday[0]);
      setHour(jsondata.forecast && jsondata.forecast.forecastday[0] && jsondata.forecast.forecastday[0].hour)
      setSearch("")
      // console.log(jsondata)

      setError("")
    }
  }

  const getLocation = async (lat, lng) => {
    // console.log('request sent to server')
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    const response = await fetch(url);
    // console.log(response);
    // console.log("saprate........................");
    const data = await response.json();
    // console.log(data.address.city);
    setSearch(data && data.address && data.address.city);
    // handleSubmit();
  };


  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        getLocation(latitude, longitude);
      })
    }
  }



  return (
    <>
      <div className='w-screen h-screen flex justify-center'>
        <div className='bg-sky-300 h-screen max-w-[430px] overflow-y-auto'>
          <div className='max-w-[360px]'>
            {loading ? (
              <div className='text-center text-white mt-10 max-w-[360px]'>Loading...</div>
            ) : (
              <>
                <div className='flex justify-between m-3 mt-3'>
                  <div className='w-10/12'><input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='search by city' className='p-1 rounded-lg w-full' /></div>
                  <div className='text-center w-2/12 flex justify-between ml-1'><FaSearch onClick={handleSubmit} size={25} className='mt-1 mr-2 cursor-pointer' />
                    <FaLocationCrosshairs size={25} className='mt-1 mr-2 cursor-pointer' onClick={handleLocation}/>
                  </div>
                </div>
                {
                  !error.length == 0 && (
                    <div className="text-red-800 font-semibold text-2xl mt-5"><p className='text-center'>{error}</p></div>
                  )
                }
                <div className='mt-16'>
                  <h2 className='text-center font-semibold text-3xl text-white'>{location && location.name}</h2>
                </div>
                <div className='flex justify-around mt-3'>
                  <div className=''>
                    <p className='font-bold text-5xl text-gray-800'>{current && current.temp_c}&deg;c</p>
                    <p className='text-black'>{formattedDate}</p>
                  </div>
                  <div className=''>
                    <img src={current && current.condition && current.condition.icon} alt="Weather Icon" className="w-20" />
                    <p className='text-xl font-semibold mb-2 text-white'>{current && current.condition && current.condition.text}</p>
                  </div>
                </div>
                <div>
                  <p className='mt-2 p-2 font-semibold ml-3 bg-sky-400 text-gray-100 rounded-xl mr-3'>min temp- {forecast && forecast.day && forecast.day.mintemp_c}&deg;c / max temp- {forecast && forecast.day && forecast.day.maxtemp_c}&deg;c</p>
                </div>
                <div className='w-full'>
                  <div className='bg-sky-400 h-auto w-11/12 mx-auto m-2 rounded-2xl'>
                    <div className='ml-2 mt-3 pt-3 pb-3'>
                      <p className='text-white text-xl'>{current && current.condition && current.condition.text}, low {forecast && forecast.day && forecast.day.mintemp_c}&deg;c</p>
                    </div>
                    <hr />
                    <div className='p-4 overflow-y-auto'>
                      <ul className='flex space-x-4'> {/* Use flex for horizontal layout */}
                        {hour.length > 0 && hour.map((hour, index) => {
                          const date = new Date(hour.time_epoch * 1000); // Convert epoch to milliseconds
                          const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

                          return (
                            <li key={index} className='w-16 h-auto flex flex-col items-center'> {/* Changed to <li> */}
                              <p className='block p-2 text-white'>{formattedTime}</p>
                              <p className='block p-2'><img src={hour.condition?.icon} alt={hour.condition?.text} className="w-20 " /></p>
                              <p className='block p-2 text-gray-100'>{hour.temp_c}&deg;c</p>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='w-full mt-2'>
                  <div className='bg-sky-400 h-auto w-11/12 mx-auto my-2 rounded-2xl'>
                    <div className='p-4'>
                      <div className='flex flex-row justify-between items-center'>
                        <h3 className='font-bold text-xl text-gray-300'>Today</h3>
                        <p className='text-lg ml-2 text-gray-100'>{day1 && day1.day && day1.day.maxtemp_c}/{day1 && day1.day && day1.day.mintemp_c}°C</p>
                        <div className='flex space-x-1 ml-1'>
                          <img src={day1 && day1.day && day1.day.condition && day1.day.condition.icon} alt="weather icon" className='w-12 h-12' />
                        </div>
                      </div>
                      <div className='flex flex-row justify-between items-center'>
                        <h3 className='font-bold text-xl text-white'>{getDayFromEpoch(day2 && day2.date_epoch)}</h3>
                        <p className='text-lg ml-2 text-gray-100'>{day2 && day2.day && day2.day.maxtemp_c}/{day2 && day2.day && day2.day.mintemp_c}°C</p>
                        <div className='flex space-x-1 ml-1'>
                          <img src={day2 && day2.day && day2.day.condition && day2.day.condition.icon} alt="weather icon" className='w-12 h-12' />
                        </div>
                      </div>
                      <div className='flex flex-row justify-between items-center'>
                        <h3 className='font-bold text-xl text-white'>{getDayFromEpoch(day3 && day3.date_epoch)}</h3>
                        <p className='text-lg ml-2 text-gray-100'>{day3 && day3.day && day3.day.maxtemp_c}/{day3 && day3.day && day3.day.mintemp_c}°C</p>
                        <div className='flex space-x-1 ml-1'>
                          <img src={day3 && day3.day && day3.day.condition && day3.day.condition.icon} alt="weather icon" className='w-12 h-12' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='w-full mt-2'>
                  <div className='bg-sky-400 h-auto w-11/12 mx-auto my-2 rounded-2xl'>
                    <div className='p-4 flex flex-col'>
                      <p className='text-center text-2xl font-semibold text-gray-200'>AQI Level</p>
                      <p className='text-center text-2xl font-semibold text-white'>{current && current.air_quality && current.air_quality.o3}</p>
                    </div>
                  </div>
                </div>

                <div className='w-full mt-2'>
                  <div className='h-auto w-11/12 mx-auto my-2 rounded-2xl space-y-2'>
                    <div className='flex flex-row space-x-3 justify-around rounded-2xl'>
                      <div className='bg-sky-400 h-28 w-32 p-2 rounded-2xl'>
                        <p className='text-center text-gray-200'>Apparent Temperature</p>
                        <p className='text-center text-white mt-3 text-2xl'>{current && current.temp_c}&deg;c</p>
                      </div>
                      <div className='bg-sky-400 h-28 w-32 p-2 rounded-2xl'>
                        <p className='text-center text-gray-200'>Humidity</p>
                        <p className='text-center text-white mt-3 text-2xl'>{current && current.humidity}%</p>
                      </div>
                    </div>
                    <div className='flex flex-row space-x-3 justify-around rounded-2xl'>
                      <div className='bg-sky-400 h-28 w-32 p-2 rounded-2xl'>
                        <p className='text-center text-gray-200'>Wind speed</p>
                        <p className='text-center text-white mt-3 text-2xl'>{current && current.wind_kph} K/ph</p>
                      </div>
                      <div className='bg-sky-400 h-28 w-32 p-2 rounded-2xl'>
                        <p className='text-center text-gray-200'>UV</p>
                        <p className='text-center text-white mt-3 text-2xl'>{current && current.uv}</p>
                      </div>
                    </div>
                    <div className='flex flex-row space-x-3 justify-around rounded-2xl'>
                      <div className='bg-sky-400 h-28 w-32 p-2 rounded-2xl'>
                        <p className='text-center text-gray-200'>visibility</p>
                        <p className='text-center text-white mt-3 text-2xl'>{current && current.vis_km} Km</p>
                      </div>
                      <div className='bg-sky-400 h-28 w-32 p-2 rounded-2xl'>
                        <p className='text-center text-gray-200'>Air pressure</p>
                        <p className='text-center text-white mt-3 text-2xl'>{current && current.pressure_mb} hpa</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='w-full mt-2'>
                  <div className='bg-sky-400 h-auto w-11/12 mx-auto my-2 rounded-2xl'>
                    <div className='flex flex-row space-x-3 justify-around'>
                      <div className='flex flex-row space-x-2 mb-2 items-center'>
                        <p className='text-white text-xl m-2'>{forecast && forecast.astro && forecast.astro.sunrise}</p>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwU313zmtxd0V5QBkb8XiaQoK9gtRAQ-AIeA&s" alt="" height={130} width={130} className='mt-2'/>
                        {/* <PiSunHorizonFill size={100} color='red' className='mt-2'/> */}
                        <p className='text-white text-xl m-2'>{forecast && forecast.astro && forecast.astro.sunset}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='w-full mt-2'>
                  <div className='bg-sky-400 h-auto w-11/12 mx-auto my-2 rounded-2xl'>
                    <div className='flex flex-row space-x-3 justify-around'>
                      <div className='flex flex-row space-x-2 mb-2 items-center'>
                        <p className='text-white text-xl m-2'>{forecast && forecast.astro && forecast.astro.moonrise}</p>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNWjLdkZEH2qnf0sfoDtKBR9z3Yv-kY6Xg1Q&s" alt="" height={130} width={130} className='mt-2'/>
                        {/* <FaMoon size={100} color='red' className='mt-2'/> */}
                        <p className='text-white text-xl m-2'>{forecast && forecast.astro && forecast.astro.moonset}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>

        </div>
      </div>
    </>
  )
}

export default App
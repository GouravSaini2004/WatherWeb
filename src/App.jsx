import { useState, useEffect } from 'react'
import { FaSearch } from "react-icons/fa";
import { BsSunriseFill } from "react-icons/bs";
import { BsSunset } from "react-icons/bs";
import { IoMoonSharp } from "react-icons/io5";
import { WiMoonAltNew } from "react-icons/wi";


function App() {
  const [current, setCurrent] = useState()
  const [location, setLocation] = useState()
  const [hour, setHour] = useState([]);
  const [day1, setDay1] = useState();
  const [day2, setDay2] = useState();
  const [day3, setDay3] = useState();
  const [forecast, setForecast] = useState();
  const [search, setSearch] = useState("Meerut");
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchApi = async () => {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=65036d46f3ba4ddaa7a80846241201&q=${search}&days=3&aqi=yes&alerts=no`
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
      
      // console.log(jsondata)
      
      setError("")
    }
  }



  return (
    <>
      <div className='w-screen h-screen flex justify-center'>
        <div className='bg-sky-500 h-screen max-w-[430px] overflow-y-auto'>
          <div className='max-w-[360px]'>
            {loading ? (
              <div className='text-center text-white mt-10 max-w-[360px]'>Loading...</div>
            ) : (
              <>
                <div className='flex justify-between m-3 mt-3'>
                  <div className='w-10/12'><input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='search by city' className='p-1 rounded-lg w-full' /></div>
                  <div className='text-center w-2/12 flex justify-end'><FaSearch onClick={handleSubmit} size={25} className='mt-1 mr-2 cursor-pointer' />
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
                    <p className='font-bold text-5xl'>{current && current.temp_c}&deg;c</p>
                    <p>{formattedDate}</p>
                  </div>
                  <div className=''>
                    <img src={current && current.condition && current.condition.icon} alt="Weather Icon" className="w-20" />
                    <p className='text-xl font-semibold mb-2 text-white'>{current && current.condition && current.condition.text}</p>
                  </div>
                </div>
                <div>
                  <p className='mt-2 p-2 font-semibold ml-3 bg-sky-600 rounded-xl mr-3'>min temp- {forecast && forecast.day && forecast.day.mintemp_c}&deg;c / max temp- {forecast && forecast.day && forecast.day.maxtemp_c}&deg;c</p>
                </div>
                <div className='w-full'>
                  <div className='bg-sky-600 h-auto w-11/12 mx-auto m-2 rounded-2xl'>
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
                              <p className='block p-2 text-gray-300'>{hour.temp_c}&deg;c</p>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='w-full mt-2'>
                  <div className='bg-sky-600 h-auto w-11/12 mx-auto my-2 rounded-2xl'>
                    <div className='p-4'>
                      <div className='flex flex-row justify-between items-center'>
                        <h3 className='font-bold text-xl text-gray-300'>Today</h3>
                        <p className='text-lg ml-2'>{day1 && day1.day && day1.day.maxtemp_c}/{day1 && day1.day && day1.day.mintemp_c}°C</p>
                        <div className='flex space-x-1 ml-1'>
                          <img src={day1 && day1.day && day1.day.condition && day1.day.condition.icon} alt="weather icon" className='w-12 h-12' />
                        </div>
                      </div>
                      <div className='flex flex-row justify-between items-center'>
                        <h3 className='font-bold text-xl text-white'>{getDayFromEpoch(day2 && day2.date_epoch)}</h3>
                        <p className='text-lg ml-2'>{day2 && day2.day && day2.day.maxtemp_c}/{day2 && day2.day && day2.day.mintemp_c}°C</p>
                        <div className='flex space-x-1 ml-1'>
                          <img src={day2 && day2.day && day2.day.condition && day2.day.condition.icon} alt="weather icon" className='w-12 h-12' />
                        </div>
                      </div>
                      <div className='flex flex-row justify-between items-center'>
                        <h3 className='font-bold text-xl text-white'>{getDayFromEpoch(day3 && day3.date_epoch)}</h3>
                        <p className='text-lg ml-2'>{day3 && day3.day && day3.day.maxtemp_c}/{day3 && day3.day && day3.day.mintemp_c}°C</p>
                        <div className='flex space-x-1 ml-1'>
                          <img src={day3 && day3.day && day3.day.condition && day3.day.condition.icon} alt="weather icon" className='w-12 h-12' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='w-full mt-2'>
                  <div className='bg-sky-600 h-auto w-11/12 mx-auto my-2 rounded-2xl'>
                    <div className='p-4 flex flex-col'>
                      <p className='text-center text-2xl font-semibold text-gray-300'>AQI Level</p>
                      <p className='text-center text-2xl font-semibold text-white'>{current && current.air_quality && current.air_quality.o3}</p>
                    </div>
                  </div>
                </div>

                <div className='w-full mt-2'>
                  <div className='h-auto w-11/12 mx-auto my-2 rounded-2xl space-y-2'>
                    <div className='flex flex-row space-x-3 justify-around rounded-2xl'>
                      <div className='bg-sky-600 h-28 w-32 p-2 rounded-2xl'>
                        <p className='text-center text-gray-300'>Apparent Temperature</p>
                        <p className='text-center text-white mt-3 text-2xl'>{current && current.temp_c}&deg;c</p>
                      </div>
                      <div className='bg-sky-600 h-28 w-32 p-2 rounded-2xl'>
                        <p className='text-center text-gray-300'>Humidity</p>
                        <p className='text-center text-white mt-3 text-2xl'>{current && current.humidity}%</p>
                      </div>
                    </div>
                    <div className='flex flex-row space-x-3 justify-around rounded-2xl'>
                      <div className='bg-sky-600 h-28 w-32 p-2 rounded-2xl'>
                        <p className='text-center text-gray-300'>Wind speed</p>
                        <p className='text-center text-white mt-3 text-2xl'>{current && current.wind_kph} K/ph</p>
                      </div>
                      <div className='bg-sky-600 h-28 w-32 p-2 rounded-2xl'>
                        <p className='text-center text-gray-300'>UV</p>
                        <p className='text-center text-white mt-3 text-2xl'>{current && current.uv}</p>
                      </div>
                    </div>
                    <div className='flex flex-row space-x-3 justify-around rounded-2xl'>
                      <div className='bg-sky-600 h-28 w-32 p-2 rounded-2xl'>
                        <p className='text-center text-gray-300'>visibility</p>
                        <p className='text-center text-white mt-3 text-2xl'>{current && current.vis_km} Km</p>
                      </div>
                      <div className='bg-sky-600 h-28 w-32 p-2 rounded-2xl'>
                        <p className='text-center text-gray-300'>Air pressure</p>
                        <p className='text-center text-white mt-3 text-2xl'>{current && current.pressure_mb} hpa</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='w-full mt-2'>
                  <div className='bg-sky-600 h-auto w-11/12 mx-auto my-2 rounded-2xl'>
                    <div className='flex flex-row space-x-3 justify-around'>
                      <div className='flex flex-col space-y-2 mb-2'>
                        <p className='text-center mt-3 ml-7'><BsSunriseFill size={30} /></p>
                        <p className='text-white text-xl m-2'>{forecast && forecast.astro && forecast.astro.sunrise}</p>
                      </div>
                      <div className='flex flex-col space-y-2 mb-2'>
                        <p className='text-center mt-3 ml-7'><BsSunset size={30} /></p>
                        <p className='text-white text-xl m-2'>{forecast && forecast.astro && forecast.astro.sunset}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='w-full mt-2'>
                  <div className='bg-sky-600 h-auto w-11/12 mx-auto my-2 rounded-2xl'>
                    <div className='flex flex-row space-x-3 justify-around'>
                      <div className='flex flex-col space-y-2 mb-2'>
                        <p className='text-center mt-3 ml-7'><IoMoonSharp size={30} /></p>
                        <p className='text-white text-xl m-2'>{forecast && forecast.astro && forecast.astro.moonrise}</p>
                      </div>
                      <div className='flex flex-col space-y-2 mb-2'>
                        <p className='text-center mt-3 ml-7'><WiMoonAltNew size={30} /></p>
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


// <ul className='space-y-4'>
//                         {day1 && day1.length > 0 && day1.map((day, index) => {
//                           const maxTemp = day && day.day && day.day.maxtemp_c; // Replace with actual max temp value
//                           const minTemp = day && day.day && day.day.mintemp_c; // Replace with actual min temp value
//                           const dayName = getDayFromEpoch(day && day.date_epoch); // Use your day extraction function
//                           return (
//                             <li key={index} className='flex-none h-16 bg-white rounded-lg shadow-md p-2'>
//                               <div className='flex flex-row justify-between items-center'>
//                                 <h3 className='font-bold text-xl'>{dayName}</h3>
//                                 <p className='text-lg ml-2'>{maxTemp}/{minTemp}°C</p>
//                                 <div className='flex space-x-1 ml-1'>
//                                   <img src={day && day.day && day.day.condition && day.day.condition.icon} alt="weather icon" className='w-12 h-12' />
//                                 </div>
//                               </div>
//                             </li>
//                           );
//                         })}
//                       </ul>
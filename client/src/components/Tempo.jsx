import React from "react";

//"http://dataservice.accuweather.com/currentconditions/v1/127164?apikey=r5xco8w4cxUieaCOUgNv3Po6qZIYndPU&language=pt-br"

const Tempo = () => {
  const accuweatherAPIKEY = "r5xco8w4cxUieaCOUgNv3Po6qZIYndPU";

  async function fecthTempo() {
    const response = await fetch(
      `http://dataservice.accuweather.com/currentconditions/v1/45494?apikey=${accuweatherAPIKEY}&language=pt-br`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const movies = await response.json();
    console.log(movies);
  }

  return <div>Tempo </div>;
};

export default Tempo;

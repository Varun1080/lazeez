const findMyState=()=>{
    const status=document.querySelector("#status");

    const success=(position)=>{
        const latitude=position.coords.latitude;
        const longitude=position.coords.longitude;

        console.log(latitude,longitude);

        const geoUri=`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

        const find=async()=>{

            const data=await fetch(geoUri);
            const _data=await data.json();
        
            status.textContent=`Your location : ${_data.city} Country: ${_data.countryName}`;
        }
        find();
    }
    const error=(position)=>{
        status.textContent="Your Location can not be accessed";
    }

    navigator.geolocation.getCurrentPosition(success,error);
}

window.addEventListener("load",findMyState);
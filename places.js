const loadPlaces = function (coords) {
    //COMMENT FOLLOWING LINE IF YOU WANT TO USE STATIC DATA AND ADD COORDINATES IN THE FOLLOWING 'PLACES' ARRAY
    //const method = 'api';

    const PLACES = [
        {
            name: "Edificio C",
            location: {
             lat: 19.725258, // add here latitude if using static data
             lng: -103.461147, // add here longitude if using static data
             
           }
       },

        

        {
            name: "Auditorio Aguilar Zincer",
            location: {
                lat: 19.7262901, // add here latitude if using static data
                lng: -103.4613013, // add here longitude if using static data
            }
        },

        {
            name: "C.A.S.A.",
            location: {
                lat: 19.725702, // add here latitude if using static data
                lng: -103.462350, // add here longitude if using static data
            }
        },
        {
            name: "Edificio T",
            location: {
                lat: 19.726120, // add here latitude if using static data
                lng: -103.460681, // add here longitude if using static data
            }
        },

        {
            name: "Centro Acuatico",
            location: {
                lat: 19.724283, // add here latitude if using static data
                lng: -103.461716, // add here longitude if using static data
            }
        },

        {
            name: "Laboratorio de Bioquimica",
            location: {
                lat: 19.723928, // add here latitude if using static data
                lng: -103.460268, // add here longitude if using static data
            }
        },

        {
            name: "Rectoria",
            location: {
                lat: 19.725471, // add here latitude if using static data
                lng: -103.461211, // add here longitude if using static data
            }
        },

        {
            name: "Edificio B",
            location: {
                lat: 19.725715, // add here latitude if using static data
                lng: -103.461211, // add here longitude if using static data
            }
        },

    ];

    //AND THE IF METHOD, COUSE IS PART OF "api"

    //if (method === 'api') {
      //  return loadPlaceFromAPIs(coords);
    //}

    return Promise.resolve(PLACES);
};

// getting places from REST APIs
function loadPlaceFromAPIs(position) {
    const params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: 'HKAW5VITMAJNCPSOD3ADM3GGWN4SPT2MGPYAZLDWWOZRRNLZ',
        clientSecret: 'OCR21ENMN54X5JO4BIK3X2OOMNKDJYPJTJ3D0KFDXGBQ2WSI',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API BODY
    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=10
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};


window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs some places nearby
        loadPlaces(position.coords)
            .then((places) => {
                places.forEach((place) => { 
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;

                    // add place name
                    const text = document.createElement('a-link');
                    text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    text.setAttribute('title', place.name);
                    text.setAttribute('href', 'http://www.cusur.udg.mx/es/');
                    text.setAttribute('scale', '7 7 7');
                    
                    // add place icon
                    //const icon = document.createElement('a-image');
                    //icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
                    //icon.setAttribute('name:', place.name);
                    //icon.setAttribute('src', './icon.png');
                    //icon.setAttribute('scale', '10, 10, 10');

                    //icon.addEventListener('loaded', () => {window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
         //});

                    text.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });

                    scene.appendChild(text);
                    //scene.appendChild(icon);
                    
                });
            })
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};
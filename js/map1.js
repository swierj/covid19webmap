mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 4, // starting zoom
    center: [-100, 40], // starting center
    projection: 'albers' // projection type
});

// fetch and store the json data
async function geojsonFetch() { 

    let response = await fetch('assets/us-covid-2020-rates.json');
    let rates = await response.json();


    const layers = [
        '0-9',
        '10-29',
        '30-49',
        '50-99',
        '100-179',
        '180-299'
    ];
    const colors = [
        '#ffffcc',
        '#c7e9b4',
        '#7fcdbb',
        '#41b6c4',
        '#2c7fb8',
        '#253494'
    ];

    //load data to the map as new layers.
    map.on('load', () => {

        // adding data source
        map.addSource('rates', {
            type: 'geojson',
            data: rates
        });

        // add the webmap layer
        map.addLayer({
            'id': 'us-covid-2020-rates-layer',
            'type': 'fill',
            'source': 'rates',
            'minzoom': 3,
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'rates'],
                    '#ffffcc',   // stop_output_0
                    10,          // stop_input_0
                    '#c7e9b4',   // stop_output_1
                    30,          // stop_input_1
                    '#7fcdbb',   // stop_output_2
                    50,          // stop_input_2
                    '#41b6c4',   // stop_output_3
                    100,         // stop_input_3
                    '#2c7fb8',   // stop_output_4
                    180,         // stop_input_4
                    '#253494'  // stop_output_7
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });

        // interactive mouse hover feature. displays in the top right corner of webmap
        map.on('mousemove', ({point}) => {
            const rate = map.queryRenderedFeatures(point, {
                layers: ['us-covid-2020-rates-layer']
            });
            document.getElementById('text-description').innerHTML = rate.length ?
                `<h3>${rate[0].properties.county} County</h3><p><strong><em>${rate[0].properties.rates}</strong> Covid-19 cases per 1,000 people</em></p>` :
                `<p>Hover over a county!</p>`;
        });
    });

    // create legend
    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>Covid-19 Rates<br>(Cases per 1,000 people)<br>";

    layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });
};

geojsonFetch();
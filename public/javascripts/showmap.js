/*var active0 = ['==', ['get', 'active'], 0];
var active1 = ['all', ['>=', ['get', 'active'], 1], ['<', ['get', 'active'], 30]];
var active2 = ['all', ['>=', ['get', 'active'], 30], ['<', ['get', 'active'], 70]];
var active3 = ['all', ['>=', ['get', 'active'], 70], ['<', ['get', 'active'], 100]];
var active4 = ['all', ['>=', ['get', 'active'], 100], ['<', ['get', 'active'], 200]];
var active5 = ['all', ['>=', ['get', 'active'], 200], ['<', ['get', 'active'], 400]];
var active6 = ['all', ['>=', ['get', 'active'], 400], ['<', ['get', 'active'], 600]];
var active7 = ['all', ['>=', ['get', 'active'], 600], ['<', ['get', 'active'], 800]];
var active8 = ['all', ['>=', ['get', 'active'], 800], ['<', ['get', 'active'], 1000]];
var active9 = ['all', ['>=', ['get', 'active'], 1000], ['<', ['get', 'active'], 1500]];
var active10 = ['all', ['>=', ['get', 'active'], 1500], ['<', ['get', 'active'], 2000]];
var active11= ['all', ['>=', ['get', 'active'], 2500], ['<', ['get', 'active'], 3000]];
var colors = ['#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c'];
var active12= ['>=', ['get', 'active'], 3000];*/
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [78.9629, 20.5937],
    zoom: 4
});
function set(coordinateData,coordinate,radius,opacity)
{
        map.addSource(coordinate, {
            type: 'geojson',
            data: coordinateData
        });
    
        map.addLayer({
            id: coordinate,
            type: 'circle',
            source: coordinate,
            paint: {
                'circle-color':'#2196F3',
                'circle-radius':radius,
                'circle-opacity':0.1,
                'circle-stroke-width': 1,
            'circle-stroke-color': '#3366ff'
            } 
            });
            map.on('mouseenter', coordinate, () => {
                map.getCanvas().style.cursor = 'pointer'
              });
              map.on('mouseleave', coordinate, () => {
                map.getCanvas().style.cursor = ''
              });
            map.on('click',coordinate, function (e) {
                const  popUpMarkup= e.features[0].properties;
                const coordinates = e.features[0].geometry.coordinates.slice();
        
                // Ensure that if the map is zoomed out such that
                // multiple copies of the feature are visible, the
                // popup appears over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
        
                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(
                        `<h5>${e.features[0].properties.district},${e.features[0].properties.state}</h5><h5>Active Cases:-${e.features[0].properties.active}</h5>`
                    )
                    .addTo(map);
            });
        
}
map.on('load', function () {
    for(coordinate in coordinates1.features)
    {
        var a=coordinates1.features[coordinate];
         
         if(a.properties['active']<70 && a.properties.active>0)
        {
            set(coordinates1.features[coordinate],coordinate,4,0.7)
        }
        else if(a.properties['active']<100)
        {
            set(coordinates1.features[coordinate],coordinate,5,0.5)
        }
        else if(a.properties['active']<300)
        {
            set(coordinates1.features[coordinate],coordinate,7,0.5)
        }
        else if(a.properties['active']<500)
        {
            set(coordinates1.features[coordinate],coordinate,9,0.4)
        }
        else if(a.properties['active']<800)
        {
            set(coordinates1.features[coordinate],coordinate,11,0.3)
        }
        else if(a.properties['active']<1000)
        {
            set(coordinates1.features[coordinate],coordinate,12,0.3)
        }
        else if(a.properties['active']<1500)
        {
            set(coordinates1.features[coordinate],coordinate,14,0.3)
        }
        else if(a.properties['active']<3000)
        {
            set(coordinates1.features[coordinate],coordinate,15,0.3)
        }
        else{
        set(coordinates1.features[coordinate],coordinate,16,0.3)   
        }  
        }  
    
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            /*'circle-color': [
                'step',
                ['get', 'point_count'],
                '#00BCD4',
                10,
                '#2196F3',
                30,
                '#3F51B5'
            ],
            'circle-radius': [
                'step',
                [78.9629, 20.5937]
                15,
                10,
                20,
                30,
                25
            ]*/
        

    /*map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'covid',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'covid',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    // inspect a cluster on click
    map.on('click', 'clusters', function (e) {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('covid').getClusterExpansionZoom(
            clusterId,
            function (err, zoom) {
                if (err) return;

                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on('click', 'unclustered-point', function (e) {
        const { popUpMarkup } = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popUpMarkup)
            .addTo(map);
    });

    map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
    });*/
});


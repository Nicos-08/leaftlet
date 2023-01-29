const map = L.map('map').setView([45.7495282, 4.8270654], 12);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// let college = L.marker([45.7523078918457, 4.811722278594971]).addTo(map);
// college.bindPopup("<b>Le collège</b>").openPopup();

// let heva = L.marker([45.7666646, 4.8617162]).addTo(map);
// heva.bindPopup("<b>Heva</b>").openPopup();
 
// let maison = L.marker([45.7436553, 4.7979793]).addTo(map);
// maison.bindPopup("<b>Ma maison</b>").openPopup();
 
// let perrache = L.marker([45.7495282, 4.8270654]).addTo(map);
// perrache.bindPopup("<b>Perrache</b>").openPopup();

const info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    const contents = props ? `<b>${props.nomreduit}</b><br />${props.densite} habitants / km<sup>2</sup>` : 'Survole un arrondissement';
    this._div.innerHTML = `<h4>Densité des arrondissements</h4>${contents}`;
};

info.addTo(map);



function getColor(d) {
    console.log(d);
    return d > 17000 ? '#990000' :
           d > 15000 ? '#d7301f' :
           d > 13000 ? '#ef6548' :
           d > 11000 ? '#fc8d59' :
           d > 8000 ? '#fdbb84' :
           d > 7000 ? '#fdd49e' :
           d > 4000  ? '#fee8c8' :
                       '#fff7ec';
}




function style(feature) {
    return {
        fillColor: getColor(feature.properties.densite),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}




function highlightFeature(e) {
    const layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();

    info.update(layer.feature.properties);
}


const geojson = L.geoJson(dataArrondissements, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);





function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}


function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}


const legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    const div = L.DomUtil.create('div', 'info legend');
    const grades = [0, 4000, 7000, 8000, 11000, 13000, 15000, 17000];
    const labels = [];
    let from, to;

    for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(`<i style="background:${getColor(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`);
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);

document.addEventListener('DOMContentLoaded', () => {

        // Does it have Latitude and Longitude columns?
        let columns = Array.prototype.map.call(
            document.querySelectorAll('.table th'),
            (th) => th.textContent.trim()
        );
        let latitudeColumn = null;
        let longitudeColumn = null;
        columns.forEach((col) => {
            if (col.toLowerCase() == (window.DATASETTE_CLUSTER_MAP_LATITUDE_COLUMN || 'latitude').toLowerCase()) {
                latitudeColumn = col;
            }
            if (col.toLowerCase() == (window.DATASETTE_CLUSTER_MAP_LONGITUDE_COLUMN || 'longitude').toLowerCase()) {
                longitudeColumn = col;
            }
        });
        if (latitudeColumn && longitudeColumn) {
            addClusterMap(latitudeColumn, longitudeColumn);
        }
});

const addClusterMap = (latitudeColumn, longitudeColumn) => {
    let keepGoing = false;

    const loadMarkers = (path, map, markerClusterGroup, progressDiv, count) => {
        count = count || 0;
        return fetch(path).then(r => r.json()).then(data => {
            let markerList = [];
            data.rows.forEach((row) => {
                if (row[latitudeColumn] && row[longitudeColumn]) {
                    let title = JSON.stringify(row, null, 4);
                    let marker = L.marker(
                        L.latLng(
                            row[latitudeColumn],
                            row[longitudeColumn]
                        ),
                        {title: title}
                    );
                    marker.bindPopup('<pre style="height: 200px; overflow: auto">' + title + '</pre>');
                    markerList.push(marker);
                }
            });
            count += data.rows.length;
            markerClusterGroup.addLayers(markerList);
            map.fitBounds(markerClusterGroup.getBounds());
            let percent = '';
            let button;
            // Fix for http v.s. https
            let next_url = data.next_url;
            if (next_url && location.protocol == 'https:') {
                next_url = next_url.replace(/^https?:/, 'https:');
            }
            if (next_url) {
                percent = ` (${Math.round((count / data.filtered_table_rows_count * 100) * 100) / 100}%)`;
                // Add a control to either continue loading or pause
                button = document.createElement('button');
                button.style.color = '#fff';
                button.style.backgroundColor = '#007bff';
                button.style.borderColor = '#007bff';
                button.style.verticalAlign = 'middle';
                button.style.cursor = 'pointer';
                button.style.border = '1px solid blue';
                button.style.padding = '0.3em 0.8em';
                button.style.fontSize = '0.6rem';
                button.style.lineHeight = '1';
                button.style.borderRadius = '.25rem';
                if (keepGoing) {
                    button.innerHTML = 'pause';
                    button.addEventListener('click', () => {
                        keepGoing = false;
                    });
                } else {
                    button.innerHTML = 'load all';
                    button.addEventListener('click', () => {
                        keepGoing = true;
                        loadMarkers(
                            next_url,
                            map,
                            markerClusterGroup,
                            progressDiv,
                            count,
                            keepGoing
                        );
                    });
                }
                progressDiv.innerHTML = `Showing ${count.toLocaleString()} of ${data.filtered_table_rows_count.toLocaleString()}${percent} `;
                if (button) {
                    progressDiv.appendChild(button);
                }
            } else {
                progressDiv.innerHTML = '';
            }
            if (next_url && keepGoing) {
                return loadMarkers(
                    next_url,
                    map,
                    markerClusterGroup,
                    progressDiv,
                    count
                );
            }
        });
    };

    let el = document.createElement('div');
    el.style.width = '100%';
    el.style.height = '500px';
    let tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        detectRetina: true,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    latlng = L.latLng(0, 0);
    let map = L.map(el, {
        //center: latlng,
        zoom: 13,
        layers: [tiles]
    });
    let facets= document.querySelector('.suggested-facets');
    facets.parentNode.insertBefore(el, facets.nextSibling);

    let progressDiv = document.createElement('div');
    progressDiv.style.marginBottom = '2em';
    el.parentNode.insertBefore(progressDiv, el.nextSibling);
    let markerClusterGroup = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 50
    });
    map.addLayer(markerClusterGroup);
    let path = location.pathname + '.jsono' + location.search;
    if (path.indexOf('?') > -1) {
        path += '&_size=max&_labels=on';
    } else {
        path += '?_size=max&_labels=on';
    }
    loadMarkers(path, map, markerClusterGroup, progressDiv, 0);
};

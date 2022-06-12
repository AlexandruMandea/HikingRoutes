export const bikeIcon: google.maps.Icon = {
    url: 'http://127.0.0.1:8887/markers/bike.png',
    size: new google.maps.Size(45, 45),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(22, 40),
};

export const hikerIcon: google.maps.Icon = {
    url: 'http://127.0.0.1:8887/markers/hiker.png',
    size: new google.maps.Size(45, 45),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(22, 40),
};

export const redMarker: google.maps.Icon = {
    url: 'http://127.0.0.1:8887/markers/red_marker.png',//'D:\\resource_server\\hiking-routes\\markers\\red_marker.png'
    size: new google.maps.Size(45, 45),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(22.5, 45),
};

export const greenMarker: google.maps.Icon = {
    url: 'http://127.0.0.1:8887/markers/green_marker.png',
    size: new google.maps.Size(45, 45),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(14, 45),
};

export const yellownMarker: google.maps.Icon = {
    url: 'http://127.0.0.1:8887/markers/yellow_marker.png',
    size: new google.maps.Size(45, 45),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(23, 45),
};

export const flagIcon = {
    url: 'http://127.0.0.1:8887/markers/red_flag_marker.png',
    size: new google.maps.Size(45, 45),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(14, 42),
};

export const flagShape: google.maps.MarkerShape = {
    coords: [9, 0, 25, 0, 30, 7, 42, 7, 42, 27, 17, 27, 17, 42, 22, 42, 22, 45, 2, 45, 2, 42, 9, 42, 9, 0],
    type: 'poly',
};

export const googleMarkerIcon: google.maps.Icon = {
    url: 'http://127.0.0.1:8887/markers/google_marker.png',
    size: new google.maps.Size(45, 45),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(14, 42),
}
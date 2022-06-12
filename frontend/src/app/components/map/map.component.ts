import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { retroStyle } from './styles/retro';
import { } from 'googlemaps';
import { GeocoderResult, LatLng, MapsEventListener } from '@agm/core/services/google-maps-types';
import { MapPointWithMarker } from './model/map-point-with-marker-interface';
import { bikeIcon, hikerIcon, flagIcon, flagShape, googleMarkerIcon, redMarker } from './styles/markers';
import { Chart } from 'node_modules/chart.js';
import { MapService } from 'src/app/services/map/map.service';
import { Route } from './model/route-interface';
import { RouteUnit, TravelMode } from 'src/environments/app-constants';
import { MatDialog } from '@angular/material/dialog';
import { RouteDialogComponent } from '../route-dialog/route-dialog.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { MapPoint } from './model/map-point-interface';
import { User } from '../login/model/user-interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  private map!: google.maps.Map;
  private markers: google.maps.Marker[];
  private mapClickListener!: MapsEventListener;
  private geocoder: google.maps.Geocoder;
  private directionsService;
  private directionsRenderer;
  private elevator;

  private originAndDestinationForm: FormGroup;
  private customRouteEnabled: boolean = false;
  private canvas: any;
  private ctx: any;

  private createdRoute: Route = {};
  private originPoint: MapPointWithMarker;
  private destinationPoint: MapPointWithMarker;
  private waypoints: google.maps.DirectionsWaypoint[];
  private travelMode: google.maps.TravelMode;
  private randomMarker: google.maps.Marker;
  private routeDistance: number = 0;
  private routeDuration: string = '';
  private metersToClimb: number = 0;
  private metersToDescend: number = 0;
  private routeWarnings: string = '';

  private routeForTemplate: Route | undefined = undefined;

  private canSaveRoute: boolean = false;

  @ViewChild('map', { read: ElementRef }) private mapElement!: ElementRef;
  @ViewChild('myChart', { read: ElementRef }) myChart: any;

  private readonly initCenter = { lat: 53.65261505969125, lng: -2.207614433188918 };
  private readonly initZoom = 6;
  private readonly ENTER_KEY_CODE = 13;
  private readonly CHART_CTX: string = 'myChart';

  constructor(
    private readonly mapService: MapService,
    private matDialog: MatDialog,
    private authenticationService: AuthenticationService
  ) {
    this.originAndDestinationForm = new FormGroup({
      origin: new FormControl(''),
      destination: new FormControl('')
    });

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();

    this.geocoder = new google.maps.Geocoder();
    this.elevator = new google.maps.ElevationService();

    //autocomplete 1, 2

    this.markers = [];
    this.waypoints = [];

    this.originPoint = { marker: new google.maps.Marker(), addressString: '' };
    this.destinationPoint = { marker: new google.maps.Marker(), addressString: '' };

    this.travelMode = google.maps.TravelMode.BICYCLING;

    this.randomMarker = new google.maps.Marker({
      icon: this.travelMode == 'BICYCLING' ? bikeIcon : hikerIcon,
    });

    this.routeForTemplate = this.mapService.getRouteForTemplate();
  }

  ngOnInit(): void {

    //autocomplete

  }

  ngAfterViewInit(): void {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: this.initCenter,
      zoom: this.initZoom,
      mapTypeControlOptions: {
        mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "retro_map"],
      },
    });

    const styledMapType = new google.maps.StyledMapType(retroStyle, { name: "Retro Map" });
    this.map.mapTypes.set("retro_map", styledMapType);

    const bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(this.map);

    this.directionsRenderer.setMap(this.map);
    this.directionsRenderer.setOptions({ suppressMarkers: true });

    this.canvas = this.myChart.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    this.myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        datasets: [],
      },
    });

    this.loadRouteForTemplateIfReceived();

    this.assignEventsToElements();
  }

  assignEventsToElements() {
    // autocomplete1.addListener("place_changed", viewRoute);
    // autocomplete2.addListener("place_changed", viewRoute);

    this.randomMarker.addListener("click", () => {
      this.randomMarker.setMap(null);
    });
  }

  onKeyUpEnter(event: { keyCode: number; }) {
    if (event.keyCode === this.ENTER_KEY_CODE) {
      (document.activeElement as HTMLElement).blur();
    }
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    let waypoint = { location: event.latLng as LatLng, stopover: true } as google.maps.DirectionsWaypoint;

    const marker = this.createMarker({ lat: event.latLng.lat().toString(), lng: event.latLng.lng().toString() }, waypoint);

    this.markers.push(marker);
    this.waypoints.push(waypoint);

    this.viewRoute();
  }

  createMarker(position: MapPoint, waypoint: google.maps.DirectionsWaypoint) {
    let marker = new google.maps.Marker({
      position: { lat: parseFloat(position.lat as string), lng: parseFloat(position.lng as string) },
      map: this.map,
      icon: redMarker,
      title: "Waypoint",
      draggable: true
    });

    marker.addListener("click", () => {
      this.onMarkerClick(marker, waypoint);
    });
    marker.addListener("dragend", () => {
      let newWaypoint = { location: marker.getPosition() as LatLng, stopover: true } as google.maps.DirectionsWaypoint;

      this.arrayReplace(this.waypoints, waypoint, newWaypoint);
      waypoint = newWaypoint;

      this.viewRoute();
    });

    return marker;
  }

  onMarkerClick(marker: google.maps.Marker, waypoint: google.maps.DirectionsWaypoint) {
    this.arrayRemove(this.markers, marker);
    this.arrayRemove(this.waypoints, waypoint);
    marker.setMap(null);

    this.viewRoute();
  }

  enableCustomRoute() {
    this.customRouteEnabled = true;

    this.mapClickListener = this.map.addListener("click", (event) => {
      this.onMapClick(event);
    });
  }

  closeCustomRoute() {
    this.customRouteEnabled = false;

    if (this.mapClickListener !== null) {
      this.mapClickListener.remove();
    }
  }

  clearWaypoints() {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }

    this.markers.splice(0, this.markers.length);
    this.waypoints.splice(0, this.waypoints.length);

    this.viewRoute();
  }

  changeTravelMode(event: any) {
    this.travelMode = event;
    this.createdRoute.travelMode = event;
  }

  viewRoute() {
    this.codeAddress();

    this.myChart.destroy();

    this.randomMarker.setMap(null);

    if (this.canFormRoute()) {
      this.calculateAndDisplayRoute();
    } else {
      this.canSaveRoute = false;

      this.directionsRenderer.setDirections({
        routes: [],
        geocoded_waypoints: []
      });
    }
  }

  calculateAndDisplayRoute() {
    let originQuery = this.originAndDestinationForm.value.origin;
    let destinationQuery = this.originAndDestinationForm.value.destination;
    const noOfWaypoints = this.waypoints.length;
    const noOfMarkers = this.markers.length;

    if (originQuery == "") {
      originQuery = `${(this.waypoints[0].location as LatLng).lat()},${(this.waypoints[0].location as LatLng).lng()}`;
      this.markers[0].setTitle("Origin");
      this.markers[0].setIcon(googleMarkerIcon);
    }
    if (destinationQuery == "") {
      destinationQuery = `${(this.waypoints[noOfWaypoints - 1].location as LatLng).lat()},${(this.waypoints[noOfWaypoints - 1].location as LatLng).lng()}`;
      this.markers[noOfMarkers - 1].setIcon(flagIcon);
      this.markers[noOfMarkers - 1].setShape(flagShape);
      this.markers[noOfMarkers - 1].setTitle("Destination");
      if (noOfMarkers - 2 > 0) {
        this.markers[noOfMarkers - 2].setTitle("Waypoint");
        this.markers[noOfMarkers - 2].setIcon(redMarker);
        this.markers[noOfMarkers - 2].setShape(null);
      }
    }

    this.directionsService.route({
      origin: originQuery,
      destination: destinationQuery,
      travelMode: this.travelMode,
      waypoints: this.waypoints,
      unitSystem: google.maps.UnitSystem.METRIC

    }, (results, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.canSaveRoute = true;
        this.directionsRenderer.setDirections(results);

        this.calculateDistance(results.routes[0].legs);
        this.calculateDuration(results.routes[0].legs);
        this.displayRouteElevation(results.routes[0].overview_path);

        this.routeWarnings = results.routes[0].warnings[0];

        this.prepareRouteForSaving(results.routes[0]);

        // let distance = 0;
        // let duration = 0;

        // distance = this.calculateDistance(results.routes[0].legs);
        // duration = this.calculateDuration(results.routes[0].legs);

        // console.log("distance: " + distance / 1000 + " km");
        // console.log("duration: " + parseInt((duration / 3600).toString()) + " hour(s) and " + parseInt(((duration % 3600) / 60).toString()) + " minutes");


        //console.log(results.routes[0].overview_path[0].lat() + " " + results.routes[0].overview_path[0].lng());
        //console.log(results.routes[0].overview_path[results.routes[0].overview_path.length - 1].lat() + " " + results.routes[0].overview_path[results.routes[0].overview_path.length - 1].lng());
      } else {
        this.canSaveRoute = false;
        window.alert("Could not find a route with the given options!");

        this.routeDistance = 0;
        this.routeDuration = '';
        this.metersToClimb = 0;
        this.metersToDescend = 0;
      }
    });

    //.catch((e) => window.alert("e"));//iar apoi sa sterg toate pct si ruta vechi?
    //document.getElementById("form").reset();
  }

  codeAddress() {
    const originQuery = this.originAndDestinationForm.value.origin;
    const destinationQuery = this.originAndDestinationForm.value.destination;
    const indexOfLastMarker = this.markers.length - 1;

    if (this.originPoint.addressString !== originQuery) {
      try {
        this.geocoder.geocode({ 'address': originQuery }, (results, status) => {
          if (this.originPoint.marker !== null) {
            this.originPoint.marker.setMap(null);
            this.originPoint.addressString = '';
          }
          if (status == 'OK') {
            this.map.setCenter(results[0].geometry.location);
            this.map.setZoom(15);

            if (this.markers[0]) {
              this.markers[0].setIcon(redMarker);
              this.markers[0].setShape(null);
              this.markers[0].setTitle("Waypoint");
            }

            this.originPoint.marker = new google.maps.Marker({
              map: this.map,
              icon: googleMarkerIcon,
              position: results[0].geometry.location,
              title: "Origin",
            });
            this.originPoint.addressString = originQuery;
          }
        });
      } catch (error) {
        this.originPoint.marker.setMap(null);
      }
    }

    if (this.destinationPoint.addressString !== destinationQuery) {
      try {
        this.geocoder.geocode({ 'address': destinationQuery }, (results, status) => {
          if (this.destinationPoint.marker !== null) {
            this.destinationPoint.marker.setMap(null);
            this.destinationPoint.addressString = '';
          }
          if (status == 'OK') {
            this.map.setCenter(results[0].geometry.location);
            this.map.setZoom(15);

            if (this.markers[indexOfLastMarker]) {
              this.markers[indexOfLastMarker].setIcon(redMarker);
              this.markers[indexOfLastMarker].setShape(null);
              this.markers[indexOfLastMarker].setTitle("Waypoint");
            }

            this.destinationPoint.marker = new google.maps.Marker({
              map: this.map,
              position: results[0].geometry.location,
              icon: flagIcon,
              shape: flagShape,
              title: "Destination",
            });
            this.destinationPoint.addressString = destinationQuery;
          }
        });
      } catch (error) {
        this.destinationPoint.marker.setMap(null);
      }
    }
  }

  displayRouteElevation(overview_path: any) {
    let latlngObjects = []

    for (let index = 0; index < overview_path.length; index++) {
      latlngObjects.push({ lat: overview_path[index].lat(), lng: overview_path[index].lng() });
    }

    this.elevator.getElevationForLocations({
      locations: latlngObjects,
    }, (results) => {
      if (results) {
        this.metersToClimb = parseInt(this.mapService.calculateTotalDistanceOfAscending(results).toString());
        this.metersToDescend = parseInt(this.mapService.calculateTotalDistanceOfDescending(results).toString());

        this.displayElevationChart(results);
      }
    });
  }

  displayElevationChart(elevationResults: any) {
    let elevationValues = [];
    let labels: string[] = [];
    let gradient = this.ctx.createLinearGradient(0, 0, 0, 400);

    for (let index = 0; index < elevationResults.length; index++) {
      elevationValues.push(elevationResults[index].elevation);

      labels.push('');
    }

    gradient.addColorStop(0, "rgba(179, 60, 0, 0.9)");//green
    gradient.addColorStop(1, "rgba(45, 179, 0, 0.9)");//brown

    const data = {
      labels,
      datasets: [
        {
          data: elevationValues,
          label: "Altitude (m)",
          fill: true,
          backgroundColor: gradient,
          borderColor: '#fff',
          pointBackgroundColor: '#ffff00',
          tension: 0.4,
        }
      ]
    };

    this.myChart.destroy();

    this.myChart = new Chart(this.ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        hover: {
          mode: 'x',
          intersect: false,
        },
        onHover: (e: any) => {
          this.onChartClickOrHover(e, elevationResults);
        },
        onClick: (e: any) => {
          this.onChartClickOrHover(e, elevationResults);
        },
        scales: {
          y: {
            ticks: {
              callback: (value: any) => {
                return value + " m";
              }
            }
          }
        }
      }
    });
  }

  onChartClickOrHover(e: any, elevationResults: google.maps.ElevationResult[]) {
    const indexX = this.myChart.scales.x.getValueForPixel(e.x);

    if (indexX >= 0 && indexX < elevationResults.length) {
      this.randomMarker.setPosition(elevationResults[indexX].location);
      this.randomMarker.setTitle(parseInt(elevationResults[indexX].elevation.toString()) + " m Altitude");
      this.randomMarker.setIcon(this.travelMode == "BICYCLING" ? bikeIcon : hikerIcon);
      this.randomMarker.setMap(this.map);
    }
  }

  prepareRouteForSaving(route: google.maps.DirectionsRoute) {
    const noOfPoints = route.overview_path.length;
    let myRoute: Route = {};

    myRoute.origin = {
      lat: route.overview_path[0].lat().toString(),
      lng: route.overview_path[0].lng().toString(),
    };
    myRoute.destination = {
      lat: route.overview_path[noOfPoints - 1].lat().toString(),
      lng: route.overview_path[noOfPoints - 1].lng().toString(),
    };

    this.geocoder.geocode({ location: { lat: parseFloat(myRoute.destination.lat as string), lng: parseFloat(myRoute.destination.lng as string) } }, (results) => {
      const addressTypes = ['administrative_area_level_1', 'point_of_interest', 'country', 'locality', 'street_address', 'route'];
      myRoute.searchString = '';

      results.filter(element => {
        return element.types.some(areaLevel => {
          return addressTypes.includes(areaLevel);
        })
      }).forEach(element => {
        myRoute.searchString += `${element.formatted_address} `;
      })

      myRoute.region = (results.find(element => {
        return element.types.find((areaLevel) => {
          return areaLevel === 'administrative_area_level_1';
        })
      }) as GeocoderResult).formatted_address;
    });

    myRoute.overviewPolyline = route.overview_polyline;
    myRoute.distance = this.routeDistance;
    myRoute.duration = this.routeDuration;
    myRoute.totalAscending = this.metersToClimb;
    myRoute.totalDescending = this.metersToDescend;
    myRoute.unit = RouteUnit.METRIC;
    myRoute.warnings = this.routeWarnings;
    myRoute.travelMode = this.travelMode as TravelMode;

    myRoute.waypoints = [];
    for (let index = 0; index < this.waypoints.length; ++index) {
      myRoute.waypoints.push({
        lat: (this.waypoints[index].location as LatLng).lat().toString(),
        lng: (this.waypoints[index].location as LatLng).lng().toString(),
        index: index
      });
    }

    if (this.originAndDestinationForm.value.origin === '') {
      myRoute.waypoints.splice(0, 1);
    }

    if (this.originAndDestinationForm.value.destination === '') {
      myRoute.waypoints.splice(myRoute.waypoints.length - 1, 1);
    }

    this.createdRoute = myRoute;
  }

  openRouteDialog() {
    const dialogRef = this.matDialog.open(RouteDialogComponent, {
      data: { routeTitle: '', isPrivate: false }
    });

    return dialogRef.afterClosed().subscribe(result => {
      if (result) {
        (this.createdRoute as Route).title = result.routeTitle;
        (this.createdRoute as Route).isPrivate = result.isPrivate;

        this.saveRoute();
      }
    });
  }

  loadRouteForTemplateIfReceived() {
    if (this.routeForTemplate !== undefined) {
      this.mapService.getRouteById(this.routeForTemplate.id as string).subscribe(
        (route) => {
          this.routeForTemplate = route;

          const routeBounds = this.getOriginAndDestinationFromPolyline(this.routeForTemplate.overviewPolyline as string);
          const origin = routeBounds.origin;
          const destination = routeBounds.destination;
          const noOfWaypoints = (this.routeForTemplate.waypoints as MapPoint[]).length;

          let originWaypoint = {
            location: new google.maps.LatLng(origin.lat, origin.lng),
            stopover: false
          } as google.maps.DirectionsWaypoint;
          let originMarker = this.createMarker({ lat: origin.lat.toString(), lng: origin.lng.toString() }, originWaypoint);

          this.waypoints.push(originWaypoint);
          this.markers.push(originMarker);

          (this.routeForTemplate.waypoints as MapPoint[]).sort(
            (a: MapPoint, b: MapPoint) => {
              return (a.index as number) - (b.index as number)
            }
          );

          (this.routeForTemplate.waypoints as MapPoint[]).forEach(waypoint => {
            const googleWaypoint = {
              location: new google.maps.LatLng(parseFloat(waypoint.lat as string), parseFloat(waypoint.lng as string)),
              stopover: false
            } as google.maps.DirectionsWaypoint;

            const marker = this.createMarker(
              {
                lat: waypoint.lat as string,
                lng: waypoint.lng as string
              },
              googleWaypoint
            );

            this.markers.push(marker);
            this.waypoints.push(googleWaypoint);
          });

          let destinationWaypoint = {
            location: new google.maps.LatLng(destination.lat, destination.lng),
            stopover: false
          } as google.maps.DirectionsWaypoint;
          let destinationMarker = this.createMarker({ lat: destination.lat.toString(), lng: destination.lng.toString() }, destinationWaypoint);

          this.waypoints.push(destinationWaypoint);
          this.markers.push(destinationMarker);

          this.travelMode = route.travelMode as TravelMode;

          this.markers[0].setIcon(googleMarkerIcon);
          this.markers[this.markers.length - 1].setIcon(flagIcon);

          this.calculateAndDisplayRoute();

          this.routeForTemplate = undefined;
          this.mapService.setRouteForTemplate(undefined);
        }
      );
    }
  }

  saveRoute() {
    this.mapService.postRoute(this.createdRoute as Route).subscribe({
      next: (route: Route) => {
        let user = this.authenticationService.getLoggedInUser() as User;
        user.createdRoutes?.push(route);
        this.authenticationService.updateLoggedInUserFromLocalStorage(user);
      },
      error: error => {
        console.log(error);
      }
    });
  }








  isUserAuthenticated() { return this.authenticationService.isLoggedIn(); }

  isCustomRouteEnabled() { return this.customRouteEnabled; }

  canFormRoute() {
    let noOfPoints = 0;

    if (this.originAndDestinationForm.value.origin !== "") {
      ++noOfPoints;
    }

    if (this.originAndDestinationForm.value.destination !== "") {
      ++noOfPoints;
    }

    noOfPoints += this.waypoints.length;

    return noOfPoints >= 2;
  }

  calculateDistance(legs: google.maps.DirectionsLeg[]) {
    let distance = 0;

    legs.forEach(leg => {
      distance += leg.distance.value;
    });

    this.routeDistance = distance / 1000;

    return distance;
  }

  calculateDuration(legs: google.maps.DirectionsLeg[]) {
    let duration = 0;

    legs.forEach(leg => {
      duration += leg.duration.value;
    });

    this.routeDuration = `${parseInt((duration / 3600).toString())} hour(s) and ${parseInt(((duration % 3600) / 60).toString())} minutes`

    return duration;
  }

  arrayRemove(array: any[], value: any) {
    const index = array.indexOf(value);

    if (index > -1) {
      array.splice(index, 1);
    }
  }

  arrayReplace(array: any[], oldValue: any, newValue: any) {
    const index = array.indexOf(oldValue);

    if (index > -1) {
      array[index] = newValue;
    }
  }

  getOriginAndDestinationFromPolyline(polyline: string) {
    const points = this.mapService.decodePolyline(polyline);

    const origin = { lat: points[0].latitude, lng: points[0].longitude };
    const destination = { lat: points[points.length - 1].latitude, lng: points[points.length - 1].longitude };

    return { origin, destination };
  }

  getOriginAndDestinationForm() { return this.originAndDestinationForm; }

  getRouteDistance() { return this.routeDistance; }

  getRouteDuration() { return this.routeDuration; }

  getMetersToClimb() { return this.metersToClimb; }

  getMetersToDescend() { return this.metersToDescend; }

  getRouteWarnings() { return this.routeWarnings; }

  getTravelMode() { return this.travelMode.toString(); }

  canRouteBeSaved() { return this.canSaveRoute; }
}

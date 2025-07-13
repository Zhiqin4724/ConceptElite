import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for *ngFor
import { GoogleMapsModule } from '@angular/google-maps';
// IMPORTANT: Do not share your API key publicly in your code. Use environment variables.
// AIzaSyBpxboqa6ZWBWg8derbe2O77PVogFS657Y

// UPDATED: Location interface to separate address into two lines
interface Location {
  id: number;
  lat: number;
  lng: number;
  title: string;   // Your custom name
  address1: string; // The street address line
  address2: string; // The city, province, postal code line
}

@Component({
  selector: 'app-map',
  standalone: true, // <-- ADDED: Necessary for standalone components
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class Map implements OnInit {
  // Map options
  center: google.maps.LatLngLiteral = { lat: 45.5217, lng: -73.6873 }; // Montreal, QC
  zoom = 11;
  mapOptions: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 17,
    minZoom: 8,
  };

  // UPDATED: Locations data with custom titles and split address lines
  locations: Location[] = [
    {
      id: 1,
      title: 'Boul. Lapinière Store', // <-- CUSTOM TITLE
      address1: '2151 Boul. Lapinière',
      address2: 'Brossard, QC J4W 1M3, Canada',
      lat: 45.471983981605185,
      lng: -73.4704416509262
    },
    {
      id: 2,
      title: 'Rue Saint-Laurent Outlet', // <-- CUSTOM TITLE
      address1: '825 Rue Saint-Laurent O',
      address2: 'Longueuil, QC J4K 2V1, Canada',
      lat: 45.52929694808476,
      lng: -73.51450937605745
    },
    {
      id: 3,
      title: 'Pointe-Claire Office', // <-- CUSTOM TITLE
      address1: '6361 Route Transcanadienne',
      address2: 'Pointe-Claire, QC H9R 3S3, Canada',
      lat: 45.46710470536975,
      lng: -73.82831102460632
    },
    {
      id: 4,
      title: 'Sainte-Marthe-sur-le-Lac Hub', // <-- CUSTOM TITLE
      address1: 'Sainte-Marthe-sur-le-Lac',
      address2: 'QC J0N 1P0, Canada',
      lat: 45.52894694822505,
      lng: -73.93585222209015
    },
    {
      id: 5,
      title: 'Bd Newman Center', // <-- CUSTOM TITLE
      address1: '7077 Bd Newman',
      address2: 'LaSalle, QC H8N 1X1, Canada',
      lat: 45.448788259765074,
      lng: -73.6164947198517
    },
    {
      id: 6,
      title: 'Av. Dorval Main Shop', // <-- CUSTOM TITLE
      address1: '360 Av. Dorval',
      address2: 'Dorval, QC H9S 5V8, Canada',
      lat: 45.44540354554402,
      lng: -73.74325416441805
    },
    {
      id: 7,
      title: 'Blvd. de la Concorde Branch', // <-- CUSTOM TITLE
      address1: '2945 Blvd. de la Concorde E',
      address2: 'Laval, QC H7E 2B5, Canada',
      lat: 45.59196596941578,
      lng: -73.66985327790985
    }
  ];

  selectedLocationId: number | null = null;
  infoWindow: google.maps.InfoWindow | undefined;
  markerOptions: google.maps.MarkerOptions = { draggable: false };

  constructor() { }

  ngOnInit(): void { }

  // Event handler for when a marker is clicked on the map
  onMarkerClick(location: Location, marker: any) {
    this.selectedLocationId = location.id; // Highlight the selected marker
    // Uncomment these lines to enable zoom and pan on marker click
    this.center = { lat: location.lat, lng: location.lng }; // Center the map on the marker
    this.zoom = 14; // Zoom in to the selected location

    // Optional: Open an info window with details
    // if (this.infoWindow) {
    //   this.infoWindow.close();
    // }
    // this.infoWindow = new google.maps.InfoWindow({
    //   content: `<h3>${location.title}</h3><p>${location.address1}</p>`
    // });
    // this.infoWindow.open(marker.getMap(), marker);
  }

  // UPDATED: Event handler for when a location is clicked in the list
  // It only changes the selected ID to highlight the marker, no zoom.
  onListClick(location: Location) {
    this.selectedLocationId = location.id;
    this.center = { lat: location.lat, lng: location.lng }; // Center the map on the marker
    this.zoom = 12; // Zoom in to the selected location
  }

  // Optional: A function to get a custom icon based on selection state
  getMarkerIcon(locationId: number): google.maps.Icon | google.maps.Symbol | string {
    if (this.selectedLocationId === locationId) {
      return {
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // A red pushpin icon
        scaledSize: new google.maps.Size(48, 48) // Make it a bit bigger
      };
    } else {
      return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'; // A blue pushpin icon
    }
  }
}
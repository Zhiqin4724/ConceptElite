import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapInfoWindow, MapMarker } from '@angular/google-maps'; // Import MapInfoWindow and MapMarker for clarity on what's still used

// IMPORTANT: Do not share your API key publicly in your code. Use environment variables.
// AIzaSyBpxboqa6ZWBWg8derbe2O77PVogFS657Y

// UPDATED: Location interface to separate address into two lines
interface Location {
  id: number;
  lat: number;
  lng: number;
  title: string;   // Your custom name
  address1: string; // The street address line
  address2: string; // The city, province, postal code line
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class Map implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined; // Use MapInfoWindow from @angular/google-maps
  @ViewChild(GoogleMap) googleMap: GoogleMap | undefined; // Reference to the google-map component

  // Map options
  center: google.maps.LatLngLiteral = { lat: 45.5217, lng: -73.6873 }; // Montreal, QC
  zoom = 11;
  mapOptions: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 17,
    minZoom: 8,
    mapId: 'YOUR_MAP_ID', // *** IMPORTANT: Replace with your actual Map ID ***
                           // You can create one in Google Cloud Console -> Maps -> Map Management
                           // For testing, 'DEMO_MAP_ID' can be used, but replace for production.
  };

  // Locations data
  locations: Location[] = [
    {
      id: 1,
      title: 'Boul. Lapinière Store',
      address1: '2151 Boul. Lapinière',
      address2: 'Brossard, QC J4W 1M3, Canada',
      lat: 45.471983981605185,
      lng: -73.4704416509262
    },
    {
      id: 2,
      title: 'Rue Saint-Laurent Outlet',
      address1: '825 Rue Saint-Laurent O',
      address2: 'Longueuil, QC J4K 2V1, Canada',
      lat: 45.52929694808476,
      lng: -73.51450937605745
    },
    {
      id: 3,
      title: 'Pointe-Claire Office',
      address1: '6361 Route Transcanadienne',
      address2: 'Pointe-Claire, QC H9R 3S3, Canada',
      lat: 45.46710470536975,
      lng: -73.82831102460632
    },
    {
      id: 4,
      title: 'Sainte-Marthe-sur-le-Lac Hub',
      address1: 'Sainte-Marthe-sur-le-Lac',
      address2: 'QC J0N 1P0, Canada',
      lat: 45.52894694822505,
      lng: -73.93585222209015
    },
    {
      id: 5,
      title: 'Bd Newman Center',
      address1: '7077 Bd Newman',
      address2: 'LaSalle, QC H8N 1X1, Canada',
      lat: 45.448788259765074,
      lng: -73.6164947198517
    },
    {
      id: 6,
      title: 'Av. Dorval Main Shop',
      address1: '360 Av. Dorval',
      address2: 'Dorval, QC H9S 5V8, Canada',
      lat: 45.44540354554402,
      lng: -73.74325416441805
    },
    {
      id: 7,
      title: 'Blvd. de la Concorde Branch',
      address1: '2945 Blvd. de la Concorde E',
      address2: 'Laval, QC H7E 2B5, Canada',
      lat: 45.59196596941578,
      lng: -73.66985327790985
    }
  ];

  selectedLocationId: number | null = null;
  advancedMarkers: { [key: number]: google.maps.marker.AdvancedMarkerElement } = {};
  currentInfoWindow: google.maps.InfoWindow | undefined; // To manage a single info window

  constructor() { }

  async ngOnInit(): Promise<void> {
    // You might not need this if your GoogleMapsModule is configured to load libraries.
    // However, it's a good practice to ensure the 'marker' library is loaded.
    // For @angular/google-maps, you typically configure this in your main.ts or app.module.ts
    // with the GoogleMapsModule.forRoot() call:
    // GoogleMapsModule.forRoot({
    //   apiKey: 'YOUR_API_KEY',
    //   libraries: ['marker'] // Add 'marker' here
    // })
  }

  // This method is called by the google-map component when the map is initialized
  onMapReady(map: google.maps.Map) {
    this.createAdvancedMarkers(map);
  }

  async createAdvancedMarkers(map: google.maps.Map) {
    // Dynamically import the AdvancedMarkerElement and PinElement
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as typeof google.maps.marker;

    this.locations.forEach(location => {
      // Create a default pin or customize it
      const pin = new PinElement({
        background: this.selectedLocationId === location.id ? '#DB4437' : '#4285F4', // Red for selected, blue for others
        borderColor: this.selectedLocationId === location.id ? '#DB4437' : '#4285F4',
        glyphColor: '#FFF',
        scale: this.selectedLocationId === location.id ? 1.5 : 1
      });

      const marker = new AdvancedMarkerElement({
        map: map,
        position: { lat: location.lat, lng: location.lng },
        content: pin.element, // Use the PinElement's DOM element
        title: location.title,
      });

      // Store the marker so we can reference it later (e.g., for click events)
      this.advancedMarkers[location.id] = marker;

      // Add a click listener to the Advanced Marker
      marker.addListener('click', () => {
        this.onMarkerClick(location, marker);
      });
    });
  }

  // Method to update marker appearance when selection changes
  async updateAdvancedMarkers(map: google.maps.Map) {
    const { PinElement } = await google.maps.importLibrary("marker") as typeof google.maps.marker;

    this.locations.forEach(location => {
      const marker = this.advancedMarkers[location.id];
      if (marker) {
        const pin = new PinElement({
          background: this.selectedLocationId === location.id ? '#DB4437' : '#4285F4', // Red for selected, blue for others
          borderColor: this.selectedLocationId === location.id ? '#DB4437' : '#4285F4',
          glyphColor: '#FFF',
          scale: this.selectedLocationId === location.id ? 1.5 : 1
        });
        marker.content = pin.element; // Update the content of the marker
      }
    });
  }

  onMarkerClick(location: Location, marker: google.maps.marker.AdvancedMarkerElement) {
    this.selectedLocationId = location.id;
    this.center = { lat: location.lat, lng: location.lng };
    this.zoom = 14;

    // Update marker appearances to reflect selection
    if (this.googleMap?.googleMap) {
      this.updateAdvancedMarkers(this.googleMap.googleMap);
    }

    // Open info window using the AdvancedMarkerElement's position
    if (this.currentInfoWindow) {
      this.currentInfoWindow.close();
    }

    const infoWindowContent = document.createElement('div');
    infoWindowContent.innerHTML = `
      <h3>${location.title}</h3>
      <p>${location.address1}</p>
      <p>${location.address2}</p>
    `;

    this.currentInfoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
      position: marker.position // Use the AdvancedMarkerElement's position
    });
    this.currentInfoWindow.open(marker.map); // Open relative to the map
  }

  onListClick(location: Location) {
    this.selectedLocationId = location.id;
    this.center = { lat: location.lat, lng: location.lng };
    this.zoom = 12;

    // Update marker appearances to reflect selection
    if (this.googleMap?.googleMap) {
      this.updateAdvancedMarkers(this.googleMap.googleMap);
    }

    // Close any open info window when clicking on the list
    if (this.currentInfoWindow) {
      this.currentInfoWindow.close();
      this.currentInfoWindow = undefined;
    }
  }

  // Remove the old getMarkerIcon as we are now using PinElement
  // getMarkerIcon(locationId: number): google.maps.Icon | google.maps.Symbol | string {
  //   // ... (this method will no longer be used directly for Advanced Markers)
  //   return '';
  // }
}

// Add this import if you haven't already, needed for @ViewChild(GoogleMap)
import { GoogleMap } from '@angular/google-maps';
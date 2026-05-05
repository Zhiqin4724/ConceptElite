import { Component, OnInit, ViewChild, ElementRef, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapInfoWindow, MapMarker } from '@angular/google-maps'; // Import MapInfoWindow and MapMarker for clarity on what's still used
import { ThemeService } from '../../service/theme.service';

// IMPORTANT: Do not share your API key publicly in your code. Use environment variables.
// AIzaSyBpxboqa6ZWBWg8derbe2O77PVogFS657Y

// UPDATED: Location interface to separate address into two lines
interface Location {
  id: number;
  lat: number;
  lng: number;
  title: string;
  address1: string;
  address2: string;
  phone: string;
  image: string;
  scope: 'coiffure' | 'barber';
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

  // Locations data (full set; filtered per theme via `displayedLocations()`).
  private readonly allLocations: Location[] = [
    {
      id: 1,
      title: 'Boul. Lapinière Store',
      address1: '2151 Boul. Lapinière',
      address2: 'Brossard, QC J4W 1M3, Canada',
      phone: '(450) 904-9770',
      image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=400&q=70',
      lat: 45.471983981605185,
      lng: -73.4704416509262,
      scope: 'coiffure',
    },
    {
      id: 2,
      title: 'Rue Saint-Laurent Outlet',
      address1: '825 Rue Saint-Laurent O',
      address2: 'Longueuil, QC J4K 2V1, Canada',
      phone: '(450) 651-6140',
      image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=400&q=70',
      lat: 45.52929694808476,
      lng: -73.51450937605745,
      scope: 'coiffure',
    },
    {
      id: 3,
      title: 'Pointe-Claire Office',
      address1: '6361 Route Transcanadienne',
      address2: 'Pointe-Claire, QC H9R 3S3, Canada',
      phone: '(514) 694-2746',
      image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=400&q=70',
      lat: 45.46710470536975,
      lng: -73.82831102460632,
      scope: 'coiffure',
    },
    {
      id: 4,
      title: 'Sainte-Marthe-sur-le-Lac Hub',
      address1: 'Sainte-Marthe-sur-le-Lac',
      address2: 'QC J0N 1P0, Canada',
      phone: '(450) 472-7055',
      image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=400&q=70',
      lat: 45.52894694822505,
      lng: -73.93585222209015,
      scope: 'coiffure',
    },
    {
      id: 5,
      title: 'Bd Newman Center',
      address1: '7077 Bd Newman',
      address2: 'LaSalle, QC H8N 1X1, Canada',
      phone: '(514) 366-0966',
      image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=400&q=70',
      lat: 45.448788259765074,
      lng: -73.6164947198517,
      scope: 'coiffure',
    },
    {
      id: 6,
      title: 'Av. Dorval Main Shop',
      address1: '360 Av. Dorval',
      address2: 'Dorval, QC H9S 5V8, Canada',
      phone: '(514) 631-0333',
      image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=400&q=70',
      lat: 45.44540354554402,
      lng: -73.74325416441805,
      scope: 'coiffure',
    },
    {
      id: 7,
      title: 'Blvd. de la Concorde Branch',
      address1: '2945 Blvd. de la Concorde E',
      address2: 'Laval, QC H7E 2B5, Canada',
      phone: '(450) 936-8877',
      image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=400&q=70',
      lat: 45.59196596941578,
      lng: -73.66985327790985,
      scope: 'coiffure',
    },
    // Barber salon — same physical address as Brossard, dedicated phone line.
    {
      id: 8,
      title: 'Concept Elite Le Barbier',
      address1: '2151 Boul. Lapinière',
      address2: 'Brossard, QC J4W 1M3, Canada',
      phone: '(450) 904-9772',
      image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=400&q=70',
      lat: 45.471983981605185,
      lng: -73.4704416509262,
      scope: 'barber',
    },
  ];

  // Visible locations:
  //  - coiffure mode: all coiffure salons, with the barber appended at the end
  //  - barber mode: all salons, with the barber pinned at the top
  get locations(): Location[] {
    const barber = this.allLocations.filter((l) => l.scope === 'barber');
    const coiffure = this.allLocations.filter((l) => l.scope === 'coiffure');
    if (this.theme.mode() === 'barber') {
      return [...barber, ...coiffure];
    }
    return [...coiffure, ...barber];
  }

  selectedLocationId: number | null = null;
  advancedMarkers: { [key: number]: google.maps.marker.AdvancedMarkerElement } = {};
  currentInfoWindow: google.maps.InfoWindow | undefined; // To manage a single info window

  private readonly theme = inject(ThemeService);
  readonly themeMode = this.theme.mode;

  constructor() {
    // Re-render markers and re-select when the theme changes (e.g. user toggles
    // between coiffure and barber while the map is mounted).
    effect(() => {
      this.theme.mode();
      const map = this.googleMap?.googleMap;
      if (map) {
        this.refreshForTheme(map);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    // Marker library is loaded on demand inside createAdvancedMarkers().
  }

  // This method is called by the google-map component when the map is initialized
  onMapReady(map: google.maps.Map) {
    this.refreshForTheme(map);
  }

  private async refreshForTheme(map: google.maps.Map): Promise<void> {
    // Tear down any existing markers and info window before rebuilding.
    Object.values(this.advancedMarkers).forEach((m) => (m.map = null));
    this.advancedMarkers = {};
    if (this.currentInfoWindow) {
      this.currentInfoWindow.close();
      this.currentInfoWindow = undefined;
    }

    const isBarber = this.theme.mode() === 'barber';
    // In barber mode, auto-select the single barber location so the pin
    // and info card pop up immediately. In coiffure mode, leave nothing
    // pre-selected so the user gets the full overview.
    this.selectedLocationId = isBarber
      ? this.locations[0]?.id ?? null
      : null;

    await this.createAdvancedMarkers(map);

    if (isBarber && this.selectedLocationId !== null) {
      const selected = this.locations[0];
      this.center = { lat: selected.lat, lng: selected.lng };
      this.zoom = 15;
      const marker = this.advancedMarkers[selected.id];
      if (marker) {
        this.openInfoWindow(selected, marker);
      }
    } else {
      this.center = { lat: 45.5217, lng: -73.6873 };
      this.zoom = 11;
    }
  }

  async createAdvancedMarkers(map: google.maps.Map) {
    // Dynamically import the AdvancedMarkerElement and PinElement
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as typeof google.maps.marker;

    this.locations.forEach(location => {
      const pin = new PinElement(this.pinStyleFor(location));

      const marker = new AdvancedMarkerElement({
        map: map,
        position: { lat: location.lat, lng: location.lng },
        content: pin.element,
        title: location.title,
        zIndex: location.scope === 'barber' ? 1000 : 1,
      });

      this.advancedMarkers[location.id] = marker;

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
        const pin = new PinElement(this.pinStyleFor(location));
        marker.content = pin.element;
      }
    });
  }

  /**
   * Visual style per pin:
   *  - Selected: large red pin
   *  - Barber salon (in barber mode): gold pin so it stands out from blue coiffure pins
   *  - Default coiffure: blue pin
   */
  private pinStyleFor(location: Location): google.maps.marker.PinElementOptions {
    const isSelected = this.selectedLocationId === location.id;
    const isBarberMode = this.theme.mode() === 'barber';
    const isBarberLoc = location.scope === 'barber';

    // Selected pin: red on coiffure side, bright gold on barber side
    if (isSelected) {
      if (isBarberMode) {
        return {
          background: '#E5B654',
          borderColor: '#1A1A1A',
          glyphColor: '#1A1A1A',
          scale: 1.5,
        };
      }
      return {
        background: '#B71C1C',
        borderColor: '#1A1A1A',
        glyphColor: '#FFF',
        scale: 1.5,
      };
    }

    // Barber salon pin
    if (isBarberLoc) {
      if (isBarberMode) {
        // Hero pin on barber side: heavy gold
        return {
          background: '#D4A64A',
          borderColor: '#1A1A1A',
          glyphColor: '#1A1A1A',
          scale: 1.3,
        };
      }
      // On coiffure side: subdued gold accent on red theme
      return {
        background: '#FFF',
        borderColor: '#B8860B',
        glyphColor: '#7A5A1F',
        scale: 1,
      };
    }

    // Default coiffure pin: red on coiffure side, black on barber side
    if (isBarberMode) {
      return {
        background: '#1A1A1A',
        borderColor: '#D4A64A',
        glyphColor: '#FFF',
        scale: 1,
      };
    }
    return {
      background: '#B71C1C',
      borderColor: '#7A0E0E',
      glyphColor: '#FFF',
      scale: 1,
    };
  }

  onMarkerClick(location: Location, marker: google.maps.marker.AdvancedMarkerElement) {
    this.selectedLocationId = location.id;
    this.center = { lat: location.lat, lng: location.lng };
    this.zoom = 14;

    // Update marker appearances to reflect selection
    if (this.googleMap?.googleMap) {
      this.updateAdvancedMarkers(this.googleMap.googleMap);
    }

    this.openInfoWindow(location, marker);
  }

  private openInfoWindow(
    location: Location,
    marker: google.maps.marker.AdvancedMarkerElement,
  ) {
    if (this.currentInfoWindow) {
      this.currentInfoWindow.close();
    }

    const infoWindowContent = document.createElement('div');
    infoWindowContent.className = 'ce-map-info';
    const safeTitle = this.escapeHtml(location.title);
    const safeAddr1 = this.escapeHtml(location.address1);
    const safeAddr2 = this.escapeHtml(location.address2);
    const safePhone = this.escapeHtml(location.phone);
    const safeImage = encodeURI(location.image);
    const telHref = location.phone.replace(/[^+\d]/g, '');
    const scopeLabel = location.scope === 'barber' ? 'Salon barbier' : 'Salon de coiffure';
    const scopeColor = location.scope === 'barber' ? '#7A5A1F' : '#B71C1C';
    const scopeBg = location.scope === 'barber' ? '#FFF6E0' : '#FDECEA';
    const phoneColor = location.scope === 'barber' ? '#7A5A1F' : '#B71C1C';
    infoWindowContent.innerHTML = `
      <div style="width:240px;font-family:inherit;">
        <img src="${safeImage}" alt="${safeTitle}"
          style="width:100%;height:120px;object-fit:cover;border-radius:6px;display:block;margin-bottom:8px;" />
        <h3 style="margin:0 0 6px 0;font-size:15px;font-weight:600;color:#1a1a1a;">${safeTitle}</h3>
        <p style="margin:0;font-size:13px;color:#333;line-height:1.4;">${safeAddr1}</p>
        <p style="margin:0 0 8px 0;font-size:13px;color:#333;line-height:1.4;">${safeAddr2}</p>
        <a href="tel:${telHref}" style="display:inline-flex;align-items:center;gap:4px;font-size:13px;color:${phoneColor};text-decoration:none;font-weight:600;">
          ☎ ${safePhone}
        </a>
        <div style="margin-top:8px;display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;color:${scopeColor};background:${scopeBg};">
          ${scopeLabel}
        </div>
      </div>
    `;

    this.currentInfoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
      position: marker.position,
    });
    this.currentInfoWindow.open(marker.map);
  }

  onListClick(location: Location) {
    this.selectedLocationId = location.id;
    this.center = { lat: location.lat, lng: location.lng };
    this.zoom = 14;

    // Update marker appearances to reflect selection
    if (this.googleMap?.googleMap) {
      this.updateAdvancedMarkers(this.googleMap.googleMap);
    }

    // Open the info window on the matching marker.
    const marker = this.advancedMarkers[location.id];
    if (marker) {
      this.openInfoWindow(location, marker);
    }
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  telHref(phone: string): string {
    return phone.replace(/[^+\d]/g, '');
  }

}

// Add this import if you haven't already, needed for @ViewChild(GoogleMap)
import { GoogleMap } from '@angular/google-maps';
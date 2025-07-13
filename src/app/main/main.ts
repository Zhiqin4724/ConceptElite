import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for basic directives like *ngIf, *ngFor
import AOS from 'aos'; // Import the AOS library

@Component({
  selector: 'app-main',
  standalone: true, // Mark as standalone if you're using standalone components
  imports: [CommonModule], // Include CommonModule for standalone components
  templateUrl: './main.html', // Link to your HTML template
  styleUrl: './main.css' // Link to your CSS styles
})
export class Main implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Initialize AOS when the component loads
    // You can also place this in your top-level AppComponent's ngOnInit if you want
    // AOS initialized once for the entire application.
    AOS.init({
      // Optional: Global settings for all AOS animations on this page
      offset: 120,          // offset (in px) from the original trigger point
      delay: 0,             // values from 0 to 3000, with step 50ms
      duration: 1000,       // values from 0 to 3000, with step 50ms
      easing: 'ease',       // default easing for AOS animations
      once: false,          // whether animation should happen only once - while scrolling down
      mirror: false,        // whether elements should animate out while scrolling past them
      anchorPlacement: 'top-bottom', // defines which position of the element should trigger the animation
    });
  }
}
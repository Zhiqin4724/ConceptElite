import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopToolBar } from './top-tool-bar/top-tool-bar';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopToolBar, Footer],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'concept-elite';
}
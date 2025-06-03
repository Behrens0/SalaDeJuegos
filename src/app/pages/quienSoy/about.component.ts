import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit{

  ngAfterViewInit(): void {
  console.log("about");
  }

}

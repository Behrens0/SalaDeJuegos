import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from './pages/login/login.component'; 
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './pages/registro/registro.component';
import { HomeComponent } from './pages/home/home.component';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    LoginComponent,
    RegistroComponent,
    HomeComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'rutas';
  isLoggedIn: boolean = false;

  constructor(
    public router: Router,
    private supabase: SupabaseService
  ) {}

  async ngOnInit() {
    try {
      this.supabase.isLoggedIn$.subscribe((status) => {
        this.isLoggedIn = status;
      });
  
      const { data, error } = await this.supabase.getUser();
      if (data.user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    } catch (err) {
      console.error('Error al verificar el usuario:', err);
      this.isLoggedIn = false;
    }
  }

  setLoginStatus(isLoggedIn: boolean) {
    this.isLoggedIn = isLoggedIn;
  }

  async logout() {
    try {
      const { error } = await this.supabase.signOut();
      if (error) {
        console.error('Error al cerrar sesión:', error.message);
      }
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
    } catch (err) {
      console.error('Error inesperado al cerrar sesión:', err);
    }
  }

  updateLoginStatus(isLoggedIn: boolean) {
    this.isLoggedIn = isLoggedIn;
  }
}
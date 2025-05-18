import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() loginStatusChange = new EventEmitter<boolean>();
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router,
    private supabase: SupabaseService
  ) {}

  fillFields() {
    this.username = 'prop@prop.com';
    this.password = '123456';
  }

  async onSubmit() {
  try {
    const { data, error } = await this.supabase.signIn({
      email: this.username,
      password: this.password
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        this.errorMessage = 'Correo o contraseña incorrecta.';
      } else if (error.message.includes('email')) {
        this.errorMessage = 'Formato de correo inválido.';
      } else {
        this.errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
      }
      this.loginStatusChange.emit(false);
    } else {
      this.loginStatusChange.emit(true);
      this.router.navigate(['/home']);
    }
  } catch (err) {
    console.error('Error en login:', err);
    this.errorMessage = 'Error inesperado al iniciar sesión.';
    this.loginStatusChange.emit(false);
  }
}
}
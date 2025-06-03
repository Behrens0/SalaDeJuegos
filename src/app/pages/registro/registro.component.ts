import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  @Output() loginStatusChange = new EventEmitter<boolean>();

  public nombre: string = '';
  public username: string = '';
  public correo: string = '';
  public password: string = '';
  public errorMessage: string = '';

  constructor(private router: Router, public supabase: SupabaseService) {}

  async onSubmit() {
    if (!this.nombre || !this.username || !this.correo || !this.password) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    if (!this.validateEmail(this.correo)) {
      this.errorMessage = 'Por favor, ingresa un correo válido.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    try {
      const { data, error } = await this.supabase.signUp(this.correo, this.password, {
        nombre: this.nombre,
        username: this.username
      });
      


      if (error || !data.user) {
        this.errorMessage = error?.message || 'Error al registrar el usuario.';
        this.loginStatusChange.emit(false);
        return;
      }

      console.log('Usuario registrado exitosamente:', data.user);
      this.loginStatusChange.emit(true);
      this.router.navigate(['/home']);
    } catch (err) {
      console.error('Error inesperado:', err);
      this.errorMessage = 'Error inesperado al registrar el usuario.';
      this.loginStatusChange.emit(false);
    }
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
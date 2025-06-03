import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service'; // Asegurate de tener este servicio

@Component({
  selector: 'app-encuesta',
  standalone: false,
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})

export class EncuestaComponent {
  nombre: string = '';
  edad: number | null = null;
  telefono: string = '';
  pregunta1: string = '';
  juegoSeleccionado: string[] = [];
  pregunta3: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  seleccionDeJuego(juego: string) {
    const index = this.juegoSeleccionado.indexOf(juego);
    if (index > -1) {
      this.juegoSeleccionado.splice(index, 1);
    } else {
      this.juegoSeleccionado.push(juego);
    }
  }

  validarTelefono(): boolean {
    const telefonoRegex = /^\d{10}$/;
    return telefonoRegex.test(this.telefono);
  }


  validarNombre(): boolean {
    const nombreRegex = /^[a-zA-Z\s]+$/;
    return nombreRegex.test(this.nombre);
  }

  async onSubmit() {
    if (!this.nombre || !this.edad || !this.telefono || !this.pregunta1 || !this.pregunta3) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    if (!this.validarNombre()) {
      this.errorMessage = 'El nombre no puede contener números o caracteres especiales.';
      return;
    }

    if (this.edad < 18 || this.edad > 99) {
      this.errorMessage = 'La edad debe ser entre 18 y 99 años.';
      return;
    }

    if (!this.validarTelefono()) {
      this.errorMessage = 'El número de teléfono debe tener exactamente 10 dígitos.';
      return;
    }

    if (this.juegoSeleccionado.length === 0) {
      this.errorMessage = 'Debes seleccionar al menos un juego.';
      return;
    }

    this.errorMessage = '';

    const { data: userData } = await this.supabaseService.getUser();
    const correoUsuario = userData?.user?.email || 'Anónimo';

    const encuestaData = {
      nombre: this.nombre,
      edad: this.edad,
      telefono: this.telefono,
      pregunta1: this.pregunta1,
      juegosSeleccionados: this.juegoSeleccionado,
      pregunta3: this.pregunta3,
      email: correoUsuario,
      fechaEncuesta: new Date().toISOString(),
    };

    const { error } = await this.supabaseService.guardarEncuesta(encuestaData);


    if (error) {
      console.error('Error al guardar la encuesta en Supabase:', error);
      this.errorMessage = 'Ocurrió un error al guardar la encuesta.';
    } else {
      console.log('Encuesta enviada correctamente', encuestaData);
      this.router.navigate(['/home']);
    }
  }
}

import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent {
  letrasSeleccionadas: string[] = [];
  palabraSecreta: string | null = null;
  intentosRestantes: number = 6;
  juegoTerminado: boolean = false;
  palabraCargada: boolean = false;
  mensajeResultado: string = '';
  puntos: number = 0;

  mejoresJugadores: { nombre: string; puntos: number }[] = [];

  constructor(private http: HttpClient, private supabaseService: SupabaseService) {
    this.getRandomWord();
    this.obtenerRanking();
  }

  async obtenerCorreoUsuario(): Promise<string | null> {
    const { data: { user }, error } = await this.supabaseService.getUser();
    if (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
    return user?.email || null;
  }

  async guardarResultado() {
    const correoUsuario = await this.obtenerCorreoUsuario();
  
    if (correoUsuario) {
      const { error } = await this.supabaseService.guardarResultadoRanking(correoUsuario, this.puntos);
      if (error) {
        console.error('Error al guardar el resultado: ', error);
        this.mensajeResultado = 'Error al guardar el resultado. Intenta nuevamente.';
      } else {
        console.log('Resultado guardado');
        this.obtenerRanking();
      }
    } else {
      console.error('No hay usuario autenticado');
      this.mensajeResultado = 'No se pudo obtener el correo del usuario. Asegúrate de estar logueado.';
    }
  }
  
  async obtenerRanking() {
    const { data, error } = await this.supabaseService.obtenerTopRanking();
  
    if (error) {
      console.error('Error al obtener ranking: ', error);
      this.mensajeResultado = 'Error al obtener el ranking. Intenta nuevamente.';
    } else if (data) {
      this.mejoresJugadores = data.map(d => ({ nombre: d.correo, puntos: d.score }));
    }
  }

  finalizarJuego() {
    if (this.juegoTerminado) {
      this.guardarResultado();
    }
  }

  getRandomWord() {
    this.palabraCargada = false;
    this.http.get('https://random-word-api.herokuapp.com/word?lang=es').subscribe(
      (response: any) => {
        if (Array.isArray(response) && response.length > 0) {
          const palabra = response[0].toUpperCase();
  
          if (this.contieneLetrasConAcento(palabra) || this.contieneDiacriticos(palabra) || this.contieneEspacios(palabra)) {
            this.getRandomWord(); // si no es válida, volvemos a pedir otra
          } else {
            this.palabraSecreta = palabra;
            this.resetGame();
            console.log('Palabra secreta asignada:', this.palabraSecreta);
          }
        }
      },
      error => {
        console.error('Error al obtener la palabra secreta', error);
      }
    );
  }

  contieneLetrasConAcento(palabra: string): boolean {
    const letrasConAcento = /[áéíóúÁÉÍÓÚ]/;
    return letrasConAcento.test(palabra);
  }

  contieneDiacriticos(palabra: string): boolean {
    const letrasConDiacriticos = /[üñ]/;
    return letrasConDiacriticos.test(palabra);
  }

  contieneEspacios(palabra: string): boolean {
    return palabra.includes(' ');
  }

  resetGame() {
    this.letrasSeleccionadas = [];
    this.intentosRestantes = 6;
    this.juegoTerminado = false;
    this.palabraCargada = true;
    this.mensajeResultado = '';
  }

  seleccionarLetra(letra: string) {
    if (!this.letrasSeleccionadas.includes(letra) && !this.juegoTerminado && this.palabraCargada) {
      this.letrasSeleccionadas.push(letra);

      if (this.palabraSecreta && !this.palabraSecreta.includes(letra)) {
        this.intentosRestantes--;

        if (this.intentosRestantes === 0) {
          this.juegoTerminado = true;
          this.mensajeResultado = 'PERDISTE. La palabra era: ' + this.palabraSecreta;
          this.puntos = 0;
        }
      }

      if (this.haGanado()) {
        this.juegoTerminado = true;
        this.mensajeResultado = '¡EXCELENTE! Sumaste 1 punto';
        this.puntos = 1;
      }

      if (this.juegoTerminado) {
        this.finalizarJuego();
      }
    }
  }

  obtenerPalabraConGuiones() {
    if (!this.palabraSecreta) {
      return '';
    }
    return this.palabraSecreta
      .split('')
      .map(letter => (this.letrasSeleccionadas.includes(letter) ? letter : '_'))
      .join(' ');
  }

  haGanado() {
    return this.palabraSecreta?.split('').every(letter => this.letrasSeleccionadas.includes(letter));
  }
}

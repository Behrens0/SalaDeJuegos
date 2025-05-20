import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-mayor-o-menor',
  standalone: true,
  templateUrl: './mayor-o-menor.component.html',
  styleUrls: ['./mayor-o-menor.component.css'],
  imports: [CommonModule, NgFor]
})
export class MayorOMenorComponent {
  cartaActual!: any;
  siguienteCarta!: any;
  puntaje: number = 0;
  mensaje: string = '';
  mejoresJugadores: { nombre: string, puntos: number }[] = [];

  cartas: any[] = [
    { valor: 1, palo: 'corazones', imagen: 'https://lyotopwjahfarqruzrts.supabase.co/storage/v1/object/public/tomas//1basto.jpg'  },
    { valor: 2, palo: 'tréboles', imagen: 'https://lyotopwjahfarqruzrts.supabase.co/storage/v1/object/public/tomas//2oro.jpg'  },
    { valor: 3, palo: 'diamantes', imagen: 'https://lyotopwjahfarqruzrts.supabase.co/storage/v1/object/public/tomas//3espada.jpg'  },
    { valor: 4, palo: 'picas' , imagen: 'https://lyotopwjahfarqruzrts.supabase.co/storage/v1/object/public/tomas//4copa.jpg' },
    { valor: 5, palo: 'corazones', imagen: 'https://lyotopwjahfarqruzrts.supabase.co/storage/v1/object/public/tomas//5basto.jpg'  },
    { valor: 6, palo: 'tréboles' , imagen: 'https://lyotopwjahfarqruzrts.supabase.co/storage/v1/object/public/tomas//6espada.jpg' },
    { valor: 7, palo: 'diamantes', imagen: 'https://lyotopwjahfarqruzrts.supabase.co/storage/v1/object/public/tomas//7oro.jpg'  },
    { valor: 8, palo: 'picas', imagen: 'https://lyotopwjahfarqruzrts.supabase.co/storage/v1/object/public/tomas//8copa.jpg'  },
    { valor: 9, palo: 'corazones' , imagen: 'https://lyotopwjahfarqruzrts.supabase.co/storage/v1/object/public/tomas//9espada.jpg' },
    { valor: 10, palo: 'tréboles' , imagen: 'https://lyotopwjahfarqruzrts.supabase.co/storage/v1/object/public/tomas//10basto.jpg' },
    { valor: 11, palo: 'diamantes' , imagen: 'https://lyotopwjahfarqruzrts.supabase.co/storage/v1/object/public/tomas//11copa.jpg' },
    { valor: 12, palo: 'picas', imagen: 'https://lyotopwjahfarqruzrts.supabase.co/storage/v1/object/public/tomas//12espada.jpg'  }
  ];

  constructor(private supabaseService: SupabaseService) {
    this.iniciarJuego();
    this.obtenerRanking();
  }

  iniciarJuego() {
    this.cartaActual = this.generarCarta();
    this.siguienteCarta = this.generarCarta();
  }

  generarCarta(): any {
    let carta;
    do {
      carta = this.cartas[Math.floor(Math.random() * this.cartas.length)];
    } while (carta === this.cartaActual);
    return carta;
  }

  verificarRespuesta(respuesta: 'mayor' | 'menor') {
    const esCorrecto = (
      (respuesta === 'mayor' && this.siguienteCarta.valor > this.cartaActual.valor) ||
      (respuesta === 'menor' && this.siguienteCarta.valor < this.cartaActual.valor)
    );

    if (esCorrecto) {
      this.mensaje = '¡CORRECTO! SEGUÍ SUMANDO PUNTOS';
      this.puntaje = 1;
    } else {
      this.puntaje = 0
      this.mensaje = `¡NOO! La carta era: ${this.siguienteCarta.valor} de ${this.siguienteCarta.palo}`;
      
    }
    this.guardarResultado();

    this.cartaActual = this.siguienteCarta;
    this.siguienteCarta = this.generarCarta();
  }

  async obtenerCorreoUsuario(): Promise<string | null> {
    const { data: { user }, error } = await this.supabaseService.getUser();
    return user?.email ?? null;
  }

  async guardarResultado() {
    const correoUsuario = await this.obtenerCorreoUsuario();

    if (correoUsuario) {
      const { error } = await this.supabaseService.guardarResultadoRanking(correoUsuario, this.puntaje);

      if (error) {
        console.error('Error al guardar el resultado:', error);
        this.mensaje = 'Error al guardar el resultado. Intenta nuevamente.';
      } else {
        console.log('Resultado guardado');
        this.obtenerRanking();
      }
    } else {
      console.error('No hay usuario autenticado');
      this.mensaje = 'No se pudo obtener el correo del usuario. Asegúrate de estar logueado.';
    }
  }

  async obtenerRanking() {
    const { data, error } = await this.supabaseService.obtenerTopRanking(5);

    if (error) {
      console.error('Error al obtener ranking:', error);
      this.mensaje = 'Error al obtener el ranking. Intenta nuevamente.';
    } else {
      this.mejoresJugadores = data.map((jugador: any) => ({
        nombre: jugador.correo,
        puntos: jugador.score,
      }));
    }
  }
}

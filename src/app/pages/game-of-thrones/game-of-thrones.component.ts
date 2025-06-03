import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
@Component({
  selector: 'app-game-of-thrones',
  standalone: false,
  templateUrl: './game-of-thrones.component.html',
  styleUrls: ['./game-of-thrones.component.css']
})
export class GameOfThronesComponent implements OnInit {
  personajes: any[] = [];
  personajeActual: any = null;
  opciones: string[] = [];
  puntaje: number = 0;
  mensaje: string = '';
  mejoresJugadores: { nombre: string, puntaje: number }[] = [];
  constructor(private supabaseService: SupabaseService) {}
  ngOnInit() {
    this.cargarPersonajes();
    this.obtenerRanking();
  }

  async cargarPersonajes() {
    try {
      const response = await fetch('https://thronesapi.com/api/v2/Characters');
      this.personajes = await response.json();
      this.nuevaPregunta();
    } catch (error) {
      console.error('Error al cargar personajes:', error);
      this.mensaje = 'No se pudo cargar los personajes';
    }
  }

  nuevaPregunta() {
    if (this.personajes.length < 4) return;

    const personajeCorrecto = this.personajes[Math.floor(Math.random() * this.personajes.length)];
    this.personajeActual = personajeCorrecto;

    const opcionesSet = new Set<string>();
    opcionesSet.add(personajeCorrecto.fullName);

    while (opcionesSet.size < 4) {
      const otro = this.personajes[Math.floor(Math.random() * this.personajes.length)];
      opcionesSet.add(otro.fullName);
    }

    this.opciones = this.mezclar(Array.from(opcionesSet));
  }

  

  mezclar(array: string[]) {
    return array.sort(() => Math.random() - 0.5);
  }
async guardarPuntaje() {
  const { data: userData, error: userError } = await this.supabaseService.getUser();
  const correoUsuario = userData?.user?.email || 'Anónimo';

  const { error } = await this.supabaseService.insertPuntajeThrones(this.puntaje);

  if (error) {
    console.error('Error al guardar puntaje:', error.message);
    this.mensaje = 'Error al guardar el puntaje. Intenta nuevamente.';
  } else {
    this.obtenerRanking();
  }
}

async obtenerRanking() {
  const { data, error } = await this.supabaseService.getTopThronesRanking(5);

  if (error) {
    console.error('Error al obtener ranking:', error.message);
    this.mensaje = 'Error al obtener el ranking';
  } else {
    this.mejoresJugadores = data.map((jugador: any) => ({
      nombre: jugador.correo,
      puntaje: jugador.puntaje
    }));
  }
}
async seleccionar(respuesta: string) {
  if (respuesta === this.personajeActual.fullName) {
    this.puntaje++;
    this.mensaje = '¡Correcto! Puntaje: ' + this.puntaje;
  } else {
    this.mensaje = `Incorrecto. Era: ${this.personajeActual.fullName}`;
    await this.guardarPuntaje();
    this.puntaje = 0;
  }

  setTimeout(() => {
    this.mensaje = '';
    this.nuevaPregunta();
  }, 1000);
}
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { PreguntasService } from '../../services/preguntas.service';

@Component({
  selector: 'app-preguntados',
  standalone: false,
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.css']
})
export class PreguntadosComponent implements OnInit {
  preguntas: any[] = [];
  preguntaActual: any = null;
  respuestas: string[] = [];
  puntaje: number = 0;
  mensaje: string = '';
  imagenCategoria: string = '';
  nombreCategoria: string = '';
  preguntasRespondidas: string[] = [];
  mejoresJugadores: { nombre: string, puntaje: number }[] = [];

  apiKey: string = "$2b$12$OZ1B9NpVbw6wD1FV9xDKA.JMbZxZUvSLQtdHTxn/Vompf8IkMrLU2";

  constructor(private supabaseService: SupabaseService,  private preguntasService: PreguntasService) {}

  ngOnInit() {
    this.cargarPreguntas();
    this.obtenerRanking();
  }

  async cargarPreguntas() {
  try {
    const categorias = ['sports%26leisure', 'arts%26literature', 'geography'];
    this.preguntas = this.mezclarPreguntas(await this.preguntasService.obtenerPreguntas(categorias));
    this.cambiarPregunta();
  } catch (err: unknown) {
    this.mensaje = `Error al cargar preguntas: ${(err instanceof Error) ? err.message : 'Error desconocido'}`;
  }
}


  mezclarPreguntas(preguntas: any[]): any[] {
    return preguntas.sort(() => Math.random() - 0.5);
  }

  cambiarPregunta() {
    const preguntasSinResponder = this.preguntas.filter(p => !this.preguntasRespondidas.includes(p.id));

    if (preguntasSinResponder.length > 0) {
      const randomIndex = Math.floor(Math.random() * preguntasSinResponder.length);
      const preguntaElegida = preguntasSinResponder[randomIndex];

      this.preguntasRespondidas.push(preguntaElegida.id);
      this.preguntaActual = preguntaElegida;

      this.respuestas = [
        this.preguntaActual.correctAnswers,
        ...this.preguntaActual.incorrectAnswers
      ];
      this.respuestas = this.mezclarRespuestas(this.respuestas);

      const categoriaInfo = this.obtenerNombreCategoriaLegible(this.preguntaActual.category);
      this.nombreCategoria = categoriaInfo.nombre;
      this.imagenCategoria = categoriaInfo.imagen;
    } else {
      this.mensaje = "¡No hay más preguntas disponibles!";
    }
  }

  mezclarRespuestas(respuestas: string[]): string[] {
    return respuestas.sort(() => Math.random() - 0.5);
  }

  obtenerNombreCategoriaLegible(categoria: string): { nombre: string, imagen: string } {
    const categorias: { [key: string]: { nombre: string, imagen: string } } = {
      "sports&leisure": {
        nombre: "Deportes y Ocio",
        imagen: 'https://lyotopwjahfarqruzrts.supabase.co/storage/v1/object/public/tomas//deportes.jpg'
      },
      "arts&literature": {
        nombre: "Artes y Literatura",
        imagen: 'https://lyotopwjahfarqruzrts.supabase.co/storage/v1/object/public/tomas//artylit.jpg'
      },
      "geography": {
        nombre: "Geografía",
        imagen: 'https://lyotopwjahfarqruzrts.supabase.co/storage/v1/object/public/tomas//geo.jpg'
      },
    };

    return categorias[categoria] || { nombre: categoria, imagen: 'URL_IMAGEN_DEFAULT' };
  }

  async verificarRespuesta(respuestaSeleccionada: string) {
  console.log('Respuesta seleccionada:', respuestaSeleccionada);
  console.log('Respuesta correcta:', this.preguntaActual.correctAnswers);

  if (respuestaSeleccionada === this.preguntaActual.correctAnswers) {
    this.puntaje++;
    this.mensaje = '¡Correcto! Tu puntaje es: ' + this.puntaje;
    console.log('Respuesta correcta. Puntaje actualizado:', this.puntaje);
    this.cambiarPregunta();
  } else {
    console.log('Respuesta incorrecta. Puntaje antes de guardar:', this.puntaje);
    this.mensaje = 'Incorrecto. La respuesta correcta era: ' + this.preguntaActual.correctAnswers;
    await this.guardarPuntaje();
    this.puntaje = 0; 
    this.cambiarPregunta(); 
  }
}



 async guardarPuntaje() {
  console.log('Iniciando guardado de puntaje...');
  const { data: userData, error: userError } = await this.supabaseService.getUser();
  const correoUsuario = userData?.user?.email || 'Anónimo';

  console.log('Usuario:', correoUsuario);
  console.log('Puntaje a guardar:', this.puntaje);

  const { error } = await this.supabaseService.insertPuntajePreguntados({
    correo: correoUsuario,
    puntaje: this.puntaje,
    fecha: new Date().toISOString(),
  });

  if (error) {
    console.error('Error al guardar el puntaje:', error.message);
    this.mensaje = 'Error al guardar el puntaje. Intenta nuevamente.';
  } else {
    console.log('Puntaje guardado correctamente');
    this.obtenerRanking();
  }
}


  async obtenerRanking() {
    const { data, error } = await this.supabaseService.getTopPreguntadosRanking(5);

    if (error) {
      console.error('Error al obtener ranking:', error.message);
      this.mensaje = 'Error al obtener el ranking. Intenta nuevamente.';
    } else {
      this.mejoresJugadores = data.map((jugador: any) => ({
        nombre: jugador.correo,
        puntaje: jugador.puntaje
      }));
    }
  }
}

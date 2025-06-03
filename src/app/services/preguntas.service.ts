import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {
  private apiKey: string = '$2b$12$OZ1B9NpVbw6wD1FV9xDKA.JMbZxZUvSLQtdHTxn/Vompf8IkMrLU2';

  constructor() {}

  async obtenerPreguntas(categorias: string[]): Promise<any[]> {
    const promesas = categorias.map(cat =>
      fetch(`https://api.quiz-contest.xyz/questions?limit=10&page=1&category=${cat}`, {
        headers: { 'Authorization': this.apiKey }
      })
    );

    const respuestas = await Promise.all(promesas);
    if (respuestas.some(res => !res.ok)) {
      throw new Error('Error al cargar preguntas de una o más categorías');
    }

    const datos = await Promise.all(respuestas.map(r => r.json()));
    return datos.flatMap(d => d.questions);
  }
}

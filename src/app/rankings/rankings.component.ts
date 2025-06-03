import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service'; // Asegurate que el path sea correcto

@Component({
  selector: 'app-ranking-general',
  templateUrl: './rankings.component.html',
  standalone: false,
  styleUrls: ['./rankings.component.scss']
})
export class RankingsComponent implements OnInit {
  rankingsPorJuego: any[] = [];
  rankingGeneral: any[] = [];

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const tablas = [
      { tabla: 'ranking', campo: 'score' },
      { tabla: 'ranking_mayor_menor', campo: 'score' },
      { tabla: 'ranking_preguntados', campo: 'puntaje' },
      { tabla: 'ranking_thrones', campo: 'puntaje' },
    ];

    const resultadosTotales: any[] = [];

    for (const { tabla, campo } of tablas) {
      const campos = `correo, ${campo}, fecha`;
      const { data, error } = await this.supabaseService['supabase']
        .from(tabla)
        .select(campos);

      if (error) {
        console.error(`Error en ${tabla}:`, error);
        continue;
      }

      const mejoresPorCorreo: Record<string, any> = {};
      for (const item of data as any[]) {
        const correo = item.correo;
        const puntos = parseInt(item[campo] ?? '0', 10);
        const fecha = item.fecha ?? '-';

        if (!mejoresPorCorreo[correo] || puntos > mejoresPorCorreo[correo].puntos) {
          mejoresPorCorreo[correo] = { correo, puntos, fecha };
        }
      }

      const top5 = Object.values(mejoresPorCorreo)
        .sort((a: any, b: any) => b.puntos - a.puntos)
        .slice(0, 5);

      const nombreJuego = tabla === 'ranking'
        ? 'Ahorcado'
        : tabla === 'ranking_mayor_menor'
        ? 'Mayor/Menor'
        : tabla === 'ranking_preguntados'
        ? 'Preguntados'
        : 'Thrones';

      this.rankingsPorJuego.push({ titulo: nombreJuego, datos: top5 });
      resultadosTotales.push(...Object.values(mejoresPorCorreo));
    }

    const rankingGlobalMap: Record<string, { correo: string; puntos: number }> = {};
    for (const item of resultadosTotales) {
      const { correo, puntos } = item;
      if (!rankingGlobalMap[correo]) {
        rankingGlobalMap[correo] = { correo, puntos: 0 };
      }
      rankingGlobalMap[correo].puntos += puntos;
    }

    this.rankingGeneral = Object.values(rankingGlobalMap)
      .sort((a: any, b: any) => b.puntos - a.puntos)
      .slice(0, 5);
  }
}




import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'registro',
    loadChildren: () =>
      import('./pages/registro/registro.module').then(m => m.RegistroModule)
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./pages/quienSoy/about.module').then(m => m.AboutModule)
  },
  {
    path: 'ahorcado',
    loadChildren: () =>
      import('./pages/ahorcado/ahorcado.module').then(m => m.AhorcadoModule)
  },
  {
    path: 'mayor-menor',
    loadChildren: () =>
      import('./pages/mayor-o-menor/mayor-o-menor.module').then(m => m.MayorOMenorModule)
  },
  {
    path: 'preguntados',
    loadChildren: () =>
      import('./pages/preguntados/preguntados.module').then(m => m.PreguntadosModule)
  },
  {
    path: 'gameOfThrones',
    loadChildren: () =>
      import('./pages/game-of-thrones/game-of-thrones.module').then(m => m.GameOfThronesModule)
  },
  {
    path: 'encuesta',
    loadChildren: () =>
      import('./pages/encuesta/encuesta.module').then(m => m.EncuestaModule)
  },
  {
    path: 'rankings',
    loadChildren: () =>
      import('./rankings/rankings.module').then(m => m.RankingsModule)
  }
];

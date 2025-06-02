import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/quienSoy/about.component';
import { AhorcadoComponent } from './pages/ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './pages/mayor-o-menor/mayor-o-menor.component';
import { PreguntadosComponent } from './pages/preguntados/preguntados.component';
import {GameOfThronesComponent  } from './pages/game-of-thrones/game-of-thrones.component';


export const routes: Routes = [{
    path: "login", component: LoginComponent
}, {
    path: "registro", component: RegistroComponent
},{
    path: "", component: LoginComponent
},
{
    path: "home", component: HomeComponent
},
{ path: 'about', component: AboutComponent },
{ path: 'ahorcado', component: AhorcadoComponent },
{ path: 'mayor-menor', component: MayorOMenorComponent },
{ path: 'preguntados', component: PreguntadosComponent },
{ path: 'gameOfThrones', component: GameOfThronesComponent }
];

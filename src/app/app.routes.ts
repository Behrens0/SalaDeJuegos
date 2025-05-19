import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/quienSoy/about.component';


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
{ path: 'about', component: AboutComponent }
];

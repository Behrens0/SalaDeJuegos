import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PreguntadosComponent } from './preguntados.component';

const routes: Routes = [
  {
    path: '',
    component: PreguntadosComponent
  }
];

@NgModule({
  declarations: [PreguntadosComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PreguntadosModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MayorOMenorComponent } from './mayor-o-menor.component';

const routes: Routes = [
  { path: '', component: MayorOMenorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MayorOMenorRoutingModule {}

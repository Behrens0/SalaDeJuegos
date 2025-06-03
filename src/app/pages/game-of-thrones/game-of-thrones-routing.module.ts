import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameOfThronesComponent } from './game-of-thrones.component';

const routes: Routes = [
  { path: '', component: GameOfThronesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameOfThronesRoutingModule {}

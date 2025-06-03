import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameOfThronesComponent } from './game-of-thrones.component';
import { GameOfThronesRoutingModule } from './game-of-thrones-routing.module';

@NgModule({
  declarations: [GameOfThronesComponent],
  imports: [
    CommonModule,
    GameOfThronesRoutingModule
  ]
})
export class GameOfThronesModule {}

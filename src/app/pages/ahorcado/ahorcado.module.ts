import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AhorcadoComponent } from './ahorcado.component';
import { HttpClientModule } from '@angular/common/http';
import { AhorcadoRoutingModule } from './ahorcado-routing.module';

@NgModule({
  declarations: [AhorcadoComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    AhorcadoRoutingModule
  ]
})
export class AhorcadoModule {}

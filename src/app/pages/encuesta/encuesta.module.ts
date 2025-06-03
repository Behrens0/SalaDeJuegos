import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncuestaComponent } from './encuesta.component';
import { EncuestaRoutingModule } from './encuesta-routing.module';

@NgModule({
  declarations: [EncuestaComponent],
  imports: [
    CommonModule,
    FormsModule,
    EncuestaRoutingModule
  ]
})
export class EncuestaModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RankingsComponent } from './rankings.component';


const routes: Routes = [
  { path: '', component: RankingsComponent }
];

@NgModule({
  declarations: [
    RankingsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class RankingsModule { }

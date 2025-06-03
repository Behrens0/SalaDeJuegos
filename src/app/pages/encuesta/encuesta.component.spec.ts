import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncuestaComponent } from './encuesta.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { SupabaseService } from '../../services/supabase.service';

describe('EncuestaComponent', () => {
  let component: EncuestaComponent;
  let fixture: ComponentFixture<EncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EncuestaComponent],
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule 
      ],
      providers: [SupabaseService]
    }).compileComponents();

    fixture = TestBed.createComponent(EncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

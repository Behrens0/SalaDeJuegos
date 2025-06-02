import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOfThronesComponent } from './game-of-thrones.component';

describe('GameOfThronesComponent', () => {
  let component: GameOfThronesComponent;
  let fixture: ComponentFixture<GameOfThronesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameOfThronesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameOfThronesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaPagarComponent } from './reserva-pagar.component';

describe('ReservaPagarComponent', () => {
  let component: ReservaPagarComponent;
  let fixture: ComponentFixture<ReservaPagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservaPagarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservaPagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuaHoSoComponent } from './sua-ho-so.component';

describe('SuaHoSoComponent', () => {
  let component: SuaHoSoComponent;
  let fixture: ComponentFixture<SuaHoSoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuaHoSoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuaHoSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

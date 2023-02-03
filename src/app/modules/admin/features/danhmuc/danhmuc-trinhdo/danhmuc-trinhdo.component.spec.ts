import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhmucTrinhdoComponent } from './danhmuc-trinhdo.component';

describe('DanhmucTrinhdoComponent', () => {
  let component: DanhmucTrinhdoComponent;
  let fixture: ComponentFixture<DanhmucTrinhdoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhmucTrinhdoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DanhmucTrinhdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

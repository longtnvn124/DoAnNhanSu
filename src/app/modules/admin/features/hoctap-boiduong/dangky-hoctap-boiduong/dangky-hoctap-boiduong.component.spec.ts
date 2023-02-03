import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DangkyHoctapBoiduongComponent } from './dangky-hoctap-boiduong.component';

describe('DangkyHoctapBoiduongComponent', () => {
  let component: DangkyHoctapBoiduongComponent;
  let fixture: ComponentFixture<DangkyHoctapBoiduongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DangkyHoctapBoiduongComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DangkyHoctapBoiduongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

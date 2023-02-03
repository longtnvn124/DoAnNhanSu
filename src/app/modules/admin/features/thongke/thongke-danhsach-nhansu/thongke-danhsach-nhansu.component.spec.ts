import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongkeDanhsachNhansuComponent } from './thongke-danhsach-nhansu.component';

describe('ThongkeDanhsachNhansuComponent', () => {
  let component: ThongkeDanhsachNhansuComponent;
  let fixture: ComponentFixture<ThongkeDanhsachNhansuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongkeDanhsachNhansuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThongkeDanhsachNhansuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesCreate } from './pages-create';

describe('PagesCreate', () => {
  let component: PagesCreate;
  let fixture: ComponentFixture<PagesCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagesCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagesCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestChatlistComponent } from './test-chatlist.component';

describe('TestChatlistComponent', () => {
  let component: TestChatlistComponent;
  let fixture: ComponentFixture<TestChatlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestChatlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestChatlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

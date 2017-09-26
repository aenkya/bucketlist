// This shows a different way of testing a component, check about for a simpler one
import { Component } from '@angular/core';

import { TestBed } from '@angular/core/testing';

import { BucketlistDetailComponent } from './bucketlist-detail.component';

describe('Bucketlist Detail Component', () => {
  const html = '<app-bucketlist-detail></app-bucketlist-detail>';

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [BucketlistDetailComponent, TestComponent]});
    TestBed.overrideComponent(TestComponent, { set: { template: html }});
  });

  it('should ...', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].textContent).toContain('bucketlist detail Works!');
  });

});

@Component({selector: 'app-bucketlist-detail', template: ''})
class TestComponent { }

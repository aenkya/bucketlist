import { inject, TestBed } from '@angular/core/testing';

import { BucketlistService } from './bucketlist.service';

describe('Task Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [BucketlistService]});
  });

  it('should ...', inject([BucketlistService], (api) => {
    expect(api.title).toBe('Angular 2');
  }));
});

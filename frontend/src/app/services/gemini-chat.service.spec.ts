import { TestBed } from '@angular/core/testing';

import { GeminiChatService } from './gemini-chat.service';

describe('GeminiChatService', () => {
  let service: GeminiChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeminiChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

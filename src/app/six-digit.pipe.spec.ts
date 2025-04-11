import { SixDigitPipe } from './six-digit.pipe';

describe('SixDigitPipe', () => {
  it('create an instance', () => {
    const pipe = new SixDigitPipe();
    expect(pipe).toBeTruthy();
  });
});

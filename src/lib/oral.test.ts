import { describe, expect, it } from 'vitest';
import { alignProgress, countFillers, lev, maskWords, scoreSpeech, words, wpm } from './oral';
import { SLIDES } from '../content/oral/rmrf';

describe('oral coach', () => {
  it('tokenises', () => expect(words('Pixar, 1998. That\'s it!')).toEqual(['pixar', '1998', "that's", 'it']));
  it('levenshtein', () => {
    expect(lev('think', 'sink')).toBe(2);
    expect(lev('server', 'server')).toBe(0);
  });
  it('scores speech word by word', () => {
    const r = scoreSpeech('Everything stops now', 'everything stop');
    expect(r.ok).toEqual([true, true, false]);
    expect(r.score).toBe(67);
  });
  it('masks progressively', () => {
    const s = 'One person had a copy on her computer at home.';
    const hidden = (l: number) => maskWords(s, l).split(' ').filter((t) => t.startsWith('_')).length;
    expect(hidden(0)).toBe(0);
    expect(hidden(1)).toBeLessThan(hidden(2));
    expect(hidden(2)).toBeLessThan(hidden(3));
    expect(maskWords(s, 4, ['copy', 'home.'])).toContain('copy');
  });
  it('pace and fillers', () => {
    expect(wpm(130, 60000)).toBe(130);
    expect(countFillers('so um like uh okay')).toBe(3);
  });
  it('script content is complete', () => {
    expect(SLIDES.map((s) => s.n)).toEqual([9, 10, 11, 12]);
    for (const s of SLIDES) for (const x of s.sentences) expect(x.dar && x.fr && x.en).toBeTruthy();
  });
  it('live prompter follows the speaker, tolerating misheard and skipped words', () => {
    const exp = words('Now you might be thinking who would ever type this command by accident');
    expect(alignProgress(exp, words('now you might'))).toBe(3);
    expect(alignProgress(exp, words('now you mite be thinking'))).toBe(5);
    // one stray word does not make the prompter jump ahead
    expect(alignProgress(exp, words('now command'))).toBe(1);
    // skipping a few words: two consecutive matches confirm the jump
    expect(alignProgress(exp, words('now you who would ever'))).toBe(8);
  });
});

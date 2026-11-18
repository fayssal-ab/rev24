import { describe, it, expect } from 'vitest';
import { canonicalCommand, commandMatches, checkAnswer, updateQStat, pickWeighted, gradeExam, tokenize } from './quiz';
import { review, newCard, DAY } from './sm2';
import type { Question } from './schema';

const L = (s: string) => ({ fr: s, dar: s, en: s });

describe('command normalisation', () => {
  const ok = ['usermod -aG IIR tp', 'usermod -a -G IIR tp', 'gpasswd -a tp IIR'];
  it.each([
    'usermod -aG IIR tp',
    'usermod -a -G IIR tp',
    'usermod -G IIR -a tp',
    '  usermod   -aG   IIR  tp ',
    'sudo usermod -aG IIR tp',
    'gpasswd -a tp IIR',
    'usermod -GIIR -a tp'
  ])('accepts %s', (s) => expect(commandMatches(s, ok)).toBe(true));
  it.each(['usermod -G IIR tp', 'usermod -aG tp IIR', 'gpasswd -d tp IIR', 'useradd -aG IIR tp', ''])('rejects %s', (s) =>
    expect(commandMatches(s, ok)).toBe(false)
  );
  it('quotes are normalised', () => {
    expect(canonicalCommand('useradd -c "Utilisateur TP" -m tp')).toBe(canonicalCommand("useradd -m -c 'Utilisateur TP' tp"));
    expect(tokenize('echo "a b" c')).toEqual(['echo', 'a b', 'c']);
  });
  it('chage options in any order', () => {
    expect(commandMatches('chage -W 7 -M 90 alice', ['chage -M 90 -W 7 alice'])).toBe(true);
    expect(commandMatches('chage -M 7 -W 90 alice', ['chage -M 90 -W 7 alice'])).toBe(false);
  });
  it('long options with = or space', () => {
    expect(commandMatches('systemctl list-units --type=target', ['systemctl list-units --type=target'])).toBe(true);
    expect(commandMatches('journalctl -u sshd -p err', ['journalctl -p err -u sshd'])).toBe(true);
  });
  it('positional order matters', () => {
    expect(commandMatches('chown tp:IIR /opt/donnees', ['chown tp:IIR /opt/donnees'])).toBe(true);
    expect(commandMatches('chmod 755 /opt/donnees', ['chmod 755 /opt/donnees'])).toBe(true);
    expect(commandMatches('chmod /opt/donnees 755', ['chmod 755 /opt/donnees'])).toBe(false);
  });
});

describe('checkAnswer', () => {
  const base = { id: 'q', module: 'm', chapter: 'c', difficulty: 1 as const, prompt: L('?'), explanation: L('.'), tags: [] };
  it('single / multi / order / numeric', () => {
    const single = { ...base, kind: 'single' as const, options: [{ id: 'a', text: L('a') }, { id: 'b', text: L('b') }], answer: 'a' };
    expect(checkAnswer(single as Question, 'a')).toBe(true);
    expect(checkAnswer(single as Question, 'b')).toBe(false);
    const multi = { ...single, kind: 'multi' as const, answer: ['a', 'b'] };
    expect(checkAnswer(multi as Question, ['b', 'a'])).toBe(true);
    expect(checkAnswer(multi as Question, ['a'])).toBe(false);
    const order = { ...single, kind: 'order' as const, answer: ['b', 'a'] };
    expect(checkAnswer(order as Question, ['b', 'a'])).toBe(true);
    expect(checkAnswer(order as Question, ['a', 'b'])).toBe(false);
    const num = { ...base, kind: 'numeric' as const, answer: 3.125, tolerance: 0.01 };
    expect(checkAnswer(num as Question, '3,12')).toBe(true);
    expect(checkAnswer(num as Question, 3.13)).toBe(true);
    expect(checkAnswer(num as Question, '3.2')).toBe(false);
    expect(checkAnswer(num as Question, 'abc')).toBe(false);
  });
});

describe('mes erreurs', () => {
  it('leaves the mistakes list after 3 consecutive right answers', () => {
    let s = updateQStat(undefined, false);
    expect(s.inMistakes).toBe(true);
    s = updateQStat(s, true);
    s = updateQStat(s, true);
    expect(s.inMistakes).toBe(true);
    s = updateQStat(s, false);
    s = updateQStat(s, true);
    s = updateQStat(s, true);
    expect(s.inMistakes).toBe(true);
    s = updateQStat(s, true);
    expect(s.inMistakes).toBe(false);
  });
});

describe('exam', () => {
  const qs: Question[] = [];
  for (const c of ['a', 'b', 'c']) for (let i = 0; i < 20; i++) qs.push({ id: `${c}${i}`, module: 'm', chapter: c, difficulty: 1, kind: 'numeric', prompt: L('?'), answer: 1, explanation: L('.'), tags: [] });
  it('picks 30 distinct weighted questions', () => {
    const p = pickWeighted(qs, { a: 3, b: 2, c: 1 }, 30);
    expect(p).toHaveLength(30);
    expect(new Set(p.map((q) => q.id)).size).toBe(30);
    expect(p.filter((q) => q.chapter === 'a')).toHaveLength(15);
    expect(p.filter((q) => q.chapter === 'c')).toHaveLength(5);
  });
  it('grades /20', () => {
    const p = qs.slice(0, 4);
    const g = gradeExam(p, { a0: 1, a1: 1, a2: 2 });
    expect(g.note).toBe(10);
  });
});

describe('SM-2', () => {
  it('intervals grow and again resets', () => {
    let c = newCard(0);
    c = review(c, 'good', 0);
    expect(c.interval).toBe(1);
    c = review(c, 'good', 0);
    expect(c.interval).toBe(3);
    c = review(c, 'good', 0);
    expect(c.interval).toBeCloseTo(7.5);
    expect(c.due).toBe(7.5 * DAY);
    c = review(c, 'again', 0);
    expect(c.reps).toBe(0);
    expect(c.ease).toBeCloseTo(2.3);
  });
});

describe('pipelines', () => {
  it('canonicalises each segment', () => {
    expect(commandMatches('grep  bash /etc/passwd|wc -l', ['grep bash /etc/passwd | wc -l'])).toBe(true);
    expect(commandMatches('du -sh /var/log/* | sort -h | tail -n 5', ['du -sh /var/log/* | sort -h | tail -5'])).toBe(false);
    expect(commandMatches('ssh etudiant@192.168.56.10 uptime; df -h /', ['ssh etudiant@192.168.56.10 "uptime; df -h /"'])).toBe(false);
    expect(commandMatches("ssh etudiant@192.168.56.10 'uptime; df -h /'", ['ssh etudiant@192.168.56.10 "uptime; df -h /"'])).toBe(true);
  });
});

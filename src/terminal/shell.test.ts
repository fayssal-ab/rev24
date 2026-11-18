import { describe, it, expect, beforeEach } from 'vitest';
import { Shell, validateSudoers } from './shell';
import { lookup } from './vfs';

let sh: Shell;
const root = () => new Shell('root');
const line = (s: Shell, path: string, name: string) => s.readRaw(path).split('\n').find((l) => l.startsWith(name + ':'));
const mode = (s: Shell, p: string) => (lookup(s.state.root, p)!.mode & 0o7777).toString(8);

describe('filesystem basics', () => {
  beforeEach(() => (sh = new Shell('etudiant')));
  it('prompt and pwd', () => {
    expect(sh.prompt()).toBe('[etudiant@rhel9 ~]$ ');
    expect(sh.run('pwd')).toBe('/home/etudiant\n');
  });
  it('mkdir -p, cd relative/absolute, ls', () => {
    sh.run('mkdir -p tp1/a/b');
    sh.run('cd tp1/a');
    expect(sh.run('pwd')).toBe('/home/etudiant/tp1/a\n');
    sh.run('cd ../..');
    expect(sh.run('pwd')).toBe('/home/etudiant\n');
    sh.run('cd /etc');
    expect(sh.prompt()).toBe('[etudiant@rhel9 etc]$ ');
    expect(sh.run('ls -d /etc')).toBe('/etc\n');
  });
  it('mkdir without -p fails with french message', () => {
    expect(sh.run('mkdir x/y')).toContain("mkdir: impossible de créer le répertoire « x/y »: Aucun fichier ou dossier de ce type");
  });
  it('touch, echo > and >>, cat', () => {
    sh.run('echo bonjour > f.txt');
    sh.run('echo salut >> f.txt');
    expect(sh.run('cat f.txt')).toBe('bonjour\nsalut\n');
    sh.run('echo reset > f.txt');
    expect(sh.run('cat f.txt')).toBe('reset\n');
  });
  it('cp, mv, rm -r', () => {
    sh.run('echo a > a.txt');
    sh.run('cp a.txt b.txt');
    sh.run('mv b.txt c.txt');
    expect(sh.run('ls')).toContain('c.txt');
    expect(sh.run('cat b.txt')).toContain('Aucun fichier');
    sh.run('mkdir -p d/e');
    expect(sh.run('rm d')).toContain('est un dossier');
    sh.run('rm -rf d');
    expect(sh.node('d')).toBeNull();
  });
  it('permission denied on /etc/shadow and /root', () => {
    expect(sh.run('cat /etc/shadow')).toBe('cat: /etc/shadow: Permission non accordée\n');
    expect(sh.run('cd /root')).toContain('Permission non accordée');
    expect(sh.run('touch /etc/x')).toContain('Permission non accordée');
  });
  it('pipes: cut | sort | head, grep -c, wc -l', () => {
    expect(sh.run('cut -d: -f1 /etc/passwd | head -1')).toBe('root\n');
    expect(sh.run('grep -c bash /etc/passwd')).toBe('2\n');
    expect(sh.run('cat /etc/passwd | wc -l')).toBe('20\n');
    expect(sh.run('cut -d: -f1 /etc/passwd | sort | tail -n 1')).toBe('tss\n');
  });
  it('redirections 2> and 2>/dev/null, tee', () => {
    expect(sh.run('ls /nope 2>/dev/null')).toBe('');
    sh.run('ls /nope 2> err.txt');
    expect(sh.run('cat err.txt')).toContain("impossible d'accéder");
    expect(sh.run('echo hello | tee t.txt')).toBe('hello\n');
    expect(sh.run('cat t.txt')).toBe('hello\n');
  });
  it('find -name / -type / -size', () => {
    expect(sh.run('find /etc -name "*.defs" 2>/dev/null')).toBe('/etc/login.defs\n');
    expect(sh.run('find /etc/skel -type f')).toContain('/etc/skel/.bashrc');
    expect(sh.run('find /usr/share -size +5M')).toContain('/usr/share/magic');
  });
  it('history and !!', () => {
    sh.run('whoami');
    expect(sh.run('!!')).toBe('whoami\netudiant\n');
    expect(sh.run('history')).toContain('whoami');
  });
  it('unknown command', () => {
    expect(sh.run('foo')).toBe('bash: foo : commande introuvable\n');
  });
  it('ls -l format', () => {
    const l = sh.run('ls -l /etc/passwd');
    expect(l).toMatch(/^-rw-r--r--\. 1 root root +\d+ .+ \/etc\/passwd\n$/);
  });
  it('type / which', () => {
    expect(sh.run('type cd')).toBe('cd est une primitive du shell\n');
    expect(sh.run('type ls')).toContain('alias');
    expect(sh.run('type useradd')).toBe('useradd est /usr/sbin/useradd\n');
  });
  it('tab completion', () => {
    expect(sh.complete('userm').line).toBe('usermod ');
    expect(sh.complete('cat /etc/pass').line).toBe('cat /etc/passwd ');
  });
  it('[ -d /sys/firmware/efi ] && echo UEFI || echo BIOS', () => {
    expect(sh.run('[ -d /sys/firmware/efi ] && echo UEFI || echo BIOS')).toBe('UEFI\n');
  });
});

describe('users and groups (TP5)', () => {
  beforeEach(() => (sh = root()));
  it('useradd creates passwd, shadow, group, home from skel', () => {
    expect(sh.run('useradd tp')).toBe('');
    expect(line(sh, '/etc/passwd', 'tp')).toBe('tp:x:1001:1001::/home/tp:/bin/bash');
    expect(line(sh, '/etc/shadow', 'tp')).toMatch(/^tp:!!:\d+:0:99999:7:::$/);
    expect(line(sh, '/etc/group', 'tp')).toBe('tp:x:1001:');
    expect(line(sh, '/etc/gshadow', 'tp')).toBe('tp:!::');
    expect(sh.run('ls -a /home/tp')).toContain('.bashrc');
    expect(mode(sh, '/home/tp')).toBe('700');
    expect(sh.run('useradd tp')).toBe("useradd : l'utilisateur « tp » existe déjà\n");
  });
  it('useradd as non-root is refused', () => {
    const u = new Shell('etudiant');
    expect(u.run('useradd x')).toContain('Permission non accordée');
  });
  it('useradd -u -g -G -e -c -s', () => {
    sh.run('groupadd IIR');
    sh.run('useradd -u 2003 -g users -G IIR -e 2026-12-31 -c "Utilisateur TP1" -s /bin/sh tp1');
    expect(line(sh, '/etc/passwd', 'tp1')).toBe('tp1:x:2003:100:Utilisateur TP1:/home/tp1:/bin/sh');
    const exp = line(sh, '/etc/shadow', 'tp1')!.split(':')[7];
    expect(new Date(+exp * 86400000).toISOString().slice(0, 10)).toBe('2026-12-31');
    expect(sh.run('id -Gn tp1')).toBe('users IIR\n');
    expect(line(sh, '/etc/group', 'tp1')).toBeUndefined();
  });
  it('useradd -r system account without home', () => {
    sh.run('useradd -r tpsys');
    const uid = +line(sh, '/etc/passwd', 'tpsys')!.split(':')[2];
    expect(uid).toBeLessThan(1000);
    expect(sh.node('/home/tpsys')).toBeNull();
  });
  it('useradd with missing group', () => {
    expect(sh.run('useradd -G nope x')).toBe("useradd : le groupe « nope » n'existe pas\n");
  });
  it('useradd -D shows and sets defaults', () => {
    expect(sh.run('useradd -D')).toContain('SHELL=/bin/bash');
    sh.run('useradd -D -s /bin/sh');
    expect(sh.readRaw('/etc/default/useradd')).toContain('SHELL=/bin/sh');
  });
  it('/etc/skel file is copied to new users', () => {
    sh.run('echo Bienvenue > /etc/skel/bienvenue.txt');
    sh.run('useradd -m tmpuser');
    expect(sh.run('cat /home/tmpuser/bienvenue.txt')).toBe('Bienvenue\n');
    expect(sh.run('ls -l /home/tmpuser/bienvenue.txt')).toContain('tmpuser tmpuser');
  });
  it('usermod -aG appends, -G alone REPLACES secondary groups (trap)', () => {
    sh.run('groupadd IIR');
    sh.run('groupadd dev');
    sh.run('useradd -G dev tp');
    sh.run('usermod -aG IIR tp');
    expect(sh.run('id -Gn tp')).toBe('tp IIR dev\n');
    sh.run('usermod -G IIR tp');
    expect(sh.run('id -Gn tp')).toBe('tp IIR\n');
  });
  it('usermod -a without -G is an error', () => {
    sh.run('useradd tp');
    expect(sh.run('usermod -a tp')).toContain("l'option -a n'est autorisée qu'avec l'option -G");
  });
  it('usermod -l renames, -d -m moves home, -s, -c', () => {
    sh.run('useradd tp');
    sh.run('usermod -l tp2 tp');
    expect(line(sh, '/etc/passwd', 'tp2')).toContain('/home/tp');
    sh.run('usermod -d /home/tp2 -m tp2');
    expect(sh.node('/home/tp2')).not.toBeNull();
    expect(sh.node('/home/tp')).toBeNull();
    sh.run('usermod -s /sbin/nologin -c "Compte test" tp2');
    expect(line(sh, '/etc/passwd', 'tp2')).toBe('tp2:x:1001:1001:Compte test:/home/tp2:/sbin/nologin');
  });
  it('usermod -L / -U and passwd -l / -u / -S', () => {
    sh.run('useradd tp');
    sh.run('echo Secret123! | passwd --stdin tp');
    expect(sh.run('passwd -S tp')).toContain('PS');
    sh.run('usermod -L tp');
    expect(line(sh, '/etc/shadow', 'tp')!.split(':')[1].startsWith('!$6$')).toBe(true);
    sh.run('usermod -U tp');
    expect(sh.run('passwd -l tp')).toContain('Verrouillage du mot de passe');
    expect(sh.run('passwd -S tp')).toContain('LK');
    expect(sh.run('passwd -u tp')).toContain('Succès');
    expect(sh.run('passwd -S tp')).toContain('PS');
  });
  it('passwd interactive as root (two prompts) and mismatch', () => {
    sh.run('useradd tp');
    const out = sh.run('passwd tp', 'Azerty2026!', 'Azerty2026!');
    expect(out).toContain('mise à jour réussie');
    expect(sh.run('passwd tp', 'Azerty2026!', 'autre')).toContain('ne correspondent pas');
  });
  it('passwd -d and -e', () => {
    sh.run('useradd tp');
    sh.run('passwd -d tp');
    expect(line(sh, '/etc/shadow', 'tp')!.split(':')[1]).toBe('');
    sh.run('passwd -e tp');
    expect(line(sh, '/etc/shadow', 'tp')!.split(':')[2]).toBe('0');
  });
  it('chage -M -W -m -I -E -d and chage -l', () => {
    sh.run('useradd alice');
    sh.run('chage -M 90 -W 7 alice');
    const f = line(sh, '/etc/shadow', 'alice')!.split(':');
    expect(f[4]).toBe('90');
    expect(f[5]).toBe('7');
    sh.run('chage -d 0 -I 2 alice');
    const g = line(sh, '/etc/shadow', 'alice')!.split(':');
    expect(g[2]).toBe('0');
    expect(g[6]).toBe('2');
    expect(sh.run('chage -l alice')).toContain('le mot de passe doit être changé');
    sh.run('chage -E 2026-12-31 alice');
    expect(sh.run('chage -l alice')).toContain('déc. 31, 2026');
    sh.run('chage -E -1 alice');
    expect(line(sh, '/etc/shadow', 'alice')!.split(':')[7]).toBe('');
  });
  it('userdel -r removes home and private group', () => {
    sh.run('useradd tp');
    sh.run('userdel -r tp');
    expect(line(sh, '/etc/passwd', 'tp')).toBeUndefined();
    expect(line(sh, '/etc/group', 'tp')).toBeUndefined();
    expect(sh.node('/home/tp')).toBeNull();
  });
  it('userdel without -r keeps the home, find -uid lists orphan files', () => {
    sh.run('useradd -u 1002 tp');
    sh.run('touch /tmp/a');
    sh.run('chown tp /tmp/a');
    sh.run('userdel tp');
    expect(sh.node('/home/tp')).not.toBeNull();
    expect(sh.run('find /tmp -type f -uid 1002')).toBe('/tmp/a\n');
    sh.run('find / -type f -uid 1002 -print -exec rm {} \\;');
    expect(sh.node('/tmp/a')).toBeNull();
  });
  it('groupadd -g, duplicate, groupmod -n -g, groupdel', () => {
    sh.run('groupadd -g 5000 IIR');
    expect(line(sh, '/etc/group', 'IIR')).toBe('IIR:x:5000:');
    expect(sh.run('groupadd IIR')).toContain('existe déjà');
    expect(sh.run('groupadd -g 5000 X')).toContain('déjà utilisé');
    sh.run('groupmod -n 4IIR -g 5001 IIR');
    expect(line(sh, '/etc/group', '4IIR')).toBe('4IIR:x:5001:');
    sh.run('groupdel 4IIR');
    expect(line(sh, '/etc/group', '4IIR')).toBeUndefined();
  });
  it('groupdel refuses a primary group', () => {
    sh.run('useradd tp');
    expect(sh.run('groupdel tp')).toBe("groupdel : impossible de supprimer le groupe primaire de l'utilisateur « tp »\n");
  });
  it('gpasswd -a / -d / -M / -A', () => {
    sh.run('groupadd developpeurs');
    sh.run('useradd user1');
    sh.run('useradd user2');
    sh.run('useradd admin1');
    expect(sh.run('gpasswd -a user1 developpeurs')).toBe("Ajout de l'utilisateur user1 au groupe developpeurs\n");
    sh.run('gpasswd -M user1,user2 developpeurs');
    sh.run('gpasswd -A admin1 developpeurs');
    expect(line(sh, '/etc/gshadow', 'developpeurs')).toBe('developpeurs:!:admin1:user1,user2');
    sh.run('gpasswd -d user2 developpeurs');
    expect(line(sh, '/etc/group', 'developpeurs')).toBe('developpeurs:x:1001:user1');
  });
});

describe('permissions', () => {
  beforeEach(() => (sh = root()));
  it('chmod octal', () => {
    sh.run('touch /tmp/f');
    sh.run('chmod 764 /tmp/f');
    expect(sh.run('ls -l /tmp/f')).toMatch(/^-rwxrw-r--/);
    sh.run('chmod 600 /tmp/f');
    expect(mode(sh, '/tmp/f')).toBe('600');
  });
  it('chmod symbolic u+x,g-w,o=', () => {
    sh.run('touch /tmp/f');
    sh.run('chmod 666 /tmp/f');
    sh.run('chmod u+x,g-w,o= /tmp/f');
    expect(mode(sh, '/tmp/f')).toBe('740');
    sh.run('chmod a+r /tmp/f');
    expect(mode(sh, '/tmp/f')).toBe('744');
    sh.run('chmod go-r /tmp/f');
    expect(mode(sh, '/tmp/f')).toBe('700');
  });
  it('chmod -R and invalid mode', () => {
    sh.run('mkdir -p /opt/a/b');
    sh.run('touch /opt/a/b/c');
    sh.run('chmod -R 750 /opt/a');
    expect(mode(sh, '/opt/a/b/c')).toBe('750');
    expect(sh.run('chmod 999 /opt/a')).toContain('mode incorrect');
  });
  it('chown user, user:group, :group, -R', () => {
    sh.run('useradd tp');
    sh.run('groupadd IIR');
    sh.run('mkdir -p /opt/donnees/sub');
    sh.run('chown tp /opt/donnees');
    expect(sh.run('ls -ld /opt/donnees')).toContain('tp root');
    sh.run('chown tp:IIR /opt/donnees');
    expect(sh.run('ls -ld /opt/donnees')).toContain('tp IIR');
    sh.run('chown :root /opt/donnees');
    expect(sh.run('ls -ld /opt/donnees')).toContain('tp root');
    sh.run('chown -R tp:IIR /opt/donnees');
    expect(sh.run('ls -ld /opt/donnees/sub')).toContain('tp IIR');
    expect(sh.run('chown nobodyx /opt/donnees')).toContain('utilisateur incorrect');
  });
  it('chgrp and non-root chown refused', () => {
    sh.run('groupadd IIR');
    sh.run('touch /tmp/x');
    sh.run('chgrp IIR /tmp/x');
    expect(sh.run('ls -l /tmp/x')).toContain('root IIR');
    const u = new Shell('etudiant', sh.state);
    u.run('touch /tmp/mine');
    expect(u.run('chown root /tmp/mine')).toContain('Opération non permise');
  });
  it('directory permissions: r, w, x semantics', () => {
    sh.run('useradd -m tp');
    sh.run('echo Secret123! | passwd --stdin tp');
    sh.run('mkdir /opt/d');
    sh.run('touch /opt/d/f');
    sh.run('chmod 711 /opt/d');
    sh.run('su - tp');
    expect(sh.run('ls /opt/d')).toContain("impossible d'ouvrir le répertoire");
    expect(sh.run('cat /opt/d/f')).toBe('');
    expect(sh.run('touch /opt/d/g')).toContain('Permission non accordée');
    sh.run('exit');
    sh.run('chmod 700 /opt/d');
    sh.run('su - tp');
    expect(sh.run('cat /opt/d/f')).toContain('Permission non accordée');
  });
  it('TP5: /opt/donnees owned by tp with 755', () => {
    sh.run('useradd tp');
    sh.run('mkdir /opt/donnees');
    sh.run('chown tp /opt/donnees');
    sh.run('chmod 755 /opt/donnees');
    expect(sh.run('ls -ld /opt/donnees')).toMatch(/^drwxr-xr-x\. 2 tp root/);
  });
});

describe('su, sudo, visudo', () => {
  beforeEach(() => {
    sh = root();
    sh.run('useradd tp1');
    sh.run('echo Tp1pass2026! | passwd --stdin tp1');
  });
  it('su - from root needs no password and exit returns', () => {
    sh.run('su - tp1');
    expect(sh.prompt()).toBe('[tp1@rhel9 ~]$ ');
    expect(sh.run('whoami')).toBe('tp1\n');
    sh.run('exit');
    expect(sh.run('whoami')).toBe('root\n');
  });
  it('su with wrong password fails', () => {
    const u = new Shell('etudiant', sh.state);
    expect(u.run('su - tp1', 'mauvais')).toContain("Échec d'authentification");
    expect(u.run('su - tp1', 'Tp1pass2026!')).not.toContain('Échec');
    expect(u.user).toBe('tp1');
  });
  it('locked account cannot su', () => {
    sh.run('passwd -l tp1');
    const u = new Shell('etudiant', sh.state);
    expect(u.run('su - tp1', 'Tp1pass2026!')).toContain("Échec d'authentification");
  });
  it('chage -d 0 forces a password change at login', () => {
    sh.run('chage -d 0 tp1');
    const u = new Shell('etudiant', sh.state);
    const out = u.run('su - tp1', 'Tp1pass2026!', 'Tp1pass2026!', 'NouveauMdp#2026', 'NouveauMdp#2026');
    expect(out).toContain('Vous devez changer votre mot de passe');
    expect(u.user).toBe('tp1');
    expect(line(u, '/etc/shadow', 'tp1')!.split(':')[2]).not.toBe('0');
  });
  it('expired account is refused', () => {
    sh.run('chage -E 2000-01-01 tp1');
    const u = new Shell('etudiant', sh.state);
    expect(u.run('su - tp1', 'Tp1pass2026!')).toContain('Le compte a expiré');
  });
  it('user not in sudoers', () => {
    sh.run('su - tp1');
    const out = sh.run('sudo reboot', 'Tp1pass2026!');
    expect(out).toContain("tp1 n'apparaît pas dans le fichier sudoers");
  });
  it('wheel member can sudo anything', () => {
    sh.run('usermod -aG wheel tp1');
    sh.run('su - tp1');
    expect(sh.run('sudo cat /etc/shadow', 'Tp1pass2026!')).toContain('root:$6$');
    expect(sh.user).toBe('tp1');
  });
  it('sudoers rule for one command only (tp1 ALL=(root) /usr/sbin/reboot)', () => {
    sh.writeRaw('/etc/sudoers.d/tp1', 'tp1 ALL=(root) /usr/sbin/reboot\n');
    sh.run('su - tp1');
    expect(sh.run('sudo useradd x', 'Tp1pass2026!')).toContain("n'est pas autorisé à exécuter « /usr/sbin/useradd x »");
    expect(sh.run('sudo reboot')).toContain('Redémarrage');
  });
  it('%developers with NOPASSWD and command list', () => {
    sh.run('groupadd developers');
    sh.run('usermod -aG developers tp1');
    sh.writeRaw('/etc/sudoers.d/dev', '%developers ALL=(ALL) NOPASSWD: /usr/bin/systemctl, /usr/bin/journalctl\n');
    sh.run('su - tp1');
    expect(sh.run('sudo systemctl restart sshd')).toBe('');
    expect(sh.pending).toBeNull();
    expect(sh.run('sudo -l')).toContain('NOPASSWD: /usr/bin/systemctl, /usr/bin/journalctl');
  });
  it('visudo editor refuses invalid syntax, accepts valid line', () => {
    sh.run('visudo');
    expect(sh.editor).not.toBeNull();
    expect(sh.run('tp1 ALL=(root /usr/sbin/reboot')).toContain('│');
    expect(sh.run(':wq')).toContain('erreur de syntaxe');
    const n = sh.editor!.lines.length;
    sh.run(`:r ${n} tp1 ALL=(root) /usr/sbin/reboot`);
    sh.run(':wq');
    expect(sh.editor).toBeNull();
    expect(sh.readRaw('/etc/sudoers')).toContain('tp1 ALL=(root) /usr/sbin/reboot');
    expect(sh.run('visudo -c')).toContain('analysé correctement');
  });
  it('validateSudoers', () => {
    expect(validateSudoers('%wheel ALL=(ALL) ALL\n')).toBe(0);
    expect(validateSudoers('tp1 ALL=(root) NOPASSWD: /usr/sbin/reboot\n')).toBe(0);
    expect(validateSudoers('tp1 ALL /usr/sbin/reboot\n')).toBe(1);
  });
});

describe('systemd', () => {
  beforeEach(() => (sh = root()));
  it('enable ≠ start', () => {
    sh.run('systemctl enable bluetooth');
    expect(sh.run('systemctl is-enabled bluetooth')).toBe('enabled\n');
    expect(sh.run('systemctl is-active bluetooth')).toBe('inactive\n');
    sh.run('systemctl start bluetooth');
    expect(sh.run('systemctl is-active bluetooth')).toBe('active\n');
  });
  it('mask prevents start', () => {
    sh.run('systemctl mask postfix');
    expect(sh.run('systemctl start postfix')).toContain('masked');
    sh.run('systemctl unmask postfix');
    expect(sh.run('systemctl start postfix')).toBe('');
  });
  it('set-default ≠ isolate', () => {
    expect(sh.run('systemctl get-default')).toBe('graphical.target\n');
    sh.run('systemctl set-default multi-user.target');
    expect(sh.run('systemctl get-default')).toBe('multi-user.target\n');
    expect(sh.state.currentTarget).toBe('graphical.target');
    sh.run('systemctl isolate multi-user.target');
    expect(sh.state.currentTarget).toBe('multi-user.target');
  });
  it('non-root cannot start', () => {
    const u = new Shell('etudiant');
    expect(u.run('systemctl stop sshd')).toContain('Interactive authentication required');
  });
  it('custom service with daemon-reload', () => {
    sh.writeRaw('/usr/local/bin/hello.sh', '#!/bin/bash\necho hello\n');
    sh.run('chmod +x /usr/local/bin/hello.sh');
    sh.writeRaw('/etc/systemd/system/hello.service', '[Unit]\nDescription=Hello\n[Service]\nExecStart=/usr/local/bin/hello.sh\n[Install]\nWantedBy=multi-user.target\n');
    expect(sh.run('systemctl start hello')).toContain('not found');
    sh.run('systemctl daemon-reload');
    sh.run('systemctl enable --now hello');
    expect(sh.run('systemctl is-active hello')).toBe('active\n');
    expect(sh.node('/etc/systemd/system/multi-user.target.wants/hello.service')).not.toBeNull();
  });
  it('--failed and journalctl -u -p', () => {
    expect(sh.run('systemctl list-units --failed')).toContain('kdump.service');
    expect(sh.run('journalctl -u sshd -n 2')).toContain('sshd');
    expect(sh.run('journalctl -p err')).toContain('kdump');
    expect(sh.run('journalctl -p err')).not.toContain('Server listening');
  });
});

describe('packages', () => {
  beforeEach(() => (sh = root()));
  it('rpm -qf, -qi, -ql', () => {
    expect(sh.run('rpm -qf /etc/services')).toMatch(/^setup-/);
    expect(sh.run('rpm -qf /bin/ls')).toMatch(/^coreutils-/);
    expect(sh.run('rpm -qi bash')).toContain('Name        : bash');
    expect(sh.run('rpm -q wireshark')).toBe("le paquet wireshark n'est pas installé\n");
  });
  it('rpm -ivh wireshark fails on dependencies, dnf resolves them', () => {
    expect(sh.run('rpm -ivh /root/rpms/wireshark-3.4.10-7.el9.x86_64.rpm')).toContain('Dépendances requises');
    const out = sh.run('dnf install -y wireshark');
    expect(out).toContain('Installation des dépendances');
    expect(sh.state.installed['libpcap']).toBeDefined();
    expect(sh.run('rpm -q wireshark')).toMatch(/^wireshark-3/);
  });
  it('dnf history undo', () => {
    sh.run('dnf install -y tree');
    const id = sh.state.dnfHistory.length;
    sh.run(`dnf history undo ${id} -y`);
    expect(sh.state.installed['tree']).toBeUndefined();
  });
  it('dnf provides /usr/share/magic', () => {
    expect(sh.run('dnf provides /usr/share/magic')).toContain('file-libs');
  });
  it('rpm -V detects modified config file', () => {
    expect(sh.run('rpm -V sudo')).toBe('');
    sh.run('echo "# test" >> /etc/sudoers');
    expect(sh.run('rpm -V sudo')).toContain('c /etc/sudoers');
  });
  it('local repository with createrepo', () => {
    sh.run('dnf install -y createrepo_c');
    sh.run('mkdir -p /var/www/html/mon_depot');
    sh.run('dnf install --downloadonly --downloaddir=/var/www/html/mon_depot -y zsh');
    expect(sh.run('ls /var/www/html/mon_depot')).toContain('zsh-5.8');
    sh.run('createrepo /var/www/html/mon_depot');
    sh.writeRaw('/etc/yum.repos.d/local.repo', '[local]\nname=Depot local\nbaseurl=file:///var/www/html/mon_depot\ngpgcheck=0\nenabled=1\n');
    sh.run('yum-config-manager --disable rhel-9-for-x86_64-baseos-rpms');
    sh.run('yum-config-manager --disable rhel-9-for-x86_64-appstream-rpms');
    expect(sh.run('dnf repolist')).toContain('local');
    expect(sh.run('dnf install -y zsh')).toContain('local');
    expect(sh.state.installed['zsh']).toBeDefined();
  });
});

describe('GRUB & boot', () => {
  beforeEach(() => (sh = root()));
  it('grub2-mkconfig regenerates grub.cfg from /etc/default/grub and 40_custom', () => {
    sh.run('cp -p /etc/default/grub /etc/default/grub.bak');
    sh.writeRaw('/etc/default/grub', sh.readRaw('/etc/default/grub').replace('GRUB_TIMEOUT=5', 'GRUB_TIMEOUT=10'));
    sh.run('echo \'menuentry "Redemarrer" { reboot }\' >> /etc/grub.d/40_custom');
    expect(sh.run('grub2-mkconfig -o /boot/grub2/grub.cfg')).toContain('done');
    const cfg = sh.readRaw('/boot/grub2/grub.cfg');
    expect(cfg).toContain('set timeout=10');
    expect(cfg).toContain('menuentry "Redemarrer" { reboot }');
  });
  it('grub2-setpassword creates user.cfg', () => {
    sh.run('grub2-setpassword', 'grubpass', 'grubpass');
    expect(sh.readRaw('/boot/grub2/user.cfg')).toMatch(/^GRUB2_PASSWORD=grub\.pbkdf2\.sha512/);
  });
  it('rd.break root password reset sequence', () => {
    sh.enterRdBreak();
    expect(sh.prompt()).toBe('switch_root:/# ');
    sh.run('chroot /sysroot');
    expect(sh.run('passwd', 'Nouveau#Root1', 'Nouveau#Root1')).toContain('lecture seule');
    sh.run('exit');
    sh.enterRdBreak();
    sh.run('mount -o remount,rw /sysroot');
    sh.run('chroot /sysroot');
    expect(sh.prompt()).toBe('sh-5.1# ');
    expect(sh.run('passwd', 'Nouveau#Root1', 'Nouveau#Root1')).toContain('mise à jour réussie');
    sh.run('touch /.autorelabel');
    sh.run('exit');
    sh.run('exit');
    expect(sh.flags.relabeled).toBe(true);
  });
  it('reboot empties /tmp', () => {
    sh.run('touch /tmp/x');
    sh.run('reboot');
    expect(sh.node('/tmp/x')).toBeNull();
  });
});

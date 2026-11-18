import type { CmdFn } from './shell';
import * as F from './cmds/files';
import * as U from './cmds/users';
import * as S from './cmds/system';

/** Registry of all simulated commands. */
export const COMMANDS: Record<string, CmdFn> = {
  // files
  ls: F.ls, pwd: F.pwd, cd: F.cd, mkdir: F.mkdir, rmdir: F.rmdir, touch: F.touch, cp: F.cp, mv: F.mv, rm: F.rm, cat: F.cat, echo: F.echo,
  head: F.head, tail: F.tail, grep: F.grep, cut: F.cut, sort: F.sort, uniq: F.uniq, wc: F.wc, tee: F.tee, find: F.find, du: F.du, df: F.df,
  ln: F.ln, stat: F.stat, file: F.fileCmd, tree: F.tree, less: F.less, more: F.less, realpath: F.realpath, readlink: F.realpath, basename: F.basenameCmd, dirname: F.dirnameCmd,
  // users & permissions
  useradd: U.useradd, usermod: U.usermod, userdel: U.userdel, groupadd: U.groupadd, groupmod: U.groupmod, groupdel: U.groupdel, gpasswd: U.gpasswd,
  passwd: U.passwd, chage: U.chage, whoami: U.whoami, id: U.id, groups: U.groupsCmd, who: U.who, w: U.w, chmod: U.chmod, chown: U.chown, chgrp: U.chgrp,
  umask: U.umask, su: U.su, exit: U.exit, logout: U.exit, sudo: U.sudo, ssh: U.ssh, visudo: U.visudo, vipw: U.vipw, vigr: U.vigr,
  nano: U.editor('nano'), vi: U.editor('vi'), vim: U.editor('vi'), newgrp: U.newgrp, chpasswd: U.chpasswd,
  // system
  systemctl: S.systemctl, journalctl: S.journalctl, 'systemd-analyze': S.systemdAnalyze, rpm: S.rpm, dnf: S.dnf, yum: S.dnf,
  'yum-config-manager': S.yumConfigManager, createrepo: S.createrepo, createrepo_c: S.createrepo, 'grub2-mkconfig': S.grub2Mkconfig, 'grub2-setpassword': S.grub2Setpassword,
  reboot: S.reboot, poweroff: S.reboot, shutdown: S.reboot, halt: S.reboot, runlevel: S.runlevel, telinit: S.telinit, init: S.telinit,
  uname: S.uname, hostname: S.hostname, tty: S.tty, date: S.date, cal: S.cal, uptime: S.uptime, history: S.history, clear: S.clear,
  type: S.typeCmd, which: S.which, whereis: S.whereis, man: S.man, apropos: S.apropos, mandb: S.mandb, ps: S.ps, 'firewall-cmd': S.firewallCmd,
  test: S.test, '[': S.test, env: S.env, printenv: S.env, export: S.exportCmd, free: S.free, lsblk: S.lsblk, mount: S.mount,
  true: S.trueCmd, false: S.falseCmd, sleep: S.sleep, help: S.help, kill: S.kill, restorecon: S.restorecon, load_policy: S.loadPolicy
};

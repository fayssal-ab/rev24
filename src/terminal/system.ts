/** Initial RHEL 9 machine — the "Installation_propre" snapshot of TP1. */
import { dir, file, link, type FNode } from './vfs';
import { fakeCrypt, daysSinceEpoch } from './accounts';

export const KERNEL = '5.14.0-427.13.1.el9_4.x86_64';
export const HOSTNAME = 'rhel9';
export const MACHINE_ID = '4c1e0a8d2f3b4e6a9d7c5b1a3e2f4d6c';

export interface Service {
  name: string;
  desc: string;
  active: 'active' | 'inactive' | 'failed';
  enabled: 'enabled' | 'disabled' | 'static' | 'masked';
  unmaskTo?: 'enabled' | 'disabled' | 'static';
  execStart: string;
  wantedBy: string;
  pid?: number;
  reload?: boolean;
  pkg?: string;
  custom?: boolean;
}

export interface Pkg {
  name: string;
  epoch?: number;
  version: string;
  release: string;
  arch: string;
  summary: string;
  size: number; // KiB
  requires: string[]; // package names
  files: string[];
  config: string[];
  license?: string;
  url?: string;
  repo?: string;
}

export interface DnfTx {
  id: number;
  cmd: string;
  date: number;
  action: string;
  pkgs: { name: string; action: 'Install' | 'Removed' | 'Upgrade' | 'Dep-Install' }[];
}

export interface LogEntry {
  ts: number;
  unit: string;
  prio: number; // 0 emerg .. 7 debug
  msg: string;
  boot: number; // 0 = current, -1 = previous
}

export interface SysState {
  root: FNode;
  services: Record<string, Service>;
  currentTarget: string;
  installed: Record<string, Pkg>;
  repo: Record<string, Pkg>;
  groups: Record<string, { desc: string; pkgs: string[]; installed: boolean }>;
  dnfHistory: DnfTx[];
  journal: LogEntry[];
  bootTime: number;
  repoEnabled: Record<string, boolean>;
  nextPid: number;
}

const ELF = '\u007fELF (binaire simulé)';

function bins(names: string[], mode = 0o755): Record<string, FNode> {
  const o: Record<string, FNode> = {};
  for (const n of names) o[n] = { ...file(ELF, 0, 0, mode), sz: 30000 + ((n.length * 7919) % 120000) };
  return o;
}

export const USR_BIN = [
  'bash', 'sh', 'ls', 'cp', 'mv', 'rm', 'mkdir', 'rmdir', 'touch', 'cat', 'echo', 'pwd', 'head', 'tail', 'grep', 'cut', 'sort', 'wc', 'find', 'tee', 'less', 'more',
  'man', 'whoami', 'who', 'w', 'id', 'groups', 'su', 'sudo', 'passwd', 'chage', 'gpasswd', 'chmod', 'chown', 'chgrp', 'systemctl', 'journalctl', 'rpm', 'dnf', 'yum',
  'uname', 'clear', 'date', 'cal', 'uptime', 'hostname', 'tty', 'which', 'whereis', 'du', 'df', 'ps', 'nano', 'vi', 'vim', 'ssh', 'scp', 'firewall-cmd', 'tar',
  'gzip', 'sed', 'awk', 'gawk', 'ln', 'stat', 'file', 'diff', 'mandb', 'apropos', 'systemd-analyze', 'hostnamectl', 'timedatectl', 'loginctl', 'newgrp', 'test', '[',
  'yum-config-manager', 'mount', 'umount', 'kill', 'top', 'free', 'lsblk', 'env', 'printenv', 'sleep', 'true', 'false', 'basename', 'dirname', 'readlink', 'xargs'
];
export const USR_SBIN = [
  'useradd', 'usermod', 'userdel', 'groupadd', 'groupmod', 'groupdel', 'vipw', 'vigr', 'visudo', 'chpasswd', 'reboot', 'shutdown', 'poweroff', 'halt', 'init',
  'grub2-mkconfig', 'grub2-setpassword', 'grub2-install', 'grubby', 'sshd', 'fdisk', 'mkfs', 'mkfs.xfs', 'parted', 'chroot', 'createrepo', 'load_policy', 'restorecon',
  'ip', 'ss', 'runlevel', 'telinit', 'pwck', 'grpck', 'lvm', 'blkid', 'httpd'
];

const SKEL = {
  '.bash_logout': '# ~/.bash_logout\n',
  '.bash_profile': '# .bash_profile\n\n# Get the aliases and functions\nif [ -f ~/.bashrc ]; then\n\t. ~/.bashrc\nfi\n\n# User specific environment and startup programs\n',
  '.bashrc': '# .bashrc\n\n# Source global definitions\nif [ -f /etc/bashrc ]; then\n\t. /etc/bashrc\nfi\n\n# User specific aliases and functions\n'
};

export function skelDir(): Record<string, FNode> {
  const o: Record<string, FNode> = {};
  for (const [k, v] of Object.entries(SKEL)) o[k] = file(v);
  return o;
}

function homeDir(uid: number, gid: number, extra: Record<string, FNode> = {}): FNode {
  const kids: Record<string, FNode> = {};
  for (const [k, v] of Object.entries(SKEL)) kids[k] = file(v, uid, gid, 0o644);
  return dir(uid, gid, 0o700, { ...kids, ...extra });
}

const PASSWD = `root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
games:x:12:100:games:/usr/games:/sbin/nologin
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
nobody:x:65534:65534:Kernel Overflow User:/:/sbin/nologin
systemd-coredump:x:999:997:systemd Core Dumper:/:/sbin/nologin
dbus:x:81:81:System message bus:/:/sbin/nologin
polkitd:x:998:996:User for polkitd:/:/sbin/nologin
tss:x:59:59:Account used for TPM access:/dev/null:/sbin/nologin
sshd:x:74:74:Privilege-separated SSH:/usr/share/empty.sshd:/sbin/nologin
chrony:x:997:994:chrony system user:/var/lib/chrony:/sbin/nologin
etudiant:x:1000:1000:Etudiant 4IIR:/home/etudiant:/bin/bash
`;

const GROUP = `root:x:0:
bin:x:1:
daemon:x:2:
sys:x:3:
adm:x:4:
tty:x:5:
disk:x:6:
lp:x:7:
mem:x:8:
kmem:x:9:
wheel:x:10:etudiant
cdrom:x:11:
mail:x:12:
man:x:15:
dialout:x:18:
floppy:x:19:
games:x:20:
tape:x:33:
video:x:39:
ftp:x:50:
lock:x:54:
audio:x:63:
users:x:100:
nobody:x:65534:
utmp:x:22:
input:x:999:
kvm:x:36:
render:x:998:
systemd-journal:x:190:
systemd-coredump:x:997:
dbus:x:81:
polkitd:x:996:
ssh_keys:x:995:
tss:x:59:
sshd:x:74:
chrony:x:994:
etudiant:x:1000:
`;

function shadowFile(): string {
  const d = daysSinceEpoch() - 30;
  const sys = ['bin', 'daemon', 'adm', 'lp', 'sync', 'shutdown', 'halt', 'mail', 'operator', 'games', 'ftp', 'nobody', 'systemd-coredump', 'dbus', 'polkitd', 'tss', 'sshd', 'chrony'];
  return (
    [`root:${fakeCrypt('redhat')}:${d}:0:99999:7:::`, ...sys.map((n) => `${n}:*:${d}:0:99999:7:::`), `etudiant:${fakeCrypt('etudiant')}:${d}:0:99999:7:::`].join('\n') + '\n'
  );
}

function gshadowFile(): string {
  return GROUP.trim()
    .split('\n')
    .map((l) => {
      const [n, , , m] = l.split(':');
      return `${n}:!::${m ?? ''}`;
    })
    .join('\n') + '\n';
}

export const DEFAULT_USERADD = `# useradd defaults file
GROUP=100
HOME=/home
INACTIVE=-1
EXPIRE=
SHELL=/bin/bash
SKEL=/etc/skel
CREATE_MAIL_SPOOL=yes
`;

export const LOGIN_DEFS = `#
# Please note that the parameters in this configuration file control the
# behavior of the tools from the shadow-utils component.
#
MAIL_DIR	/var/spool/mail

# Password aging controls:
#	PASS_MAX_DAYS	Maximum number of days a password may be used.
#	PASS_MIN_DAYS	Minimum number of days allowed between password changes.
#	PASS_MIN_LEN	Minimum acceptable password length.
#	PASS_WARN_AGE	Number of days warning given before a password expires.
PASS_MAX_DAYS	99999
PASS_MIN_DAYS	0
PASS_MIN_LEN	5
PASS_WARN_AGE	7

# Min/max values for automatic uid selection in useradd(8)
UID_MIN                  1000
UID_MAX                 60000
SYS_UID_MIN               201
SYS_UID_MAX               999

# Min/max values for automatic gid selection in groupadd(8)
GID_MIN                  1000
GID_MAX                 60000
SYS_GID_MIN               201
SYS_GID_MAX               999

# If useradd(8) should create home directories for users by default
CREATE_HOME	yes

# The permission mask is initialized to this value.
UMASK		077

# This enables userdel to remove user groups if no members exist.
USERGROUPS_ENAB yes

# Use SHA512 to encrypt password.
ENCRYPT_METHOD SHA512
`;

export const SUDOERS = `## Sudoers allows particular users to run various commands as
## the root user, without needing the root password.
##
## This file must be edited with the 'visudo' command.

Defaults   !visiblepw
Defaults    always_set_home
Defaults    match_group_by_gid
Defaults    env_reset
Defaults    secure_path = /sbin:/bin:/usr/sbin:/usr/bin

## Next comes the main part: which users can run what software on
## which machines (the sudoers file can be shared between multiple
## systems).
## Syntax:
##
## 	user	MACHINE=COMMANDS
##
## Allow root to run any commands anywhere
root	ALL=(ALL) 	ALL

## Allows people in group wheel to run all commands
%wheel	ALL=(ALL)	ALL

## Same thing without a password
# %wheel	ALL=(ALL)	NOPASSWD: ALL

## Read drop-in files from /etc/sudoers.d (the # here does not mean a comment)
#includedir /etc/sudoers.d
`;

export const DEFAULT_GRUB = `GRUB_TIMEOUT=5
GRUB_DISTRIBUTOR="$(sed 's, release .*$,,g' /etc/system-release)"
GRUB_DEFAULT=saved
GRUB_DISABLE_SUBMENU=true
GRUB_TERMINAL_OUTPUT="console"
GRUB_CMDLINE_LINUX="crashkernel=1G-4G:192M,4G-64G:256M,64G-:512M resume=/dev/mapper/rhel-swap rd.lvm.lv=rhel/root rd.lvm.lv=rhel/swap rhgb quiet"
GRUB_DISABLE_RECOVERY="true"
GRUB_ENABLE_BLSCFG=true
`;

const GRUB_D: Record<string, string> = {
  '00_header': '#! /usr/bin/sh\nset -e\n# grub-mkconfig helper script.\n# En-tête : variables, timeout, menu...\n',
  '01_users': '#!/usr/bin/sh -e\n# Mot de passe GRUB (lit /boot/grub2/user.cfg)\nif [ -f ${prefix}/user.cfg ]; then\n  source ${prefix}/user.cfg\nfi\n',
  '08_fallback_counting': '#! /usr/bin/sh -e\n',
  '10_linux': '#! /usr/bin/sh\nset -e\n# Génère les entrées des noyaux Linux (BLS : /boot/loader/entries/)\n',
  '20_linux_xen': '#! /usr/bin/sh\nset -e\n',
  '30_os-prober': '#! /usr/bin/sh\nset -e\n# Détecte les autres systèmes (dual boot)\n',
  '30_uefi-firmware': '#! /usr/bin/sh\nset -e\n# Ajoute l\'entrée "UEFI Firmware Settings"\n',
  '40_custom': '#!/usr/bin/sh\nexec tail -n +3 $0\n# This file provides an easy way to add custom menu entries.  Simply type the\n# menu entries you want to add after this comment.  Be careful not to change\n# the \'exec tail\' line above.\n',
  '41_custom': '#!/usr/bin/sh\ncat <<EOF\nif [ -f  ${config_directory}/custom.cfg ]; then\n  source ${config_directory}/custom.cfg\nfi\nEOF\n'
};

export function grubCfg(defaultGrub: string, custom40: string, hasUserCfg: boolean): string {
  const get = (k: string, d: string) => {
    const m = new RegExp(`^${k}=(.*)$`, 'm').exec(defaultGrub);
    return m ? m[1].replace(/^"|"$/g, '') : d;
  };
  const customEntries = custom40.split('\n').slice(2).filter((l) => !l.startsWith('#')).join('\n').trim();
  return `#
# DO NOT EDIT THIS FILE
#
# It is automatically generated by grub2-mkconfig using templates
# from /etc/grub.d and settings from /etc/default/grub
#

### BEGIN /etc/grub.d/00_header ###
set pager=1
if [ -f \${config_directory}/grubenv ]; then
  load_env -f \${config_directory}/grubenv
fi
set default="${get('GRUB_DEFAULT', 'saved') === 'saved' ? '${saved_entry}' : get('GRUB_DEFAULT', '0')}"
terminal_output ${get('GRUB_TERMINAL_OUTPUT', 'console')}
if [ x$feature_timeout_style = xy ] ; then
  set timeout_style=${get('GRUB_TIMEOUT_STYLE', 'menu')}
  set timeout=${get('GRUB_TIMEOUT', '5')}
else
  set timeout=${get('GRUB_TIMEOUT', '5')}
fi
### END /etc/grub.d/00_header ###

### BEGIN /etc/grub.d/01_users ###
if [ -f \${prefix}/user.cfg ]; then
  source \${prefix}/user.cfg
  if [ -n "\${GRUB2_PASSWORD}" ]; then
    set superusers="root"
    export superusers
    password_pbkdf2 root \${GRUB2_PASSWORD}
  fi
fi
### END /etc/grub.d/01_users ###${hasUserCfg ? '\n# (protection par mot de passe active : /boot/grub2/user.cfg présent)' : ''}

### BEGIN /etc/grub.d/10_linux ###
insmod part_gpt
insmod xfs
set root='hd0,gpt2'
# kernel cmdline: ${get('GRUB_CMDLINE_LINUX', '')}
insmod blscfg
blscfg
### END /etc/grub.d/10_linux ###

### BEGIN /etc/grub.d/30_uefi-firmware ###
if [ "$grub_platform" = "efi" ]; then
	menuentry 'UEFI Firmware Settings' $menuentry_id_option 'uefi-firmware' {
		fwsetup
	}
fi
### END /etc/grub.d/30_uefi-firmware ###

### BEGIN /etc/grub.d/40_custom ###
${customEntries}
### END /etc/grub.d/40_custom ###
`;
}

const OS_RELEASE = `NAME="Red Hat Enterprise Linux"
VERSION="9.4 (Plow)"
ID="rhel"
ID_LIKE="fedora"
VERSION_ID="9.4"
PLATFORM_ID="platform:el9"
PRETTY_NAME="Red Hat Enterprise Linux 9.4 (Plow)"
ANSI_COLOR="0;31"
HOME_URL="https://www.redhat.com/"
`;

const SERVICES_FILE = `# /etc/services:
# service-name  port/protocol  [aliases ...]   [# comment]
tcpmux          1/tcp                           # TCP port service multiplexer
echo            7/tcp
ftp-data        20/tcp
ftp             21/tcp
ssh             22/tcp                          # The Secure Shell (SSH) Protocol
telnet          23/tcp
smtp            25/tcp          mail
domain          53/tcp                          # name-domain server
domain          53/udp
http            80/tcp          www www-http    # WorldWideWeb HTTP
pop3            110/tcp         pop-3           # POP version 3
ntp             123/udp                         # Network Time Protocol
imap            143/tcp         imap2           # Interim Mail Access Proto v2
https           443/tcp                         # http protocol over TLS/SSL
mysql           3306/tcp                        # MySQL
`;

function makeLog(lines: number, unit: string): string {
  const out: string[] = [];
  for (let i = 0; i < lines; i++) out.push(`Nov 18 08:${String(i % 60).padStart(2, '0')}:12 rhel9 ${unit}[${1000 + i}]: message ${i}`);
  return out.join('\n') + '\n';
}

const pk = (
  name: string,
  version: string,
  release: string,
  summary: string,
  opts: Partial<Pkg> = {}
): Pkg => ({ name, version, release, arch: 'x86_64', summary, size: 1000 + ((name.length * 977) % 9000), requires: [], files: [], config: [], ...opts });

export function basePackages(): Record<string, Pkg> {
  const list: Pkg[] = [
    pk('bash', '5.1.8', '9.el9', 'The GNU Bourne Again shell', { files: ['/usr/bin/bash', '/usr/bin/sh'], config: ['/etc/skel/.bashrc', '/etc/skel/.bash_profile', '/etc/skel/.bash_logout'], license: 'GPLv3+' }),
    pk('coreutils', '8.32', '35.el9', 'A set of basic GNU tools commonly used in shell scripts', {
      files: ['/usr/bin/ls', '/usr/bin/cp', '/usr/bin/mv', '/usr/bin/rm', '/usr/bin/mkdir', '/usr/bin/cat', '/usr/bin/touch', '/usr/bin/chmod', '/usr/bin/chown', '/usr/bin/head', '/usr/bin/tail', '/usr/bin/cut', '/usr/bin/sort', '/usr/bin/wc', '/usr/bin/id', '/usr/bin/whoami', '/usr/bin/pwd', '/usr/bin/echo', '/usr/bin/tee', '/usr/bin/du', '/usr/bin/df', '/usr/bin/date', '/usr/bin/uname'],
      license: 'GPLv3+'
    }),
    pk('kernel-core', '5.14.0', '427.13.1.el9_4', 'The Linux kernel', { files: [`/boot/vmlinuz-${KERNEL}`, `/lib/modules/${KERNEL}`], license: 'GPLv2' }),
    pk('kernel', '5.14.0', '427.13.1.el9_4', 'The Linux kernel, based on version 5.14.0, heavily modified with backports', { requires: ['kernel-core'] }),
    pk('setup', '2.13.7', '10.el9', 'A set of system configuration and setup files', { arch: 'noarch', files: ['/etc/passwd', '/etc/group', '/etc/services', '/etc/hosts', '/etc/shells'], config: ['/etc/passwd', '/etc/group', '/etc/services', '/etc/hosts', '/etc/shells'] }),
    pk('shadow-utils', '4.9', '8.el9', 'Utilities for managing accounts and shadow password files', {
      epoch: 2,
      files: ['/usr/sbin/useradd', '/usr/sbin/usermod', '/usr/sbin/userdel', '/usr/sbin/groupadd', '/usr/sbin/groupmod', '/usr/sbin/groupdel', '/usr/bin/gpasswd', '/usr/bin/chage', '/usr/sbin/vipw', '/usr/sbin/vigr', '/etc/login.defs', '/etc/default/useradd'],
      config: ['/etc/default/useradd', '/etc/login.defs']
    }),
    pk('passwd', '0.80', '12.el9', 'An utility for setting or changing passwords using PAM', { files: ['/usr/bin/passwd'], config: ['/etc/pam.d/passwd'] }),
    pk('sudo', '1.9.5p2', '10.el9_3', 'Allows restricted root access for specified users', { files: ['/usr/bin/sudo', '/usr/sbin/visudo', '/etc/sudoers'], config: ['/etc/sudoers', '/etc/sudo.conf'] }),
    pk('systemd', '252', '32.el9_4', 'System and Service Manager', { files: ['/usr/bin/systemctl', '/usr/bin/journalctl', '/usr/lib/systemd/systemd', '/usr/bin/systemd-analyze'], config: ['/etc/systemd/system.conf', '/etc/systemd/journald.conf'] }),
    pk('openssh-server', '8.7p1', '38.el9', 'An open source SSH server daemon', { files: ['/usr/sbin/sshd'], config: ['/etc/ssh/sshd_config'], requires: ['openssh'] }),
    pk('openssh', '8.7p1', '38.el9', 'An open source implementation of SSH protocol version 2', { files: ['/usr/bin/ssh-keygen'] }),
    pk('openssh-clients', '8.7p1', '38.el9', 'An open source SSH client applications', { files: ['/usr/bin/ssh', '/usr/bin/scp'], config: ['/etc/ssh/ssh_config'] }),
    pk('grub2-tools', '2.06', '77.el9', 'Support tools for GRUB.', { epoch: 1, files: ['/usr/sbin/grub2-mkconfig', '/usr/sbin/grub2-setpassword', '/etc/grub.d/00_header', '/etc/grub.d/10_linux', '/etc/grub.d/40_custom'], config: ['/etc/default/grub', '/etc/grub.d/40_custom'] }),
    pk('grub2-common', '2.06', '77.el9', 'grub2 common layout', { arch: 'noarch', epoch: 1 }),
    pk('grub2-efi-x64', '2.06', '77.el9', 'GRUB for EFI systems.', { epoch: 1, files: ['/boot/efi/EFI/redhat/grub.cfg'] }),
    pk('rpm', '4.16.1.3', '29.el9', 'The RPM package management system', { files: ['/usr/bin/rpm'] }),
    pk('dnf', '4.14.0', '9.el9', 'Package manager', { arch: 'noarch', files: ['/usr/bin/dnf', '/usr/bin/yum'], config: ['/etc/dnf/dnf.conf'] }),
    pk('yum', '4.14.0', '9.el9', 'Package manager', { arch: 'noarch', requires: ['dnf'] }),
    pk('dnf-plugins-core', '4.3.0', '13.el9', 'Core Plugins for DNF', { arch: 'noarch', files: ['/usr/bin/yum-config-manager'] }),
    pk('file-libs', '5.39', '16.el9', 'Libraries for applications using libmagic', { files: ['/usr/share/magic', '/usr/lib64/libmagic.so.1'] }),
    pk('file', '5.39', '16.el9', 'Utility for determining file types', { files: ['/usr/bin/file'], requires: ['file-libs'] }),
    pk('util-linux', '2.37.4', '18.el9', 'A collection of basic system utilities', { files: ['/usr/bin/mount', '/usr/bin/su', '/usr/bin/lsblk'] }),
    pk('vim-minimal', '8.2.2637', '20.el9_1', 'A minimal version of the VIM editor', { epoch: 2, files: ['/usr/bin/vi'] }),
    pk('nano', '5.6.1', '5.el9', 'A small text editor', { files: ['/usr/bin/nano'], config: ['/etc/nanorc'] }),
    pk('firewalld', '1.3.4', '1.el9', 'A firewall daemon with D-Bus interface providing a dynamic firewall', { arch: 'noarch', files: ['/usr/bin/firewall-cmd'], config: ['/etc/firewalld/firewalld.conf'] }),
    pk('chrony', '4.5', '1.el9', 'An NTP client/server', { config: ['/etc/chrony.conf'] }),
    pk('cronie', '1.5.7', '11.el9', 'Cron daemon for executing programs at set times', { config: ['/etc/sysconfig/crond'] }),
    pk('NetworkManager', '1.46.0', '4.el9_4', 'Network connection manager and user applications', { epoch: 1 }),
    pk('glibc', '2.34', '100.el9_4.2', 'The GNU libc libraries', {}),
    pk('findutils', '4.8.0', '6.el9', 'The GNU versions of find utilities (find and xargs)', { epoch: 1, files: ['/usr/bin/find', '/usr/bin/xargs'] }),
    pk('grep', '3.6', '5.el9', 'Pattern matching utilities', { files: ['/usr/bin/grep'] }),
    pk('sed', '4.8', '9.el9', 'A GNU stream text editor', { files: ['/usr/bin/sed'] }),
    pk('gawk', '5.1.0', '6.el9', 'The GNU version of the AWK text processing utility', { files: ['/usr/bin/awk', '/usr/bin/gawk'] }),
    pk('tar', '1.34', '6.el9_4.1', 'GNU file archiving program', { epoch: 2, files: ['/usr/bin/tar'] }),
    pk('less', '590', '4.el9_4', 'A text file browser similar to more, but better', { files: ['/usr/bin/less'] }),
    pk('man-db', '2.9.3', '7.el9', 'Tools for searching and reading man pages', { files: ['/usr/bin/man', '/usr/bin/mandb', '/usr/bin/apropos'] }),
    pk('procps-ng', '3.3.17', '14.el9', 'System and process monitoring utilities', { files: ['/usr/bin/ps', '/usr/bin/w', '/usr/bin/uptime', '/usr/bin/free', '/usr/bin/top'] }),
    pk('which', '2.21', '29.el9', 'Displays where a particular program in your path is located', { files: ['/usr/bin/which'] }),
    pk('hostname', '3.23', '6.el9', 'Utility to set/show the host name or domain name', { files: ['/usr/bin/hostname'] }),
    pk('policycoreutils', '3.6', '2.1.el9', 'SELinux policy core utilities', { files: ['/usr/sbin/restorecon', '/usr/sbin/load_policy'] }),
    pk('selinux-policy-targeted', '38.1.35', '2.el9_4', 'SELinux targeted policy', { arch: 'noarch' }),
    pk('cups', '2.3.3op2', '24.el9', 'CUPS printing system', { epoch: 1, config: ['/etc/cups/cupsd.conf'] }),
    pk('bluez', '5.64', '2.el9', 'Bluetooth utilities', {}),
    pk('postfix', '3.5.9', '24.el9', 'Postfix Mail Transport Agent', { epoch: 2, config: ['/etc/postfix/main.cf'] }),
    pk('rsyslog', '8.2310.0', '4.el9', 'Enhanced system logging and kernel message trapping daemon', { config: ['/etc/rsyslog.conf'] }),
    pk('audit', '3.1.2', '2.el9', 'User space tools for kernel auditing', { config: ['/etc/audit/auditd.conf'] }),
    pk('kexec-tools', '2.0.27', '8.el9', 'The kexec/kdump userspace component', { config: ['/etc/kdump.conf'] }),
    pk('tuned', '2.22.1', '1.el9', 'A dynamic adaptive system tuning daemon', { arch: 'noarch' }),
    pk('dracut', '057', '53.git20240104.el9', 'Initramfs generator using udev', { files: ['/usr/bin/dracut'] }),
    pk('gdm', '40.1', '23.el9', 'The GNOME Display Manager', { epoch: 1 }),
    pk('gnome-shell', '40.10', '17.el9', 'Window management and application launching for GNOME', {}),
    pk('firefox', '115.10.0', '1.el9_4', 'Mozilla Firefox Web browser', {}),
    pk('python3', '3.9.18', '3.el9_4.1', 'Python 3.9 interpreter', { files: ['/usr/bin/python3'] }),
    pk('xfsprogs', '6.3.0', '1.el9', 'Utilities for managing the XFS filesystem', {}),
    pk('lvm2', '2.03.23', '2.el9', 'Userland logical volume management tools', { epoch: 9 }),
    pk('openssl', '3.0.7', '27.el9', 'Utilities from the general purpose cryptography library with TLS implementation', { epoch: 1 }),
    pk('iproute', '6.2.0', '6.el9_4', 'Advanced IP routing and network device configuration tools', { files: ['/usr/sbin/ip', '/usr/sbin/ss'] })
  ];
  const filler = `acl attr audit-libs basesystem bzip2-libs ca-certificates cracklib cracklib-dicts curl cyrus-sasl-lib dbus dbus-libs device-mapper e2fsprogs elfutils-libs expat filesystem gdbm-libs gmp gnupg2 gnutls gzip iputils json-c kbd kbd-misc keyutils-libs kmod kmod-libs krb5-libs libacl libattr libblkid libcap libcap-ng libcom_err libcurl libdb libeconf libffi libgcc libgcrypt libgpg-error libidn2 libmount libnghttp2 libnl3 libpwquality libselinux libsemanage libsepol libsigsegv libsmartcols libssh libstdc++ libtasn1 libunistring libuuid libverto libxcrypt libxml2 libyaml libzstd linux-firmware lua-libs lz4-libs microcode_ctl mpfr ncurses ncurses-base ncurses-libs nettle npth openldap openssl-libs p11-kit p11-kit-trust pam parted pcre pcre2 pcre2-syntax popt python3-dnf python3-hawkey python3-libdnf python3-libs python3-pip-wheel python3-rpm python3-setuptools-wheel readline rpm-build-libs rpm-libs rpm-plugin-selinux rpm-sign-libs sqlite-libs sssd-client systemd-libs systemd-pam systemd-udev tzdata xz xz-libs zlib authselect authselect-libs crypto-policies cronie-anacron crontabs dhcp-client diffutils ethtool hwdata initscripts-service iptables-libs irqbalance kpartx less libdnf librepo libsolv libuser lshw lsof mdadm net-tools newt nftables os-prober pciutils pigz psmisc python3-firewall python3-gobject-base python3-nftables qemu-guest-agent rootfiles shared-mime-info slang squashfs-tools sssd-common teamd usermode xfsdump`;
  const out: Record<string, Pkg> = {};
  for (const p of list) out[p.name] = p;
  for (const n of filler.split(/\s+/)) if (!out[n]) out[n] = pk(n, '1.0', '1.el9', `${n} (paquet système)`, {});
  return out;
}

export function repoPackages(): Record<string, Pkg> {
  const r = (p: Pkg) => ({ ...p, repo: p.repo ?? 'rhel-9-for-x86_64-appstream-rpms' });
  const list: Pkg[] = [
    pk('wireshark', '3.4.10', '7.el9', 'Network traffic analyzer', { epoch: 1, requires: ['wireshark-cli', 'qt5-qtbase', 'qt5-qtbase-gui', 'qt5-qtmultimedia', 'libpcap', 'libsmi', 'c-ares'], files: ['/usr/bin/wireshark'] }),
    pk('wireshark-cli', '3.4.10', '7.el9', 'Network traffic analyzer (CLI)', { epoch: 1, requires: ['libpcap', 'libsmi', 'c-ares'], files: ['/usr/bin/tshark', '/usr/bin/dumpcap'] }),
    pk('qt5-qtbase', '5.15.9', '10.el9_4', 'Qt5 - QtBase components', { requires: ['qt5-qtbase-common'], files: ['/usr/lib64/libQt5Core.so.5'] }),
    pk('qt5-qtbase-common', '5.15.9', '10.el9_4', 'Common files for Qt5', { arch: 'noarch' }),
    pk('qt5-qtbase-gui', '5.15.9', '10.el9_4', 'Qt5 GUI-related libraries', { requires: ['qt5-qtbase'] }),
    pk('qt5-qtmultimedia', '5.15.9', '1.el9', 'Qt5 - Multimedia support', { requires: ['qt5-qtbase'] }),
    pk('libpcap', '1.10.0', '4.el9', 'A system-independent interface for user-level packet capture', { epoch: 14, repo: 'rhel-9-for-x86_64-baseos-rpms' }),
    pk('libsmi', '0.4.8', '28.el9', 'A library to access SMI MIB information', {}),
    pk('c-ares', '1.19.1', '1.el9', 'A library that performs asynchronous DNS operations', { repo: 'rhel-9-for-x86_64-baseos-rpms' }),
    pk('httpd', '2.4.57', '8.el9', 'Apache HTTP Server', { requires: ['httpd-core', 'httpd-filesystem', 'httpd-tools', 'apr', 'apr-util', 'mod_lua', 'redhat-logos-httpd'], files: ['/usr/sbin/httpd', '/var/www/html'], config: ['/etc/httpd/conf/httpd.conf'] }),
    pk('httpd-core', '2.4.57', '8.el9', 'httpd minimal core', { requires: ['httpd-filesystem', 'httpd-tools', 'apr', 'apr-util'] }),
    pk('httpd-filesystem', '2.4.57', '8.el9', 'The basic directory layout for the Apache HTTP Server', { arch: 'noarch' }),
    pk('httpd-tools', '2.4.57', '8.el9', 'Tools for use with the Apache HTTP Server', { requires: ['apr', 'apr-util'] }),
    pk('apr', '1.7.0', '12.el9_3', 'Apache Portable Runtime library', {}),
    pk('apr-util', '1.6.1', '23.el9', 'Apache Portable Runtime Utility library', { requires: ['apr'] }),
    pk('mod_lua', '2.4.57', '8.el9', 'Lua language module for the Apache HTTP server', {}),
    pk('redhat-logos-httpd', '90.4', '2.el9', 'Red Hat Enterprise Linux-related icons and pictures used by httpd', { arch: 'noarch', repo: 'rhel-9-for-x86_64-baseos-rpms' }),
    pk('mod_ssl', '2.4.57', '8.el9', 'SSL/TLS module for the Apache HTTP Server', { epoch: 1, requires: ['httpd'] }),
    pk('createrepo_c', '0.20.1', '2.el9', 'Creates a common metadata repository', { requires: ['createrepo_c-libs'], files: ['/usr/bin/createrepo_c', '/usr/bin/createrepo'] }),
    pk('createrepo_c-libs', '0.20.1', '2.el9', 'Library for repodata manipulation', {}),
    pk('tree', '1.8.0', '10.el9', 'File system tree viewer', { files: ['/usr/bin/tree'], repo: 'rhel-9-for-x86_64-baseos-rpms' }),
    pk('zsh', '5.8', '9.el9', 'Powerful interactive shell', { files: ['/usr/bin/zsh'], repo: 'rhel-9-for-x86_64-baseos-rpms' }),
    pk('git-core', '2.43.0', '1.el9', 'Core package of git with minimal functionality', { files: ['/usr/bin/git'] }),
    pk('nmap', '7.92', '2.el9', 'Network exploration tool and security scanner', { epoch: 3, files: ['/usr/bin/nmap'] }),
    pk('vim-enhanced', '8.2.2637', '20.el9_1', 'A version of the VIM editor which includes recent enhancements', { epoch: 2, requires: ['vim-common', 'gpm-libs'], files: ['/usr/bin/vim'] }),
    pk('vim-common', '8.2.2637', '20.el9_1', 'The common files needed by any version of the VIM editor', { epoch: 2 }),
    pk('gpm-libs', '1.20.7', '29.el9', 'Dynamic library for gpm', {}),
    pk('mc', '4.8.26', '5.el9', 'User-friendly text console file manager and visual shell', { epoch: 1 }),
    pk('lsof', '4.94.0', '3.el9', 'A utility which lists open files on a Linux/UNIX system', { repo: 'rhel-9-for-x86_64-baseos-rpms' }),
    pk('sysstat', '12.5.4', '7.el9', 'Collection of performance monitoring tools for Linux', {}),
    pk('strace', '6.3', '2.el9', 'Tracks and displays system calls associated with a running process', {}),
    pk('mariadb-server', '10.5.22', '1.el9_2', 'The MariaDB server and related files', { epoch: 3 })
  ];
  const out: Record<string, Pkg> = {};
  for (const p of list) out[p.name] = r(p);
  return out;
}

export const PKG_GROUPS: Record<string, { desc: string; pkgs: string[] }> = {
  'System Tools': { desc: 'Cette catégorie de paquets regroupe divers utilitaires système pour l\'administration de votre système.', pkgs: ['nmap', 'tree', 'zsh', 'mc', 'lsof', 'sysstat', 'strace'] },
  'Development Tools': { desc: 'Environnement de développement de base.', pkgs: ['git-core', 'strace'] },
  'Basic Web Server': { desc: 'Ces outils permettent d\'exécuter un serveur Web sur le système.', pkgs: ['httpd', 'mod_ssl'] },
  'Console Internet Tools': { desc: 'Outils Internet en mode console.', pkgs: ['lsof'] },
  'Security Tools': { desc: 'Outils de sécurité pour l\'intégrité et la vérification de confiance.', pkgs: ['nmap'] },
  'Network Servers': { desc: 'Serveurs réseau.', pkgs: ['mariadb-server'] },
  'Graphical Administration Tools': { desc: 'Outils graphiques d\'administration système.', pkgs: ['wireshark'] }
};

export function baseServices(): Record<string, Service> {
  const s = (name: string, desc: string, active: Service['active'], enabled: Service['enabled'], execStart: string, pkg: string, reload = true): Service => ({
    name,
    desc,
    active,
    enabled,
    execStart,
    wantedBy: 'multi-user.target',
    pkg,
    reload,
    pid: active === 'active' ? 700 + ((name.length * 37) % 300) : undefined
  });
  const list = [
    s('sshd', 'OpenSSH server daemon', 'active', 'enabled', '/usr/sbin/sshd -D $OPTIONS', 'openssh-server'),
    s('firewalld', 'firewalld - dynamic firewall daemon', 'active', 'enabled', '/usr/sbin/firewalld --nofork --nopid $FIREWALLD_ARGS', 'firewalld'),
    s('crond', 'Command Scheduler', 'active', 'enabled', '/usr/sbin/crond -n $CRONDARGS', 'cronie'),
    s('chronyd', 'NTP client/server', 'active', 'enabled', '/usr/sbin/chronyd $OPTIONS', 'chrony', false),
    s('NetworkManager', 'Network Manager', 'active', 'enabled', '/usr/sbin/NetworkManager --no-daemon', 'NetworkManager'),
    s('rsyslog', 'System Logging Service', 'active', 'enabled', '/usr/sbin/rsyslogd -n $SYSLOGD_OPTIONS', 'rsyslog'),
    s('auditd', 'Security Auditing Service', 'active', 'enabled', '/sbin/auditd', 'audit'),
    s('cups', 'CUPS Scheduler', 'active', 'enabled', '/usr/sbin/cupsd -l', 'cups'),
    s('tuned', 'Dynamic System Tuning Daemon', 'active', 'enabled', '/usr/sbin/tuned -l -P', 'tuned'),
    s('gdm', 'GNOME Display Manager', 'active', 'enabled', '/usr/sbin/gdm', 'gdm'),
    s('kdump', 'Crash recovery kernel arming', 'failed', 'enabled', '/usr/bin/kdumpctl start', 'kexec-tools', false),
    s('bluetooth', 'Bluetooth service', 'inactive', 'disabled', '/usr/libexec/bluetooth/bluetoothd', 'bluez'),
    s('postfix', 'Postfix Mail Transport Agent', 'inactive', 'disabled', '/usr/sbin/postfix start', 'postfix'),
    s('atd', 'Deferred execution scheduler', 'inactive', 'disabled', '/usr/sbin/atd -f $OPTS', 'at')
  ];
  const out: Record<string, Service> = {};
  for (const x of list) out[x.name] = x;
  out['systemd-journald'] = { ...s('systemd-journald', 'Journal Service', 'active', 'static', '/usr/lib/systemd/systemd-journald', 'systemd'), pid: 612 };
  return out;
}

export const TARGETS: Record<string, { desc: string; active: boolean }> = {
  'basic.target': { desc: 'Basic System', active: true },
  'cryptsetup.target': { desc: 'Local Encrypted Volumes', active: true },
  'getty.target': { desc: 'Login Prompts', active: true },
  'graphical.target': { desc: 'Graphical Interface', active: true },
  'local-fs-pre.target': { desc: 'Preparation for Local File Systems', active: true },
  'local-fs.target': { desc: 'Local File Systems', active: true },
  'multi-user.target': { desc: 'Multi-User System', active: true },
  'network-online.target': { desc: 'Network is Online', active: true },
  'network.target': { desc: 'Network', active: true },
  'nss-user-lookup.target': { desc: 'User and Group Name Lookups', active: true },
  'paths.target': { desc: 'Path Units', active: true },
  'remote-fs.target': { desc: 'Remote File Systems', active: true },
  'slices.target': { desc: 'Slice Units', active: true },
  'sockets.target': { desc: 'Socket Units', active: true },
  'swap.target': { desc: 'Swaps', active: true },
  'sysinit.target': { desc: 'System Initialization', active: true },
  'timers.target': { desc: 'Timer Units', active: true },
  'rescue.target': { desc: 'Rescue Mode', active: false },
  'emergency.target': { desc: 'Emergency Mode', active: false },
  'poweroff.target': { desc: 'System Power Off', active: false },
  'reboot.target': { desc: 'Reboot', active: false }
};

export const RUNLEVEL_TARGET: Record<string, string> = {
  '0': 'poweroff.target',
  '1': 'rescue.target',
  '2': 'multi-user.target',
  '3': 'multi-user.target',
  '4': 'multi-user.target',
  '5': 'graphical.target',
  '6': 'reboot.target'
};

function baseJournal(boot: number): LogEntry[] {
  const t0 = boot;
  const e = (dt: number, unit: string, prio: number, msg: string, b = 0): LogEntry => ({ ts: t0 + dt * 1000, unit, prio, msg, boot: b });
  return [
    e(-86400, 'kernel', 6, `Linux version ${KERNEL} (mockbuild@x86-vm-07) (gcc 11.4.1) #1 SMP PREEMPT_DYNAMIC`, -1),
    e(-86300, 'sshd.service', 6, 'Server listening on 0.0.0.0 port 22.', -1),
    e(0, 'kernel', 6, `Linux version ${KERNEL} (mockbuild@x86-vm-07) (gcc 11.4.1) #1 SMP PREEMPT_DYNAMIC`),
    e(0, 'kernel', 6, 'Command line: BOOT_IMAGE=(hd0,gpt2)/vmlinuz-' + KERNEL + ' root=/dev/mapper/rhel-root ro rhgb quiet'),
    e(1, 'systemd', 6, 'systemd 252-32.el9_4 running in system mode'),
    e(1, 'systemd', 6, 'Detected virtualization vmware.'),
    e(2, 'systemd', 6, 'Reached target Local File Systems.'),
    e(3, 'kernel', 4, 'ACPI: \\_SB_.PCI0: _OSC failed (AE_NOT_FOUND)'),
    e(3, 'systemd', 6, 'Reached target Basic System.'),
    e(4, 'NetworkManager.service', 6, '<info>  NetworkManager (version 1.46.0-4.el9_4) is starting...'),
    e(5, 'sshd.service', 6, 'Server listening on 0.0.0.0 port 22.'),
    e(5, 'sshd.service', 6, 'Server listening on :: port 22.'),
    e(5, 'firewalld.service', 6, 'Started firewalld - dynamic firewall daemon.'),
    e(6, 'kdump.service', 3, 'kdump: No memory reserved for crash kernel'),
    e(6, 'kdump.service', 3, 'kdump.service: Failed with result \'exit-code\'.'),
    e(6, 'systemd', 3, 'Failed to start Crash recovery kernel arming.'),
    e(7, 'crond.service', 6, '(CRON) INFO (running with inotify support)'),
    e(8, 'systemd', 6, 'Reached target Multi-User System.'),
    e(9, 'gdm.service', 6, 'Started GNOME Display Manager.'),
    e(9, 'systemd', 6, 'Reached target Graphical Interface.'),
    e(30, 'sshd.service', 6, 'Accepted password for etudiant from 192.168.56.1 port 51234 ssh2'),
    e(31, 'sshd.service', 5, 'pam_unix(sshd:session): session opened for user etudiant(uid=1000) by (uid=0)'),
    e(60, 'sshd.service', 4, 'Failed password for root from 192.168.56.20 port 40122 ssh2'),
    e(61, 'sshd.service', 3, 'error: maximum authentication attempts exceeded for root from 192.168.56.20 port 40122 ssh2'),
    e(120, 'chronyd.service', 6, 'Selected source 162.159.200.1 (2.rhel.pool.ntp.org)'),
    e(200, 'systemd', 6, 'Started Session 3 of User etudiant.')
  ];
}

export function initialState(): SysState {
  const bootTime = Date.now() - 3 * 3600 * 1000 - 12 * 60 * 1000;
  const etc = dir(0, 0, 0o755, {
    passwd: file(PASSWD),
    shadow: file(shadowFile(), 0, 0, 0o000),
    group: file(GROUP),
    gshadow: file(gshadowFile(), 0, 0, 0o000),
    'login.defs': file(LOGIN_DEFS),
    default: dir(0, 0, 0o755, { useradd: file(DEFAULT_USERADD, 0, 0, 0o600), grub: file(DEFAULT_GRUB) }),
    skel: dir(0, 0, 0o755, skelDir()),
    sudoers: file(SUDOERS, 0, 0, 0o440),
    'sudoers.d': dir(0, 0, 0o750),
    hostname: file(HOSTNAME + '\n'),
    hosts: file('127.0.0.1   localhost localhost.localdomain\n::1         localhost localhost.localdomain\n192.168.56.10 rhel9\n'),
    shells: file('/bin/sh\n/bin/bash\n/usr/bin/sh\n/usr/bin/bash\n'),
    services: file(SERVICES_FILE),
    'os-release': file(OS_RELEASE),
    'redhat-release': file('Red Hat Enterprise Linux release 9.4 (Plow)\n'),
    'system-release': link('redhat-release'),
    fstab: file('/dev/mapper/rhel-root   /          xfs   defaults  0 0\nUUID=5a3c...           /boot      xfs   defaults  0 0\nUUID=7E21-0A3F         /boot/efi  vfat  umask=0077,shortname=winnt 0 2\n/dev/mapper/rhel-home   /home      xfs   defaults  0 0\n/dev/mapper/rhel-var    /var       xfs   defaults  0 0\n/dev/mapper/rhel-swap   none       swap  defaults  0 0\n'),
    'grub.d': dir(0, 0, 0o755, Object.fromEntries(Object.entries(GRUB_D).map(([k, v]) => [k, file(v, 0, 0, 0o755)]))),
    'yum.repos.d': dir(0, 0, 0o755, {
      'redhat.repo': file(
        '[rhel-9-for-x86_64-baseos-rpms]\nname = Red Hat Enterprise Linux 9 for x86_64 - BaseOS (RPMs)\nbaseurl = https://cdn.redhat.com/content/dist/rhel9/$releasever/x86_64/baseos/os\nenabled = 1\ngpgcheck = 1\n\n[rhel-9-for-x86_64-appstream-rpms]\nname = Red Hat Enterprise Linux 9 for x86_64 - AppStream (RPMs)\nbaseurl = https://cdn.redhat.com/content/dist/rhel9/$releasever/x86_64/appstream/os\nenabled = 1\ngpgcheck = 1\n'
      )
    }),
    dnf: dir(0, 0, 0o755, { 'dnf.conf': file('[main]\ngpgcheck=1\ninstallonly_limit=3\nclean_requirements_on_remove=True\nbest=True\nskip_if_unavailable=False\n') }),
    ssh: dir(0, 0, 0o755, { sshd_config: file('#Port 22\nPermitRootLogin yes\nPasswordAuthentication yes\nSubsystem\tsftp\t/usr/libexec/openssh/sftp-server\n', 0, 0, 0o600) }),
    systemd: dir(0, 0, 0o755, {
      system: dir(0, 0, 0o755, {
        'default.target': link('/usr/lib/systemd/system/graphical.target'),
        'multi-user.target.wants': dir(0, 0, 0o755, {
          'sshd.service': link('/usr/lib/systemd/system/sshd.service'),
          'crond.service': link('/usr/lib/systemd/system/crond.service'),
          'firewalld.service': link('/usr/lib/systemd/system/firewalld.service')
        })
      }),
      'system.conf': file('[Manager]\n#LogLevel=info\n'),
      'journald.conf': file('[Journal]\n#Storage=auto\n')
    }),
    'sudo.conf': file('# sudo.conf\n'),
    'pam.d': dir(0, 0, 0o755, { passwd: file('#%PAM-1.0\nauth       include\tsystem-auth\n'), su: file('#%PAM-1.0\nauth\t\tsufficient\tpam_rootok.so\n') }),
    'machine-id': file(MACHINE_ID + '\n'),
    firewalld: dir(0, 0, 0o750, { 'firewalld.conf': file('DefaultZone=public\n') }),
    'chrony.conf': file('pool 2.rhel.pool.ntp.org iburst\n'),
    'nanorc': file('## nanorc\n'),
    'rsyslog.conf': file('*.info;mail.none;authpriv.none;cron.none   /var/log/messages\n')
  });

  const usrLibSystemd = dir(0, 0, 0o755, {});
  const units: Record<string, FNode> = {};
  for (const [name, svc] of Object.entries(baseServices()))
    units[`${name}.service`] = file(`[Unit]\nDescription=${svc.desc}\n\n[Service]\nExecStart=${svc.execStart}\n\n[Install]\nWantedBy=${svc.wantedBy}\n`);
  for (const [t, v] of Object.entries(TARGETS)) units[t] = file(`[Unit]\nDescription=${v.desc}\n`);
  usrLibSystemd.kids = { system: dir(0, 0, 0o755, units), systemd: file(ELF, 0, 0, 0o755) };

  const root = dir(0, 0, 0o555, {
    bin: link('usr/bin'),
    sbin: link('usr/sbin'),
    lib: link('usr/lib'),
    lib64: link('usr/lib64'),
    boot: dir(0, 0, 0o555, {
      [`vmlinuz-${KERNEL}`]: { ...file(ELF, 0, 0, 0o755), sz: 12_984_168 },
      [`initramfs-${KERNEL}.img`]: { ...file('(initramfs simulé)', 0, 0, 0o600), sz: 38_120_442 },
      [`System.map-${KERNEL}`]: { ...file('', 0, 0, 0o644), sz: 8_211_000 },
      [`config-${KERNEL}`]: { ...file('CONFIG_X86_64=y\n', 0, 0, 0o644), sz: 228_000 },
      [`vmlinuz-0-rescue-${MACHINE_ID}`]: { ...file(ELF, 0, 0, 0o755), sz: 12_984_168 },
      grub2: dir(0, 0, 0o700, {
        'grub.cfg': file(grubCfg(DEFAULT_GRUB, GRUB_D['40_custom'], false), 0, 0, 0o600),
        grubenv: file(`# GRUB Environment Block\nsaved_entry=${MACHINE_ID}-${KERNEL}\nmenu_auto_hide=1\nboot_success=1\n`, 0, 0, 0o600),
        fonts: dir(0, 0, 0o755, { 'unicode.pf2': file('') })
      }),
      loader: dir(0, 0, 0o755, {
        entries: dir(0, 0, 0o755, {
          [`${MACHINE_ID}-${KERNEL}.conf`]: file(
            `title Red Hat Enterprise Linux (${KERNEL}) 9.4 (Plow)\nversion ${KERNEL}\nlinux /vmlinuz-${KERNEL}\ninitrd /initramfs-${KERNEL}.img $tuned_initrd\noptions root=/dev/mapper/rhel-root ro crashkernel=1G-4G:192M rd.lvm.lv=rhel/root rd.lvm.lv=rhel/swap rhgb quiet\ngrub_users $grub_users\ngrub_arg --unrestricted\ngrub_class rhel\n`
          ),
          [`${MACHINE_ID}-0-rescue.conf`]: file(`title Red Hat Enterprise Linux (0-rescue-${MACHINE_ID}) 9.4 (Plow)\nversion 0-rescue-${MACHINE_ID}\nlinux /vmlinuz-0-rescue-${MACHINE_ID}\n`)
        })
      }),
      efi: dir(0, 0, 0o700, {
        EFI: dir(0, 0, 0o700, {
          redhat: dir(0, 0, 0o700, {
            'grub.cfg': file("search --no-floppy --fs-uuid --set=dev 5a3c-boot\nset prefix=($dev)/grub2\nexport $prefix\nconfigfile $prefix/grub.cfg\n", 0, 0, 0o700),
            'grubx64.efi': { ...file(ELF, 0, 0, 0o700), sz: 2_600_000 },
            'shimx64.efi': { ...file(ELF, 0, 0, 0o700), sz: 950_000 }
          }),
          BOOT: dir(0, 0, 0o700, { 'BOOTX64.EFI': { ...file(ELF, 0, 0, 0o700), sz: 950_000 } })
        })
      })
    }),
    dev: dir(0, 0, 0o755, {
      null: file('', 0, 0, 0o666),
      zero: file('', 0, 0, 0o666),
      tty1: file('', 0, 5, 0o620),
      sda: file('', 0, 6, 0o660),
      sda1: file('', 0, 6, 0o660),
      sda2: file('', 0, 6, 0o660),
      sda3: file('', 0, 6, 0o660),
      sr0: file('', 0, 11, 0o660),
      pts: dir(0, 0, 0o755, { '0': file('', 1000, 5, 0o620) }),
      mapper: dir(0, 0, 0o755, { 'rhel-root': link('../dm-0'), 'rhel-home': link('../dm-1'), 'rhel-var': link('../dm-2'), 'rhel-swap': link('../dm-3') })
    }),
    etc,
    home: dir(0, 0, 0o755, {
      etudiant: homeDir(1000, 1000, {
        Documents: dir(1000, 1000, 0o755, { 'notes.txt': file('Révision Linux : useradd, usermod, chmod...\n', 1000, 1000, 0o644) }),
        'Téléchargements': dir(1000, 1000, 0o755)
      })
    }),
    root: dir(0, 0, 0o550, {
      ...skelDir(),
      'anaconda-ks.cfg': file('#version=RHEL9\n# Installation_propre\nlang fr_FR.UTF-8\nkeyboard --xlayouts=\'fr\'\ntimezone Africa/Casablanca\n', 0, 0, 0o600),
      rpms: dir(0, 0, 0o755, {
        'wireshark-3.4.10-7.el9.x86_64.rpm': { ...file('(paquet rpm simulé)'), sz: 4_520_000 },
        'tree-1.8.0-10.el9.x86_64.rpm': { ...file('(paquet rpm simulé)'), sz: 58_000 }
      })
    }),
    opt: dir(0, 0, 0o755),
    media: dir(0, 0, 0o755),
    mnt: dir(0, 0, 0o755),
    srv: dir(0, 0, 0o755),
    tmp: dir(0, 0, 0o1777),
    proc: dir(0, 0, 0o555, {
      cpuinfo: file('processor\t: 0\nvendor_id\t: GenuineIntel\nmodel name\t: Intel(R) Core(TM) i7-1165G7 @ 2.80GHz\ncpu cores\t: 2\n'),
      meminfo: file('MemTotal:        3843812 kB\nMemFree:         1325404 kB\nMemAvailable:    2533980 kB\nSwapTotal:       4194300 kB\n'),
      version: file(`Linux version ${KERNEL} (mockbuild@x86-vm-07) (gcc (GCC) 11.4.1 20231218 (Red Hat 11.4.1-3)) #1 SMP PREEMPT_DYNAMIC\n`),
      cmdline: file(`BOOT_IMAGE=(hd0,gpt2)/vmlinuz-${KERNEL} root=/dev/mapper/rhel-root ro rhgb quiet\n`),
      '1': dir(0, 0, 0o555, { comm: file('systemd\n') })
    }),
    sys: dir(0, 0, 0o555, { firmware: dir(0, 0, 0o755, { efi: dir(0, 0, 0o755, { 'fw_platform_size': file('64\n') }), acpi: dir() }), kernel: dir() }),
    usr: dir(0, 0, 0o755, {
      bin: dir(0, 0, 0o755, bins(USR_BIN)),
      sbin: dir(0, 0, 0o755, bins(USR_SBIN)),
      lib: usrLibSystemd.kids.system ? dir(0, 0, 0o755, { systemd: usrLibSystemd, modules: dir(0, 0, 0o755, { [KERNEL]: dir() }) }) : dir(),
      lib64: dir(0, 0, 0o755, { 'libc.so.6': { ...file(ELF, 0, 0, 0o755), sz: 2_400_000 }, 'libmagic.so.1': { ...file(ELF, 0, 0, 0o755), sz: 160_000 } }),
      libexec: dir(),
      share: dir(0, 0, 0o755, {
        magic: { ...file('# Magic data for file(1) command.\n'), sz: 6_700_000 },
        doc: dir(),
        man: dir(0, 0, 0o755, { man1: dir(), man5: dir(), man8: dir() }),
        empty: dir()
      }),
      local: dir(0, 0, 0o755, { bin: dir(), sbin: dir(), share: dir() }),
      games: dir()
    }),
    var: dir(0, 0, 0o755, {
      log: dir(0, 0, 0o755, {
        messages: { ...file(makeLog(20, 'systemd'), 0, 0, 0o600), sz: 2_350_000 },
        secure: { ...file(makeLog(12, 'sshd'), 0, 0, 0o600), sz: 184_000 },
        'dnf.log': { ...file(makeLog(8, 'dnf'), 0, 0, 0o600), sz: 920_000 },
        'boot.log': { ...file(makeLog(5, 'systemd'), 0, 0, 0o600), sz: 64_000 },
        cron: { ...file(makeLog(5, 'CROND'), 0, 0, 0o600), sz: 22_000 },
        audit: dir(0, 0, 0o700, { 'audit.log': { ...file('type=DAEMON_START', 0, 0, 0o600), sz: 6_100_000 } }),
        anaconda: dir(0, 0, 0o700, { 'anaconda.log': { ...file('', 0, 0, 0o600), sz: 410_000 } }),
        journal: dir(0, 190, 0o2755)
      }),
      tmp: dir(0, 0, 0o1777),
      spool: dir(0, 0, 0o755, { mail: dir(0, 12, 0o775, { etudiant: file('', 1000, 12, 0o660) }) }),
      cache: dir(0, 0, 0o755, { dnf: dir() }),
      lib: dir(0, 0, 0o755, { rpm: dir(), chrony: dir() }),
      www: dir(0, 0, 0o755),
      adm: dir()
    }),
    run: dir(0, 0, 0o755),
    afs: dir(0, 0, 0o755)
  });
  // remove /var/www until httpd is installed
  delete root.kids!.var.kids!.www;

  return {
    root,
    services: baseServices(),
    currentTarget: 'graphical.target',
    installed: basePackages(),
    repo: repoPackages(),
    groups: Object.fromEntries(Object.entries(PKG_GROUPS).map(([k, v]) => [k, { ...v, installed: false }])),
    dnfHistory: [
      { id: 1, cmd: '', date: bootTime - 5 * 86400000, action: 'Install', pkgs: [{ name: 'bash', action: 'Install' }, { name: 'kernel', action: 'Install' }] }
    ],
    journal: baseJournal(bootTime),
    bootTime,
    repoEnabled: { 'rhel-9-for-x86_64-baseos-rpms': true, 'rhel-9-for-x86_64-appstream-rpms': true },
    nextPid: 4200
  };
}

%define _name another-tgproxy
%define uuid %_name@ampernic.space
%define gettext_domain %uuid
%define metainfo space.ampernic.AnotherTGProxy.Extension.metainfo.xml

Name:           gnome-shell-extension-%_name
Version:        1.0
Release:        alt1

Summary:        Quick Settings toggle for the Another TGProxy daemon
Group:          Graphical desktop/GNOME
License:        GPL-3.0-or-later
Url:            https://github.com/Another-TGProxy/another-tgproxy-extension

Vcs:            https://github.com/Another-TGProxy/another-tgproxy-extension.git

BuildArch: noarch

Source:         %name-%version.tar

Requires:       gnome-shell >= 45

BuildRequires:  gettext-tools

%description
A GNOME Shell Quick Settings toggle for the Another TGProxy daemon: start and
stop the MTProto-over-WebSocket proxy and watch its live status, without opening
the application.

%prep
%setup

%install
mkdir -p %buildroot%_datadir/gnome-shell/extensions/%uuid
cp -ar %uuid/. %buildroot%_datadir/gnome-shell/extensions/%uuid/

for po in po/*.po; do
    lang=$(basename "$po" .po)
    install -d -m 0755 %buildroot%_datadir/locale/$lang/LC_MESSAGES
    msgfmt -o %buildroot%_datadir/locale/$lang/LC_MESSAGES/%gettext_domain.mo "$po"
done

install -Dpm 0644 %metainfo %buildroot%_datadir/metainfo/%metainfo

%find_lang %gettext_domain

%files -f %gettext_domain.lang
%_datadir/gnome-shell/extensions/%uuid/
%_datadir/metainfo/%metainfo
%doc README.md README.en.md

%changelog
* Wed Jun 03 2026 Anton Politov <ampernic@altlinux.org> 1.0-alt1
- Initial build for ALT.


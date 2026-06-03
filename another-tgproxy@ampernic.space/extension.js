// SPDX-License-Identifier: GPL-3.0-or-later
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import {QuickMenuToggle, SystemIndicator} from 'resource:///org/gnome/shell/ui/quickSettings.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const BUS_NAME = 'space.ampernic.AnotherTGProxy.Daemon';
const OBJECT_PATH = '/space/ampernic/AnotherTGProxy/Control';
const CONTROL_IFACE = `
<node>
  <interface name="space.ampernic.AnotherTGProxy.Control1">
    <property name="Running" type="b" access="read"/>
    <property name="Status" type="s" access="read"/>
    <method name="Toggle"/>
    <method name="Restart"/>
    <method name="Open"/>
    <method name="OpenTelegram"/>
    <method name="Quit"/>
    <signal name="Changed">
      <arg type="b" name="running"/>
      <arg type="s" name="status"/>
    </signal>
  </interface>
</node>`;

const ControlProxy = Gio.DBusProxy.makeProxyWrapper(CONTROL_IFACE);

const ProxyToggle = GObject.registerClass(
class ProxyToggle extends QuickMenuToggle {
    _init(gicon) {
        super._init({
            title: 'Another TGProxy',
            gicon,
            toggleMode: true
        });
        this.menu.setHeader(gicon, 'Another TGProxy');
    }
});

const ProxyIndicator = GObject.registerClass(
class ProxyIndicator extends SystemIndicator {
    _init(gicon) {
        super._init();
        this._gicon = gicon;

        this._indicator = this._addIndicator();
        this._indicator.gicon = gicon;
        this._indicator.visible = false;

        this._toggle = new ProxyToggle(gicon);
        this._toggle.connect('clicked', () => this._onClicked());
        this._toggle.menu.addAction(_('Open'), () => this._call('Open'));
        this._toggle.menu.addAction(_('Open in Telegram'), () => this._call('OpenTelegram'));
        this._toggle.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        this._toggle.menu.addAction(_('Restart'), () => this._call('Restart'));
        this._toggle.menu.addAction(_('Quit'), () => this._call('Quit'));
        this.quickSettingsItems.push(this._toggle);

        this._proxy = null;
        this._changedId = 0;
        this._watchId = Gio.bus_watch_name(
            Gio.BusType.SESSION, BUS_NAME, Gio.BusNameWatcherFlags.NONE,
            () => this._onAppeared(),
            () => this._onVanished());
    }

    _onAppeared() {
        this._proxy = new ControlProxy(Gio.DBus.session, BUS_NAME, OBJECT_PATH,
            (_proxy, error) => {
                if (error) {
                    logError(error, 'Another TGProxy: cannot reach daemon');
                    this._proxy = null;
                    return;
                }
                this._update(this._proxy.Running, this._proxy.Status);
            });
        this._changedId = this._proxy.connectSignal('Changed',
            (_p, _sender, [running, status]) => this._update(running, status));
    }

    _onVanished() {
        if (this._proxy && this._changedId)
            this._proxy.disconnectSignal(this._changedId);
        this._proxy = null;
        this._changedId = 0;
        this._toggle.checked = false;
        this._toggle.subtitle = _('Daemon not running');
        this._toggle.menu.setHeader(this._gicon, 'Another TGProxy', _('Daemon not running'));
        this._indicator.visible = false;
    }

    _update(running, status) {
        const s = status || '';
        this._toggle.checked = !!running;
        this._toggle.subtitle = s || null;
        this._toggle.menu.setHeader(this._gicon, 'Another TGProxy', s);
        this._indicator.visible = !!running;
    }

    _call(method) {
        if (this._proxy)
            this._proxy[`${method}Remote`](() => {});
    }

    _onClicked() {
        if (this._proxy) {
            this._proxy.ToggleRemote(() => {});
            return;
        }
        // Daemon not running: D-Bus-activate it (its startup brings up the proxy).
        try {
            Gio.DBus.session.call(
                'org.freedesktop.DBus', '/org/freedesktop/DBus',
                'org.freedesktop.DBus', 'StartServiceByName',
                new GLib.Variant('(su)', [BUS_NAME, 0]),
                null, Gio.DBusCallFlags.NONE, -1, null, null);
        } catch (e) {
            logError(e, 'Another TGProxy: cannot activate daemon');
        }
    }

    destroy() {
        if (this._watchId)
            Gio.bus_unwatch_name(this._watchId);
        this._watchId = 0;
        this._onVanished();
        this._toggle.destroy();
        super.destroy();
    }
});

export default class AnotherTGProxyExtension extends Extension {
    enable() {
        const gicon = Gio.icon_new_for_string(
            `${this.path}/icons/hicolor/scalable/actions/another-tgproxy-symbolic.svg`);
        this._indicator = new ProxyIndicator(gicon);
        Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

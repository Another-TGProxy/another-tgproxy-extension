<div align="center">

<img src="logo.png" width="128" alt="логотип Another TGProxy"/>

# Another TGProxy — расширение GNOME Shell

**Тоггл в «Быстрых настройках» GNOME для демона Another TGProxy.**

[![License](https://img.shields.io/badge/license-GPL--3.0--or--later-1C71D8.svg)](LICENSE)
![Shell](https://img.shields.io/badge/GNOME%20Shell-45–48-4A86CF.svg)
![Language](https://img.shields.io/badge/JavaScript-GJS-f7df1e.svg)

**Русский** · [English](README.en.md)

</div>

---

> 🧩 Добавляет переключатель в Quick Settings GNOME: включить/выключить прокси и
> видеть его живой статус, не открывая приложение. Часть проекта
> [Another TGProxy](https://github.com/Another-TGProxy).

<div align="center">

<img src="screenshots/quick-settings.png" width="360" alt="Тоггл Another TGProxy в Быстрых настройках GNOME"/>

</div>

Расширение не запускает прокси само — оно тонкий фронтенд к фоновому **демону**
`Another TGProxy`, с которым общается по D-Bus. Пока демон на шине — тоггл отражает
его состояние и статус; по клику просит переключиться; когда демона нет — клик
поднимает его через D-Bus-активацию.

```mermaid
flowchart LR
    QS["⚙️ Quick Settings · тоггл"] -- "Running / Status (PropertiesChanged)" --> EXT(["🧩 расширение"])
    EXT -- "Toggle() / Open() / Quit()" --> D["🔌 демон Another TGProxy"]
    EXT -. "если демон выключен" .-> ACT["D-Bus активация"]
    ACT -.-> D
    D == "MTProto ↔ WebSocket" ==> TG["☁️ Telegram"]
```

## ✨ Возможности

- **Тоггл в Quick Settings** — состояние = работает ли прокси.
- **Живой статус** в подписи тоггла (соединения, трафик) — приходит от демона.
- **Запуск по требованию** — если демон не запущен, клик активирует его по D-Bus
  (его автозапуск поднимает прокси).
- **Индикатор** в системной области, пока прокси активен.

## 🧩 Как это работает

Демон публикует интерфейс `space.ampernic.AnotherTGProxy.Control1` на имени
`space.ampernic.AnotherTGProxy.Daemon` (путь `/space/ampernic/AnotherTGProxy/Control`):

| Член | Тип | Назначение |
|---|---|---|
| `Running` | свойство `b` | работает ли прокси (→ состояние тоггла) |
| `Status` | свойство `s` | живая строка статуса (→ подпись тоггла) |
| `Toggle()` | метод | запустить/остановить прокси |
| `Open()` | метод | открыть окно приложения |
| `Quit()` | метод | остановить демон |

## 📦 Установка

```sh
make install      # → ~/.local/share/gnome-shell/extensions/
# На Wayland: выйдите из сессии и войдите снова, чтобы шелл увидел расширение
make enable
```

Сборка zip для extensions.gnome.org: `make pack` (локали компилируются из `po/`).

## 🔧 Требования

- GNOME Shell **45–48**.
- Установленный демон `Another TGProxy` (или его D-Bus `.service` для запуска по
  требованию).

## 📄 Лицензия

[GPL-3.0-or-later](LICENSE).

<div align="center"><sub>Часть <b><a href="https://github.com/Another-TGProxy">Another TGProxy</a></b></sub></div>

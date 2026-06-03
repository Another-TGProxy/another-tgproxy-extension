UUID = another-tgproxy@ampernic.space
SRC  = $(UUID)
ZIP  = $(UUID).shell-extension.zip
EXTDIR = $(HOME)/.local/share/gnome-shell/extensions/$(UUID)

.PHONY: all build pack install uninstall pot update-po lint enable disable clean

all: build

# Distributable zip: --podir compiles po/ into the bundle, icons ride along.
build pack:
	gnome-extensions pack --force \
	  --podir=$(CURDIR)/po \
	  --extra-source=icons \
	  --out-dir=$(CURDIR) \
	  $(SRC)

install: build
	gnome-extensions install --force $(ZIP)
	@echo "Installed. On Wayland, log out/in for the shell to load it, then: make enable"

uninstall:
	rm -rf "$(EXTDIR)"

# Regenerate the .pot and merge it into every po/*.po.
pot update-po:
	./update-locale.sh

lint:
	PATH="$(CURDIR)/node_modules/.bin:$$PATH" eslint $(SRC)

enable:
	gnome-extensions enable $(UUID)

disable:
	gnome-extensions disable $(UUID)

clean:
	rm -f $(ZIP)

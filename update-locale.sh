#!/usr/bin/env sh
# Regenerate the translation template from sources and merge it into every po.
set -eu
cd "$(dirname "$0")"

UUID="another-tgproxy@ampernic.space"
POT="po/$UUID.pot"

xgettext --from-code=UTF-8 --no-wrap --language=JavaScript \
  --keyword=_ --package-name="Another TGProxy" \
  -o "$POT" "$UUID/extension.js"

for po in po/*.po; do
    [ "$po" = "$POT" ] && continue
    echo "merging $po"
    msgmerge --backup=off --update "$po" "$POT"
done

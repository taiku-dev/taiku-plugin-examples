# TAIKU_PLUGIN_NAME

This plugin was created with `create-taiku-plugin`.

## Files

- `manifest.json`: plugin metadata, permissions, toolbar actions, and panels
- `panel.html`: the iframe UI entrypoint
- `panel.js`: plugin logic that talks to taiku through the plugin bridge
- `package.json`: optional local metadata if you want to add tooling later

## Getting started

1. Edit `manifest.json`, `panel.html`, and `panel.js` to match your plugin.
2. Load this directory into taiku as a local plugin.

This starter uses the raw plugin bridge directly, like the example plugins in
the main taiku repo. If you later want typed helpers or tests, you can add
`@taiku/plugin-sdk` on top.

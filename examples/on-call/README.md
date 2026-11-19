# On Call

When a page fires, tell an agent and ask you whether to page anyone

Plugin ID: `example.on-call`. Version: `0.1.0`.

## Permissions

- `agents.read`
- `mail.send`
- `asks.write`
- `ui.panel`
- `ui.toolbar.custom`

## Install

Open Plugins in taiku and choose Submit. In Load Custom Plugin, paste:

```text
https://raw.githubusercontent.com/taiku-dev/taiku-plugin-examples/main/examples/on-call/manifest.json
```

Choose Load, review the permissions, and confirm the install. The field also
accepts the full HTTP(S) URL of a folder and appends `/manifest.json`.

To edit the plugin, copy this folder, change the manifest's `id`, `name`, and
`author`, then serve the folder over HTTP(S) with cross-origin requests allowed.
Paste that server's URL into the same field. The web app does not load a local
folder path or a `file://` URL.

See the [plugin guide](https://docs.taiku.live/docs/plugins-and-developers/building-plugins)
for the bridge methods and permission descriptions.

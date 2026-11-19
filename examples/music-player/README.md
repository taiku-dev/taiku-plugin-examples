# Music Player

Upload and play music while coding. Sync playback with remote collaborators.

Plugin ID: `example.music-player`. Version: `1.0.0`.

## Permissions

- `ui.panel`
- `ui.toolbar.custom`
- `ui.toast`
- `events.subscribe`
- `events.broadcast`
- `storage.read`
- `storage.write`
- `session.read`
- `hotkey.register`

## Install

Open Plugins in taiku and choose Submit. In Load Custom Plugin, paste:

```text
https://raw.githubusercontent.com/taiku-dev/taiku-plugin-examples/main/examples/music-player/manifest.json
```

Choose Load, review the permissions, and confirm the install. The field also
accepts the full HTTP(S) URL of a folder and appends `/manifest.json`.

To edit the plugin, copy this folder, change the manifest's `id`, `name`, and
`author`, then serve the folder over HTTP(S) with cross-origin requests allowed.
Paste that server's URL into the same field. The web app does not load a local
folder path or a `file://` URL.

See the [plugin guide](https://docs.taiku.live/docs/plugins-and-developers/building-plugins)
for the bridge methods and permission descriptions.

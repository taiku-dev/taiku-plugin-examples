# Reply to Note

Adds Save to notes to More actions under your agents' replies. Choosing it keeps that one reply in its Notes panel, with the agent that wrote it.

Plugin ID: `example.reply-to-note`. Version: `0.1.0`.

## Permissions

- `agent.actions`
- `ui.panel`
- `session.read`
- `storage.write`

## Install

Open Plugins in taiku and choose Submit. In Load Custom Plugin, paste:

```text
https://raw.githubusercontent.com/taiku-dev/taiku-plugin-examples/main/examples/reply-to-note/manifest.json
```

Choose Load, review the permissions, and confirm the install. The field also
accepts the full HTTP(S) URL of a folder and appends `/manifest.json`.

To edit the plugin, copy this folder, change the manifest's `id`, `name`, and
`author`, then serve the folder over HTTP(S) with cross-origin requests allowed.
Paste that server's URL into the same field. The web app does not load a local
folder path or a `file://` URL.

See the [plugin guide](https://docs.taiku.live/docs/plugins-and-developers/building-plugins)
for the bridge methods and permission descriptions.

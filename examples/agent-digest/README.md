# Agent Digest

What your agents did yesterday: their runs and the verdicts they reached

Plugin ID: `example.agent-digest`. Version: `0.1.0`.

## Permissions

- `agents.read`
- `agents.read.tasks`
- `verdicts.read`
- `ui.panel`
- `ui.toolbar.custom`
- `ui.agent-panel`

## Install

Open Plugins in taiku and choose Submit. In Load Custom Plugin, paste:

```text
https://raw.githubusercontent.com/taiku-dev/taiku-plugin-examples/main/examples/agent-digest/manifest.json
```

Choose Load, review the permissions, and confirm the install. The field also
accepts the full HTTP(S) URL of a folder and appends `/manifest.json`.

To edit the plugin, copy this folder, change the manifest's `id`, `name`, and
`author`, then serve the folder over HTTP(S) with cross-origin requests allowed.
Paste that server's URL into the same field. The web app does not load a local
folder path or a `file://` URL.

See the [plugin guide](https://docs.taiku.live/docs/plugins-and-developers/building-plugins)
for the bridge methods and permission descriptions.

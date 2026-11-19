# taiku plugin examples

Complete plugin folders and a blank static template for taiku. The panels use
HTML, CSS, and JavaScript directly and need no build step.

This repository is generated from taiku's built-in plugins at source commit
`a0525f8634d186c5497f87958672b07f8667974d`. Changes and pull requests here are overwritten by the next
sync from taiku main. Report problems through this repository's issues.

## Examples

- [Agent Digest](examples/agent-digest/): What your agents did yesterday: their runs and the verdicts they reached
- [Agent Monitor](examples/agent-monitor/): Track AI agent activity across shells
- [Agent Note](examples/agent-note/): Leave a note for one of your agents, which it reads at its next run
- [Agent Switch](examples/agent-switch/): Turn one of your role agents off, or ask to turn it back on
- [Break Timer](examples/break-timer/): Reminds you to step away on a fixed interval. One manifest, two surfaces: a panel in the browser and desktop app, and a headless process in the terminal client.
- [Chat Notifier](examples/chat-notifier/): Desktop notifications and toasts on new chat messages
- [Event Log](examples/event-log/): Log all session events in real time
- [File Browser](examples/file-browser/): Browse and open files from the session working directory
- [Integrations Demo](examples/integrations/): Connect a Composio app via OAuth, list its tools, and run one. Demonstrates the integrations API
- [Music Player](examples/music-player/): Upload and play music while coding. Sync playback with remote collaborators.
- [On Call](examples/on-call/): When a page fires, tell an agent and ask you whether to page anyone
- [Ports](examples/outputs-ports/): Lists the ports open in the session, such as a dev server an agent started, as a section in the agent tile's Outputs. The section appears only while a port is open.
- [Reply to Note](examples/reply-to-note/): Adds Save to notes to More actions under your agents' replies. Choosing it keeps that one reply in its Notes panel, with the agent that wrote it.
- [Done list](examples/standup/): Adds /standup to your agent composer. It drafts a standup from the list you keep in its panel, and you send it.
- [Terminal Commander](examples/terminal-commander/): Send commands to terminals and view output. Demonstrates terminal read/write and tile APIs

- [Blank static template](templates/blank-static/): a sidebar panel made by
  taiku's scaffolder, with no SDK or package dependencies.

## Install and edit

Open Plugins in taiku and choose Submit. In Load Custom Plugin, paste:

```text
https://raw.githubusercontent.com/taiku-dev/taiku-plugin-examples/main/examples/file-browser/manifest.json
```

Choose Load, review the permissions, and confirm the install. The field also
accepts the full HTTP(S) URL of a folder and appends `/manifest.json`.

To edit the plugin, copy this folder, change the manifest's `id`, `name`, and
`author`, then serve the folder over HTTP(S) with cross-origin requests allowed.
Paste that server's URL into the same field. The web app does not load a local
folder path or a `file://` URL.

For a blank plugin, copy `templates/blank-static/` and follow its README.
The published copies of `taiku.*` plugins use `example.*` IDs so they can be
installed alongside the originals. If that ID is already installed from
another URL, uninstall that copy first or give your copy a new ID. taiku refuses
an installed ID from a different source.

## Host protocol

Wait for `taiku:init` from `window.parent` and check the message's `source`.
Every `taiku:request` must carry the `pluginId`, `panelId`, and `authToken`
from init, plus a unique request `id`, a `method`, and its `params`.
taiku answers with `taiku:response` and the same request ID.

Init can supply a MessagePort in `event.ports[0]`. Listen on that port and
send `taiku:port-ready` on it before making requests so events use it too.
Requests can also use `window.parent.postMessage`; those answers use the window.
Apply the theme tokens from init and from later `taiku:theme` messages.

Read the [full plugin guide](https://docs.taiku.live/docs/plugins-and-developers/building-plugins).
To list a finished plugin in the marketplace, submit a pull request to
[community-plugins.json](https://github.com/taiku-dev/taiku-plugins/blob/main/community-plugins.json)
in `taiku-dev/taiku-plugins`.

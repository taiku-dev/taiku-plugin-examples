# Blank Static

A static plugin with no build step or package dependencies.

Edit `id`, `name`, and `author` in `manifest.json` before making your own plugin.
Serve this folder from an HTTP(S) server that allows cross-origin requests.
In taiku, open Plugins, choose Submit, and load the full URL to
`manifest.json` or to its folder. Review the permissions and confirm the install.
A path on your computer or a `file://` URL does not work in the web app.

The panel waits for `taiku:init` and sends `getSession` with the supplied
`pluginId`, `panelId`, and `authToken`. It uses the supplied MessagePort when
available, acknowledges it with `taiku:port-ready`, and applies the host's theme.

Permissions:

- `session.read`: read the session shown in the panel.
- `ui.panel`: display the sidebar panel.

See the [plugin guide](https://docs.taiku.live/docs/plugins-and-developers/building-plugins).

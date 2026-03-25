# taiku-plugin-examples

Static example plugins and starter templates for taiku.

## What is here

- `examples/file-browser`: browse files from the session working directory
- `examples/terminal-commander`: inspect shells and send commands
- `templates/blank-static`: the smallest useful static plugin skeleton

## How to use these

Each folder is a complete plugin directory with a `manifest.json` and one or
more panel files.

You can:

1. copy a folder locally and load it into taiku as a local plugin
2. point taiku at a raw `manifest.json` URL from this repo
3. use the folders as references when building your own hosted plugin repo

These examples intentionally stay close to taiku's built-in static plugins:

- no bundler required
- plain HTML, CSS, and JavaScript
- direct use of the plugin bridge over `postMessage`

The blank template is intentionally minimal, but it still demonstrates the
important part: taiku sends `taiku:init`, your iframe sends `taiku:request`,
and taiku answers with `taiku:response`. The two example plugins show the same
bridge pattern in more realistic forms.

If you want typed helpers or tests, add `@taiku/plugin-sdk` on top of the
template.

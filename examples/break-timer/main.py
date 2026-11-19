#!/usr/bin/env python3
"""Break Timer, the terminal-client half.

The same manifest.json also declares a browser panel (panel.html). This file is
what the terminal client runs instead: manifest.json's "exec" block starts it
as a sandboxed child process, and it talks to taiku over stdin and stdout.

The protocol is one JSON object per line, in both directions.

  you send      {"t": "req", "id": "r1", "method": "showToast", "params": {...}}
  taiku answers {"t": "res", "id": "r1", "result": ...}
             or {"t": "res", "id": "r1", "error": "why it was refused"}
  taiku pushes  {"t": "event", "event": {"type": ..., "data": ...}}

Method names, parameters and error wording match the browser SDK, so
`showToast` here is the same call as `taiku.showToast()` in a panel.

Two things bite if you write your own client in another language:

  * Flush after every line. The host reads line by line; a buffered write is a
    request that never arrives.
  * Read stdin as raw bytes. Python's sys.stdin keeps its own buffer, so
    select() can report "nothing to read" while a whole line sits in it.

The sandbox gives this process no network, no environment beyond PATH, HOME,
TMPDIR, XDG_DATA_HOME and LANG, and write access only to its own data
directory. Standard library only, for that reason: there is nowhere to install
a dependency.
"""

import json
import os
import select
import sys
import time

BREAK_NOW = "break-timer.now"
DEFAULT_MINUTES = 50


class HostError(Exception):
    """taiku refused a request. The message is the host's own wording."""


class Host:
    def __init__(self):
        self._buffer = b""
        self._pending_events = []
        self._next_id = 0

    def _send(self, frame):
        sys.stdout.write(json.dumps(frame) + "\n")
        sys.stdout.flush()

    def _read_frame(self, timeout):
        """One frame from the host, or None if `timeout` seconds pass first.

        Raises EOFError when taiku closes stdin, which is how it stops a
        plugin: on revoke, on disable, and when the terminal client exits.
        """
        while b"\n" not in self._buffer:
            ready, _, _ = select.select([0], [], [], timeout)
            if not ready:
                return None
            chunk = os.read(0, 65536)
            if not chunk:
                raise EOFError
            self._buffer += chunk
        line, self._buffer = self._buffer.split(b"\n", 1)
        return json.loads(line)

    def call(self, method, params=None):
        self._next_id += 1
        request_id = f"r{self._next_id}"
        self._send({"t": "req", "id": request_id, "method": method, "params": params or {}})
        while True:
            frame = self._read_frame(None)
            if frame.get("t") == "res" and frame.get("id") == request_id:
                if "error" in frame:
                    raise HostError(frame["error"])
                return frame.get("result")
            # An event can land while we wait for our answer. Keep it for the
            # main loop rather than dropping it.
            if frame.get("t") == "event":
                self._pending_events.append(frame["event"])

    def next_event(self, timeout):
        """The next event, or None once `timeout` seconds pass with none."""
        if self._pending_events:
            return self._pending_events.pop(0)
        deadline = time.monotonic() + timeout
        while True:
            frame = self._read_frame(max(0.0, deadline - time.monotonic()))
            if frame is None:
                return None
            if frame.get("t") == "event":
                return frame["event"]


def interval_minutes(settings):
    value = (settings or {}).get("intervalMinutes", DEFAULT_MINUTES)
    try:
        return max(1, int(value))
    except (TypeError, ValueError):
        return DEFAULT_MINUTES


def remind(host, body):
    host.call("sendNotification", {"title": "Time for a break", "body": body})


def main():
    host = Host()
    minutes = interval_minutes(host.call("getSettings"))
    host.call(
        "showToast",
        {"message": f"Reminding you every {minutes} minutes", "kind": "info"},
    )

    started = time.monotonic()
    while True:
        event = host.next_event(max(0.0, started + minutes * 60 - time.monotonic()))
        if event is None:
            remind(host, f"You have been at it for {minutes} minutes.")
        elif event.get("type") == BREAK_NOW:
            remind(host, "Stepping away now. The timer starts over when you get back.")
        else:
            continue
        # Re-read on every cycle, so a changed interval applies from the next one.
        minutes = interval_minutes(host.call("getSettings"))
        started = time.monotonic()


if __name__ == "__main__":
    try:
        main()
    except EOFError:
        pass

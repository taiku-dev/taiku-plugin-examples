let pluginId = "";
let requestId = 0;
let isReady = false;

const sessionNameEl = document.getElementById("session-name");
const shellCountEl = document.getElementById("shell-count");
const shellListEl = document.getElementById("shell-list");
const refreshEl = document.getElementById("refresh");

function send(method, params = {}) {
  const id = `starter_${++requestId}`;
  window.parent.postMessage(
    { type: "taiku:request", id, pluginId, method, params },
    "*"
  );
  return id;
}

function sendAsync(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = send(method, params);
    const timeout = window.setTimeout(() => {
      window.removeEventListener("message", onMessage);
      reject(new Error("Timed out waiting for taiku"));
    }, 10000);

    function onMessage(event) {
      const data = event.data;
      if (data?.type !== "taiku:response" || data.id !== id) return;
      window.clearTimeout(timeout);
      window.removeEventListener("message", onMessage);
      if (data.error) reject(new Error(data.error));
      else resolve(data.result);
    }

    window.addEventListener("message", onMessage);
  });
}

function stripAnsi(value) {
  return value
    .replace(
      /\x1b(?:\[[0-9;]*[a-zA-Z]|\][^\x07\x1b]*(?:\x07|\x1b\\)?|\([A-Z0-9])/g,
      ""
    )
    .replace(/[\x00-\x08\x0e-\x1f]/g, "");
}

async function loadSnapshot() {
  if (!isReady) return;

  const [session, shells] = await Promise.all([
    sendAsync("getSession"),
    sendAsync("getShells"),
  ]);

  sessionNameEl.textContent = session.name || session.id;
  shellCountEl.textContent = String(shells.length);

  if (shells.length === 0) {
    shellListEl.innerHTML =
      '<div class="empty">No shells in this session yet.</div>';
    return;
  }

  const previews = await Promise.all(
    shells.slice(0, 3).map(async (shell) => {
      const output = await sendAsync("getShellOutput", {
        shellId: shell.id,
        chunks: 1,
      });
      return {
        shell,
        preview: stripAnsi((output.chunks || []).join("")).trim(),
      };
    })
  );

  shellListEl.innerHTML = previews
    .map(({ shell, preview }) => {
      const safePreview = preview
        ? preview
            .slice(-180)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
        : "No output yet.";
      return `
        <div class="shell">
          <div class="shell-title">Shell #${shell.id}</div>
          <div class="shell-preview">${safePreview}</div>
        </div>
      `;
    })
    .join("");
}

refreshEl.addEventListener("click", async () => {
  try {
    await loadSnapshot();
    send("showToast", {
      message: "Snapshot refreshed",
      kind: "success",
      duration: 1500,
    });
  } catch (error) {
    send("showToast", {
      message: error.message,
      kind: "error",
      duration: 2500,
    });
  }
});

window.addEventListener("message", async (event) => {
  const data = event.data;
  if (!data) return;

  if (data.type === "taiku:init") {
    pluginId = data.pluginId;
    isReady = true;
    send("subscribeEvents");
    await loadSnapshot();
    return;
  }

  if (data.type === "taiku:event") {
    const eventType = data.event?.type;
    if (
      eventType === "shells_changed" ||
      eventType === "shell:data" ||
      eventType === "terminal_title_changed"
    ) {
      await loadSnapshot();
    }
  }
});

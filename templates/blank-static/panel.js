let pluginId = "";
let requestId = 0;

const statusEl = document.getElementById("status");
const refreshEl = document.getElementById("refresh");

function send(method, params = {}) {
  const id = `blank_${++requestId}`;
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

async function refresh() {
  const session = await sendAsync("getSession");
  statusEl.textContent = `Connected to ${session.name || session.id}`;
}

refreshEl.addEventListener("click", () => {
  refresh().catch((error) => {
    statusEl.textContent = error.message;
  });
});

window.addEventListener("message", (event) => {
  const data = event.data;
  if (data?.type !== "taiku:init") return;
  pluginId = data.pluginId;
  refresh().catch((error) => {
    statusEl.textContent = error.message;
  });
});

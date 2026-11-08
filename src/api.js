const EMPLOYEES = "/api/employees";

// Drops empty filters so the URL stays clean (?page=1&sort=id, not ?search=&department=...)
const toQuery = (params) =>
  new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== "" && v !== null && v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new Error(
      "Backend se connection nahi ho raha. Check karein ke API chal rahi hai (npm run server) aur port 5001 khali hai."
    );
  }

  const body = res.status === 204 ? null : await res.json().catch(() => null);

  // A non-JSON reply usually means the request reached something other than our API
  // (API not running, or another program on that port)
  if (res.status === 502 || res.status === 503 || res.status === 504) {
    throw new Error(
      "Backend (API) chal nahi rahi. 'npm run dev' ya 'npm run server' se API start karein, aur terminal mein error check karein."
    );
  }

  if (body === null && res.status !== 204) {
    throw new Error(
      `Server ne unexpected response diya (status ${res.status}). API chal rahi hai ya nahi, aur port 5001 par hai ya nahi, check karein.`
    );
  }

  if (!res.ok) {
    const err = new Error(body?.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.errors = body?.errors ?? {};
    throw err;
  }
  return body;
}

export const api = {
  listEmployees: (params) => request(`${EMPLOYEES}?${toQuery(params)}`),
  getStats: () => request("/api/stats"),
  createEmployee: (data) =>
    request(EMPLOYEES, { method: "POST", body: JSON.stringify(data) }),
  updateEmployee: (id, data) =>
    request(`${EMPLOYEES}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEmployee: (id) => request(`${EMPLOYEES}/${id}`, { method: "DELETE" }),
};

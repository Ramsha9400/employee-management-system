import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(here, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "employees.json");

// Simple JSON-file storage (starts empty, nothing hardcoded). Easy to inspect and needs no native build.
// Swap this module for SQLite/Postgres later without touching the routes.
let db = null; // in-memory copy: { nextId, employees: [] }
let writeChain = Promise.resolve();

const EMPTY_STATE = { nextId: 1, employees: [] };

// Keeps stored data clean even if the JSON file was edited by hand:
// trims text fields and makes sure nextId is always above every existing id.
function normalize(state) {
  const employees = (state.employees ?? []).map((e) => {
    const clean = { ...e };
    for (const [key, value] of Object.entries(clean)) {
      if (typeof value === "string") clean[key] = value.trim();
    }
    return clean;
  });
  const maxId = employees.reduce((max, e) => Math.max(max, Number(e.id) || 0), 0);
  return {
    nextId: Math.max(Number(state.nextId) || 1, maxId + 1),
    employees,
  };
}

async function load() {
  if (db) return db;
  try {
    db = normalize(JSON.parse(await fs.readFile(DATA_FILE, "utf8")));
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    // No data file yet: start with an empty directory, no sample records
    db = normalize(EMPTY_STATE);
    await save();
  }
  return db;
}

// Writes are queued so concurrent requests never interleave on disk.
// We write to a temp file and rename it, so a crash can't leave half-written JSON.
function save() {
  writeChain = writeChain
    .catch(() => {}) // keep the queue alive after a failed write
    .then(async () => {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const tmp = `${DATA_FILE}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(db, null, 2));
      await fs.rename(tmp, DATA_FILE);
    });
  return writeChain;
}

export async function list() {
  const state = await load();
  return [...state.employees];
}

export async function find(id) {
  const state = await load();
  return state.employees.find((e) => e.id === id) ?? null;
}

export async function create(fields) {
  const state = await load();
  const now = new Date().toISOString();
  const employee = { id: state.nextId++, ...fields, createdAt: now, updatedAt: now };
  state.employees.push(employee);
  await save();
  return employee;
}

export async function update(id, fields) {
  const state = await load();
  const index = state.employees.findIndex((e) => e.id === id);
  if (index === -1) return null;
  const updated = {
    ...state.employees[index],
    ...fields,
    updatedAt: new Date().toISOString(),
  };
  state.employees[index] = updated;
  await save();
  return updated;
}

export async function remove(id) {
  const state = await load();
  const index = state.employees.findIndex((e) => e.id === id);
  if (index === -1) return false;
  state.employees.splice(index, 1);
  await save();
  return true;
}

import { Router } from "express";
import * as store from "../store.js";
import { validateEmployee } from "../validate.js";

const router = Router();
const SORT_FIELDS = ["id", "firstName", "lastName", "department", "age", "salary", "joinDate"];

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const parseId = (raw) => {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// Another employee already using this email? (emails must be unique)
const emailTaken = async (email, exceptId) => {
  const rows = await store.list();
  return rows.some((e) => e.email === email && e.id !== exceptId);
};

// GET /api/employees?search=&department=&status=&sort=&order=&page=&limit=
router.get("/", async (req, res, next) => {
  try {
    const search = String(req.query.search ?? "").trim().toLowerCase();
    const department = String(req.query.department ?? "");
    const status = String(req.query.status ?? "");
    const sort = SORT_FIELDS.includes(req.query.sort) ? req.query.sort : "id";
    const dir = req.query.order === "desc" ? -1 : 1;
    const limit = clamp(parseInt(req.query.limit, 10) || 10, 1, 100);

    let rows = await store.list();

    if (search) {
      rows = rows.filter((e) =>
        [e.firstName, e.lastName, e.email, e.position].join(" ").toLowerCase().includes(search)
      );
    }
    if (department) rows = rows.filter((e) => e.department === department);
    if (status) rows = rows.filter((e) => e.status === status);

    rows.sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
      return cmp * dir;
    });

    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const page = clamp(parseInt(req.query.page, 10) || 1, 1, totalPages);
    const data = rows.slice((page - 1) * limit, page * limit);

    res.json({ data, total, page, totalPages, limit });
  } catch (err) {
    next(err);
  }
});

// GET /api/employees/:id
router.get("/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid employee id" });

    const employee = await store.find(id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    res.json(employee);
  } catch (err) {
    next(err);
  }
});

// POST /api/employees
router.post("/", async (req, res, next) => {
  try {
    const { valid, data, errors } = validateEmployee(req.body);
    if (!valid) return res.status(422).json({ error: "Validation failed", errors });

    if (await emailTaken(data.email)) {
      return res.status(422).json({ error: "Validation failed", errors: { email: "This email is already in use" } });
    }

    const employee = await store.create(data);
    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
});

// PUT /api/employees/:id
router.put("/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid employee id" });

    const { valid, data, errors } = validateEmployee(req.body);
    if (!valid) return res.status(422).json({ error: "Validation failed", errors });

    if (await emailTaken(data.email, id)) {
      return res.status(422).json({ error: "Validation failed", errors: { email: "This email is already in use" } });
    }

    const employee = await store.update(id, data);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    res.json(employee);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/employees/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid employee id" });

    const removed = await store.remove(id);
    if (!removed) return res.status(404).json({ error: "Employee not found" });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;

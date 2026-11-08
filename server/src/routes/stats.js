import { Router } from "express";
import * as store from "../store.js";
import { DEPARTMENTS, STATUSES } from "../validate.js";

const router = Router();

// GET /api/stats — aggregate numbers for the dashboard cards and chart
router.get("/", async (req, res, next) => {
  try {
    const rows = await store.list();
    const total = rows.length;

    const byDepartment = Object.fromEntries(DEPARTMENTS.map((d) => [d, 0]));
    const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));

    const now = new Date();
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    let ageSum = 0;
    let salarySum = 0;
    let joinedThisMonth = 0;

    for (const e of rows) {
      byDepartment[e.department] = (byDepartment[e.department] ?? 0) + 1;
      byStatus[e.status] = (byStatus[e.status] ?? 0) + 1;
      ageSum += e.age;
      salarySum += e.salary;
      if (e.joinDate >= monthStart) joinedThisMonth += 1;
    }

    res.json({
      total,
      byDepartment,
      byStatus,
      joinedThisMonth,
      avgAge: total ? Math.round((ageSum / total) * 10) / 10 : 0,
      avgSalary: total ? Math.round(salarySum / total) : 0,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

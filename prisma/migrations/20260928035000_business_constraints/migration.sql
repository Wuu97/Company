-- Constraints intentionally kept in SQL: Prisma cannot model partial unique indexes.
CREATE UNIQUE INDEX "one_active_plan_per_container"
ON "LoadingPlanItem" ("containerUnitId")
WHERE active = true;

CREATE UNIQUE INDEX "unique_actual_container_number"
ON "ContainerUnit" ("containerNo")
WHERE "containerNo" IS NOT NULL;

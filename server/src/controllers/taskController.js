import prisma from "../../prisma/client.js";
import { assertRole, Roles } from "../utils/permissions.js";

const ensureProjectAccess = async (projectId, userId, orgId, isPrivileged) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: orgId },
    include: { access: true }
  });

  if (!project) {
    return { ok: false, status: 404, message: "Project not found in organization" };
  }

  if (isPrivileged) {
    return { ok: true, project };
  }

  const hasAccess = project.access.some((a) => a.userId === userId);
  if (!hasAccess) {
    return { ok: false, status: 403, message: "No access to this project" };
  }

  return { ok: true, project };
};

export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, projectId } = req.body;

    // Defensive role check (routes already enforce membership)
    assertRole(req.membership, [Roles.OWNER, Roles.ADMIN, Roles.MEMBER]);

    const isPrivileged = [Roles.OWNER, Roles.ADMIN].includes(req.membership.role);
    const accessCheck = await ensureProjectAccess(projectId, req.user.id, req.orgId, isPrivileged);
    if (!accessCheck.ok) {
      return res.status(accessCheck.status).json({ message: accessCheck.message });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "todo",
        priority: priority || "medium",
        userId: req.user.id,
        projectId
      },
      include: { project: true }
    });

    res.status(201).json(task);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const getOrgTasks = async (req, res) => {
  try {
    const isPrivileged = [Roles.OWNER, Roles.ADMIN].includes(req.membership.role);
    let tasks;

    if (isPrivileged) {
      tasks = await prisma.task.findMany({
        where: { project: { organizationId: req.orgId } },
        include: { project: true }
      });
    } else {
      const allowedProjectIds = await prisma.projectAccess.findMany({
        where: { userId: req.user.id, project: { organizationId: req.orgId } },
        select: { projectId: true }
      });

      tasks = await prisma.task.findMany({
        where: {
          projectId: { in: allowedProjectIds.map((p) => p.projectId) },
          project: { organizationId: req.orgId }
        },
        include: { project: true }
      });
    }

    res.json(tasks);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

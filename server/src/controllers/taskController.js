import prisma from "../../prisma/client.js";
import { assertRole, Roles } from "../utils/permissions.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, projectId } = req.body;

    // Defensive role check (routes already enforce membership)
    assertRole(req.membership, [Roles.OWNER, Roles.ADMIN, Roles.MEMBER]);

    // Ensure the project belongs to someone in the same org
    const orgMembers = await prisma.membership.findMany({
      where: { organizationId: req.orgId },
      select: { userId: true }
    });
    const memberIds = orgMembers.map(m => m.userId);

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: { in: memberIds }
      }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found in organization" });
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
    const orgMembers = await prisma.membership.findMany({
      where: { organizationId: req.orgId },
      select: { userId: true }
    });
    const memberIds = orgMembers.map(m => m.userId);

    const tasks = await prisma.task.findMany({
      where: { userId: { in: memberIds } },
      include: { project: true }
    });

    res.json(tasks);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

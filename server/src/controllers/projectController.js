import prisma from "../../prisma/client.js";
import { assertRole, Roles } from "../utils/permissions.js";

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Defensive check in case middleware was skipped
    assertRole(req.membership, [Roles.OWNER, Roles.ADMIN]);

    // req.orgId set by requireOrgAccess; project is owned by the authenticated user
    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId: req.user.id
      }
    });

    res.status(201).json(project);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const getOrgProjects = async (req, res) => {
  try {
    // Fetch all user IDs in the org, then return their projects
    const orgMembers = await prisma.membership.findMany({
      where: { organizationId: req.orgId },
      select: { userId: true }
    });
    const memberIds = orgMembers.map(m => m.userId);

    const projects = await prisma.project.findMany({
      where: { userId: { in: memberIds } },
      include: { tasks: true }
    });

    res.json(projects);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

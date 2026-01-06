import prisma from "../../prisma/client.js";
import { assertRole, Roles } from "../utils/permissions.js";

export const createProject = async (req, res) => {
  try {
    const { name, description, isPrivate, coverImage } = req.body;

    // Defensive check in case middleware was skipped
    assertRole(req.membership, [Roles.OWNER, Roles.ADMIN]);

    // req.orgId set by requireOrgAccess; project is owned by the authenticated user
    const project = await prisma.project.create({
      data: {
        name,
        description,
        isPrivate: Boolean(isPrivate),
        userId: req.user.id,
        organizationId: req.orgId,
        coverImage,
        access: {
          create: {
            userId: req.user.id
          }
        },
        team: {
          create: {
            userId: req.user.id,
            role: "owner"
          }
        }
      }
    });

    res.status(201).json(project);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, isPrivate, coverImage } = req.body;

    assertRole(req.membership, [Roles.OWNER, Roles.ADMIN]);

    const existing = await prisma.project.findFirst({
      where: { id: projectId, organizationId: req.orgId }
    });
    if (!existing) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: name ?? existing.name,
        description: description ?? existing.description,
        isPrivate: typeof isPrivate === "boolean" ? isPrivate : existing.isPrivate,
        coverImage: coverImage ?? existing.coverImage
      }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update project" });
  }
};

export const getOrgProjects = async (req, res) => {
  try {
    // If owner/admin: show all projects in org
    const isPrivileged = [Roles.OWNER, Roles.ADMIN].includes(req.membership.role);

    let projects;
    if (isPrivileged) {
      projects = await prisma.project.findMany({
        where: { organizationId: req.orgId },
        include: { tasks: true, team: true }
      });
    } else {
      // Members only see projects explicitly shared with them
      const allowedProjectIds = await prisma.projectAccess.findMany({
        where: { userId: req.user.id, project: { organizationId: req.orgId } },
        select: { projectId: true }
      });

      projects = await prisma.project.findMany({
        where: {
          id: { in: allowedProjectIds.map((p) => p.projectId) },
          organizationId: req.orgId
        },
        include: { tasks: true, team: true }
      });
    }

    res.json(projects);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export const grantProjectAccess = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    assertRole(req.membership, [Roles.OWNER, Roles.ADMIN]);

    const project = await prisma.project.findFirst({
      where: { id: projectId, organizationId: req.orgId }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const member = await prisma.membership.findFirst({
      where: { userId, organizationId: req.orgId }
    });

    if (!member) {
      return res.status(400).json({ message: "User is not in this organization" });
    }

    const access = await prisma.projectAccess.upsert({
      where: { projectId_userId: { projectId, userId } },
      update: {},
      create: { projectId, userId }
    });

    res.json(access);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to grant access" });
  }
};

export const revokeProjectAccess = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    assertRole(req.membership, [Roles.OWNER, Roles.ADMIN]);

    const project = await prisma.project.findFirst({
      where: { id: projectId, organizationId: req.orgId }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await prisma.projectAccess.deleteMany({
      where: { projectId, userId }
    });

    res.json({ message: "Access revoked" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to revoke access" });
  }
};

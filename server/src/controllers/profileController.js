import prisma from "../../prisma/client.js";

const isTaskComplete = (status = "") => {
  const normalized = status.toLowerCase();
  return ["done", "completed", "complete", "closed"].includes(normalized);
};

export const getMyProfile = async (req, res) => {
  try {
    let profile = await prisma.profile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: req.user.id,
          bio: "",
          avatarUrl: "",
          title: ""
        }
      });
    }

    const memberships = await prisma.membership.findMany({
      where: { userId: req.user.id },
      include: { organization: true }
    });

    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
      include: { tasks: true }
    });

    const completedProjects = projects.filter((p) => {
      if (p.tasks.length === 0) return false;
      return p.tasks.every((t) => isTaskComplete(t.status));
    });

    res.json({
      profile,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        provider: req.user.provider
      },
      organizations: memberships.map((m) => ({
        id: m.organization.id,
        name: m.organization.name,
        role: m.role
      })),
      completedProjects: completedProjects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { bio, avatarUrl, title } = req.body;

    const profile = await prisma.profile.upsert({
      where: { userId: req.user.id },
      update: {
        bio,
        avatarUrl,
        title
      },
      create: {
        userId: req.user.id,
        bio,
        avatarUrl,
        title
      }
    });

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

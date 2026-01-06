import prisma from "../../prisma/client.js";

export const createOrganization = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  const org = await prisma.organization.create({
    data: {
      name,
      members: {
        create: {
          role: "OWNER",
          userId
        }
      }
    }
  });

  res.json(org);
};

export const getMyOrganizations = async (req, res) => {
  const orgs = await prisma.membership.findMany({
    where: { userId: req.user.id },
    include: { organization: true }
  });

  res.json(orgs.map(o => o.organization));
};

export const inviteToOrganization = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { email, role = "MEMBER" } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existing = await prisma.membership.findFirst({
      where: { userId: user.id, organizationId: orgId }
    });

    if (existing) {
      return res.status(200).json(existing);
    }

    const membership = await prisma.membership.create({
      data: {
        userId: user.id,
        organizationId: orgId,
        role
      }
    });

    res.status(201).json(membership);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to invite user" });
  }
};

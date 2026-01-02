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

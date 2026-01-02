export const getBillingInfo = async (req, res) => {
  res.json({ message: "billing info fetched", user: req.user || null });
};

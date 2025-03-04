export const get500 = (req, res, next) => {
  res.status("500").render("500", { pageTitle: "Error page", path: "/500" });
};

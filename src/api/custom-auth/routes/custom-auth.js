module.exports = {
  routes: [
    {
      method: "POST",
      path: "/linkedinAuth",
      handler: "custom-auth.linkedinAuth",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

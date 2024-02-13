module.exports = ({ env }) => ({
  // ..
  transformer: {
    enabled: true,
    config: {
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      },
    },
  },
  "users-permissions": {
    config: {
      jwt: {
        expiresIn: "7d",
      },
    },
  },
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"),
      },
      settings: {
        defaultFrom: "bojanstanojevic89@gmail.com",
        defaultReplyTo: "bojanstanojevic89@gmail.com",
        testAddress: "bojanstanojevic89@gmail.com",
      },
    },
  },
  // ..
});

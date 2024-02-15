"use strict";

/**
 * A set of functions called "actions" for `custom-auth`
 */

module.exports = {
  linkedinAuth: async (ctx) => {
    try {
      const linkedinData = ctx.request.body;
      const user = await findOrCreateUser(linkedinData);
      // Issue a JWT token
      const jwtToken = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user.id,
      });
      ctx.send({ jwtToken, user });
    } catch (err) {
      ctx.body = err;
    }
  },
};

async function findOrCreateUser(linkedinData) {
  // Try to find the user by their LinkedIn ID
  let user = await strapi.db.query("plugin::users-permissions.user").findOne({
    where: { linkedinId: linkedinData.id },
  });

  if (!user) {
    // If the user doesn't exist, try to find the user by their email
    user = await strapi.db.query("plugin::users-permissions.user").findOne({
      where: { email: linkedinData.email },
    });

    if (user && !user.linkedinId) {
      // If the user exists but doesn't have a LinkedIn ID, update the user
      user = await strapi.db.query("plugin::users-permissions.user").update({
        where: { id: user.id },
        data: { linkedinId: linkedinData.id },
      });
    } else if (!user) {
      // If the user doesn't exist, create new user
      user = await strapi.db.query("plugin::users-permissions.user").create({
        data: {
          linkedinId: linkedinData.id,
          username: linkedinData.name,
          email: linkedinData.email,
          role: 1,
          confirmed: true,
          provider: "local",
        },
      });
    }
  }

  return user;
}

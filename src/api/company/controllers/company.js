"use strict";

/**
 * company controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::company.company", ({ strapi }) => ({
  async find(ctx, next) {
    const { data, meta } = await super.find(ctx);
    const stats = await Promise.all(
      data.map(async (company) => {
        const reviews = await strapi.entityService.findMany(
          "api::review.review",
          {
            fields: ["rating"],
            populate: { company: true },
            filters: {
              company: {
                id: {
                  $eq: company.id,
                },
              },
            },
          }
        );
        const totalRating = reviews.reduce(
          (total, review) => total + review.rating,
          0
        );
        const totalRatings = reviews.length;
        const averageRating =
          reviews.length > 0
            ? parseFloat((totalRating / reviews.length).toFixed(1))
            : 0;

        company.attributes.averageRating = averageRating;
        company.attributes.totalRatings = totalRatings;
        return company;
      })
    );
    return { data: stats, meta };
  },
}));

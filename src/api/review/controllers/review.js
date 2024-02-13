"use strict";

/**
 * review controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::review.review", ({ strapi }) => ({
  async find(ctx, next) {
    const { data, meta } = await super.find(ctx);

    const stats = await Promise.all(
      data.map(async (review) => {
        async function getCompanyId(reviewId) {
          const review = await strapi.entityService.findOne(
            "api::review.review",
            reviewId,
            {
              populate: { company: true },
            }
          );

          if (!review || !review.company) {
            throw new Error(
              `Review with id ${reviewId} does not exist or is not associated with a company`
            );
          }

          return review.company.id;
        }
        const companyId = await getCompanyId(review.id);
        if (ctx.query.populate.includes("company.logo.url")) {
          const reviews = await strapi.entityService.findMany(
            "api::review.review",
            {
              fields: ["rating"],
              populate: { company: true },
              filters: {
                company: {
                  id: {
                    $eq: companyId,
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
          review.attributes.companyAverageRating = averageRating;
          review.attributes.companyTotalRatings = totalRatings;
        }
        return review;
      })
    );
    return { data: stats, meta };
  },
}));

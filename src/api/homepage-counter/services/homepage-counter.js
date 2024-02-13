'use strict';

/**
 * homepage-counter service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::homepage-counter.homepage-counter');

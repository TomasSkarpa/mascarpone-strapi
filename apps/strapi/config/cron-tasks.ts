// https://docs.strapi.io/dev-docs/configurations/cron

const sayHelloJob = {
  task: ({ strapi }) => {
    // Add your own logic here (e.g. send a queue of email, create a database backup, etc.).
    console.log("A beautiful start to the week!")
  },
  /**
   * Simple example.
   * Every monday at 1am.
   */
  options: {
    rule: "0 0 1 * * 1",
  },
}

/**
 * Checks whether a fal generation is due (interval is configured on the singleton).
 * Runs daily; enable with CRON_ENABLED=true in .env.
 */
const scheduledFalImageJob = {
  task: async ({ strapi }) => {
    await strapi
      .service("api::scheduled-fal-image.scheduled-fal-image")
      .runGenerationIfDue()
  },
  options: {
    rule: "0 8 * * *",
  },
}

export default {
  sayHelloJob,
  scheduledFalImageJob,
}

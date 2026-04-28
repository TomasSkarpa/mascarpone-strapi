export default {
  routes: [
    {
      method: "POST",
      path: "/scheduled-fal-image/actions/run",
      handler: "scheduled-fal-image.run",
      config: {
        auth: false,
      },
    },
  ],
}

export default {
  routes: [
    {
      method: "GET",
      path: "/projects",
      handler: "project.find",
    },
    {
      method: "POST",
      path: "/projects",
      handler: "project.create",
    },
    {
      method: "GET",
      path: "/projects/:id",
      handler: "project.findOne",
    },
    {
      method: "PUT",
      path: "/projects/:id",
      handler: "project.update",
    },
    {
      method: "DELETE",
      path: "/projects/:id",
      handler: "project.delete",
    },
  ],
}

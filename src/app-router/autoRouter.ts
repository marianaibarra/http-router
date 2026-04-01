import { AutoRouter } from "../router/AutoRouter.js";

const autoRouter = AutoRouter({});

autoRouter.get("/", (req) => {
  return { hola: "mundo" };
});

export default autoRouter;

import { Router } from "../router/Router.js";

const router = Router({
  middlewares: [
    (req) => {
      console.log(`[New request] ${req.route} ${req.method}`);
    },
  ],
  catch: (error, req) => {
    console.log("Ocurrio un error");
  },
  finally: [
    (res, req) => {
      console.log(res);
      // console.log(`Request answered ${JSON.stringify(res.)}`);
    },
  ],
});

router.get("/", (req) => {
  // console.log("req", req);
  return new Response("OK");
});

router.get("/groups", (req) => {
  return Response.json([
    {
      id: 5,
      name: "NewJeans",
      members: ["Minji", "Hanni", "Danielle", "Haerin", "Hyein"],
      debutYear: 2022,
    },
  ]);
});

router.get("/groups/:id", (req: any) => {
  // console.log(req.params.id);

  return Response.json([
    {
      id: 5,
      name: "NewJeans",
      members: ["Minji", "Hanni", "Danielle", "Haerin", "Hyein"],
      debutYear: 2022,
    },
  ]);
});

export default router;

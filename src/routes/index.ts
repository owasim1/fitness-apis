import auth from "./authRoutes.js";

export default function (app: any) {
  app.use("/api/auth", (req: any, res: any, next: any) => {
    auth(req, res, next);
  });
}

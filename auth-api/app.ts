import { Application } from "zoltra";
import { AuthService } from "./services/auth";

const app = new Application();

app.enableCors();

app.service("auth", new AuthService(String(app.env.get("JWT_AUTH_SECRET"))));

app.get("/hello", (context) => {
  return context.json({ message: "Hello world" });
});

app.listen(app.env.get("PORT"));

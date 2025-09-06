import { Application } from "zoltra";

const app = new Application();

app.enableCors();

app.get("/hello", (context) => {
  return context.json({ message: "hello world" });
});

app.listen(app.env.get("PORT"));

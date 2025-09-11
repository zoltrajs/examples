import { Application } from "zoltra";

const app = new Application();

app.enableCors();

app.get("/hello", (context) => {
  return context.text("hello world");
});

app.listen();

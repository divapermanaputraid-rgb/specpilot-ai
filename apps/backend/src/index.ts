import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
  console.log(`SpecPilot AI backend listening on http://localhost:${env.PORT}`);
  if (env.isMockMode) {
    console.log("Mock mode enabled: missing AI/database environment variables.");
  }
});

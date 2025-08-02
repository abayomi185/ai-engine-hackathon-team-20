import { Runware } from "@runware/sdk-js";

import { env } from "~/env";
const runware = new Runware({ apiKey: env.RUNWARE_API_KEY });

const images = await runware.requestImages({
  positivePrompt: "A serene mountain landscape at sunset",
  model: "runware:101@1",
  width: 1024,
  height: 1024,
});

console.log("Generated image:", images[0].imageURL);

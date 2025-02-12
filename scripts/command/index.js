import { parseCommand } from "./system.js";
import { world as ServerWorld } from "@minecraft/server";

ServerWorld.beforeEvents.chatSend.subscribe((event) => {
  if (event.targets) return;
  if (event.message[0] !== "!") return;
  event.cancel = true;
  const command = event.message.substring(1);
  const sender = event.sender;
  parseCommand(sender, command);
});

import {
  world as ServerWorld,
  system as ServerSystem,
} from "@minecraft/server";
import { sandbox } from "../lib/sandbox.js";
import { parse_scene } from "./parser.js";

function run_in_sandbox(player, scene) {
  return sandbox(scene, {
    PlayerCamera: player.camera,
    Player: player,
    ServerWorld,
    ServerSystem,
  });
}

function play_frames(frames, player) {
  const data = frames.join("\n");
  try {
    return run_in_sandbox(player, data);
  } catch (e) {
    console.error(
      "Some errors occurred during the execution of frames:",
      e,
      e.stack,
    );
    return null;
  }
}

function play_scene(scene, players) {
  const frames = parse_scene(scene);
  const wait_frames = players.map((player) => play_frames(frames, player));
  if (wait_frames.length > 0) {
    return Promise.all(wait_frames);
  } else {
    return Promise.resolve(0);
  }
}

async function play_scenes(scenes, scenes_composer, players) {
  const scenes_status = new Array(scenes.length).fill(null);
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const composer = scenes_composer[i];
    switch (composer.order) {
      case "top":
        scenes_status[i] = play_scene(scene, players);
        break;
      case "follow":
        if (i > 0) {
          await scenes_status[i - 1];
        } else {
          console.warn("'follow' order not applicable for the first scene");
        }
        scenes_status[i] = play_scene(scene, players);
        break;
      default:
        console.warn("The scene used a nonexistent order");
        scenes_status[i] = play_scene(scene, players);
        break;
    }
  }
  return 0;
}

export { play_scene, play_scenes };

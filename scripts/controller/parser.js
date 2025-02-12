import { operator_map } from "./maps/operator_map.js";

function parse_scene(scene, type = "script") {
  let results = [];
  for (const frame of scene.frames) {
    var result = operator_map[frame.operator](type, ...frame.args);
    results.push(result);
  }
  return results;
}

export { parse_scene };

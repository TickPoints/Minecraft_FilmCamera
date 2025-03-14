// This is a library of service operations for communicating with user controllers such as command systems and UI.
import { world as ServerWorld } from "@minecraft/server";
import { translate } from "../../text/local.js";
import { printToPlayer } from "../../text/print.js";
import { getDataManager } from "../../lib/data_manager.js";
import { operator_meta_map } from "../maps/operator_meta_map.js";
import { play_scenes } from "../player.js";

const worldData = getDataManager(ServerWorld);

function hasPermission(player) {
    return player.hasTag("camera_editor");
}

function isProjectEditing(player) {
    const { current_project } = getDataManager(player);
    return current_project != null;
}

function openProject(player, project) {
    if (
        !Object.keys(project).includes("name") ||
        !Object.keys(project).includes("type")
    ) {
        console.error("The project data provided is incorrect!");
        return;
    }
    const playerData = getDataManager(player);
    if (isProjectEditing(player)) {
        printToPlayer(
            player,
            translate(
                "filmcamera.scripts.editor.project.cannot_open.project_already_opend",
                playerData.current_project.name,
                project.name
            ),
            "$filmcamera.scripts.editor.meta.source_id",
            "ERROR"
        );
        return;
    }
    switch (project.type) {
        case "public":
            if (typeof worldData.projects[project.name] === "undefined") {
                printToPlayer(
                    player,
                    translate(
                        "filmcamera.scripts.editor.project.cannot_open.not_exist",
                        player.name,
                        playerData.current_project
                    ),
                    "$filmcamera.scripts.editor.meta.source_id",
                    "ERROR"
                );
                return;
            }
            break;
        case "private":
            if (typeof playerData.projects[project.name] === "undefined") {
                printToPlayer(
                    player,
                    translate(
                        "filmcamera.scripts.editor.project.cannot_open.not_exist",
                        player.name,
                        playerData.current_project
                    ),
                    "$filmcamera.scripts.editor.meta.source_id",
                    "ERROR"
                );
                return;
            }
            break;
        default:
            console.error("The project.type is unavailable.");
            return;
    }
    playerData.current_project = {
        type: project.type,
        source: project.type === "private" ? player.name : undefined,
        name: project.name
    };
    printToPlayer(
        player,
        translate(
            "filmcamera.scripts.editor.project.opendMessage",
            project.name
        ),
        "$filmcamera.scripts.editor.meta.source_id"
    );
}

function getOptionalProjectsList(player) {
    const playerData = getDataManager(player);
    let list = {
        raw: [],
        name: []
    };
    for (const i of Object.keys(playerData.projects)) {
        list.raw.push({
            type: "private",
            name: i,
            source: player.name
        });
    }
    for (const i of Object.keys(worldData.projects)) {
        list.raw.push({
            type: "public",
            name: i
        });
    }
    if (JSON.stringify(list.raw) === "[]") {
        printToPlayer(
            player,
            translate(
                "filmcamera.scripts.editor.project.cannot_open.no_optional_projects"
            ),
            "$filmcamera.scripts.editor.meta.source_id",
            "ERROR"
        );
        return null;
    }
    for (const i of list.raw) {
        list.name.push(`[${i.type}] ${i.name}`);
    }
    return list;
}

function initProject(player, projectConfig) {
    if (!hasPermission(player)) {
        printToPlayer(
            player,
            translate("filmcamera.scripts.no_permission"),
            "$filmcamera.scripts.editor.meta.source_id",
            "ERROR"
        );
        return;
    }
    var projectData = {
        scenes: [],
        scenes_composer: [],
        config: {}
    };
    switch (projectConfig.type) {
        case "private": {
            const playerData = getDataManager(player);
            playerData.projects[projectConfig.name] = projectData;
            break;
        }
        case "public": {
            worldData.projects[projectConfig.name] = projectData;
            break;
        }
        default:
            return;
    }
    openProject(player, projectConfig);
    printToPlayer(
        player,
        translate("filmcamera.scripts.editor.project.init.success"),
        "$filmcamera.scripts.editor.meta.source_id"
    );
}

function getCurrentProjectData(player) {
    if (!isProjectEditing(player)) {
        printToPlayer(
            player,
            translate("filmcamera.scripts.editor.project.not_opend"),
            "$filmcamera.scripts.editor.meta.source_id",
            "ERROR"
        );
        return null;
    }
    const { current_project } = getDataManager(player);
    const { type, name } = current_project;
    return type === "public"
        ? worldData.projects[name]
        : playerData.projects[name];
}

function getCurrentProjectMeta(player) {
    const playerData = getDataManager(player);
    return playerData.current_project;
}

function getCurrentWorldData(player) {
    if (!hasPermission(player)) {
        console.error(
            "You cannot access the current world data without permission!"
        );
        return;
    }
    return getDataManager(ServerWorld);
}

function getCurrentPlayerData(player) {
    if (!hasPermission(player)) {
        console.error(
            "You cannot access the current world data without permission!"
        );
        return;
    }
    return getDataManager(player);
}

function addScene(player) {
    const projectData = getCurrentProjectData(player);
    projectData.scenes.push({
        frames: []
    });
    projectData.scenes_composer.push({
        order: "top"
    });
}

function removeScene(player, index) {
    const projectData = getCurrentProjectData(player);
    projectData.scenes.splice(index, 1);
    projectData.scenes_composer.splice(index, 1);
}

function playProjectForEditor(projectData, player) {
    return play_scenes(projectData.scenes, projectData.scenes_composer, [
        player
    ]);
}

export {
    openProject,
    getOptionalProjectsList,
    initProject,
    isProjectEditing,
    getCurrentProjectData,
    getCurrentProjectMeta,
    hasPermission,
    getCurrentWorldData,
    getCurrentPlayerData,
    addScene,
    removeScene,
    operator_meta_map as OptionalOperator,
    playProjectForEditor
};

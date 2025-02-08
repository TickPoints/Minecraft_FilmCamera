// This is a library of service operations for communicating with user controllers such as command systems and UI.
import {
    world as ServerWorld
}
from "@minecraft/server";
import {
    translate
}
from "../../text/local.js";
import {
    print_to_player
}
from "../../text/print.js";
import {
    getDataManager
}
from "../../lib/data_manager.js";

function hasPermission(player) {
    return player.hasTag("camera_editor");
}

function isProjectEditing(player) {
    const playerData = getDataManager(player);
    if (playerData.current_project !== null) {
        print_to_player(player, translate("filmcamera.scripts.editor.project.cannot_open.project_already_opend", project.name, playerData.current_project.name), "$filmcamera.scripts.editor.meta.source_id", "ERROR");
        return true;
    }
    return false;
}

function openProject(player, project) {
    if (project.name == undefined || project.type == undefined) {
        console.error("The project data provided is incorrect!");
        return;
    }
    if (isProjectEditing(player)) return;
    switch (project.type) {
        case "public":
            const worldData = getDataManager(ServerWorld);
            if (typeof worldData.projects[project.name] === "undefined") {
                print_to_player(player, translate("filmcamera.scripts.editor.project.cannot_open.not_exist", name, playerData.current_project), "$filmcamera.scripts.editor.meta.source_id", "ERROR");
                return;
            }
            break;
        case "private":
            const playerData = getDataManager(player);
            if (typeof playerData.projects[project.name] === "undefined") {
                print_to_player(player, translate("filmcamera.scripts.editor.project.cannot_open.not_exist", name, playerData.current_project), "$filmcamera.scripts.editor.meta.source_id", "ERROR");
                return;
            }
            break;
        default:
            console.error("The project.type is unavailable.");
            return;
    }
    playerData.current_project = {
        "type": project.type,
        "source": project.type ? player.name : undefined,
        "name": project.name
    };
    print_to_player(player, translate("filmcamera.scripts.editor.project.opendMessage", name), "$filmcamera.scripts.editor.meta.source_id");
}

function getOptionalProjectsList(player) {
    const playerData = getDataManager(player);
    const worldData = getDataManager(ServerWorld);
    let list = {
        "raw": [],
        "name": []
    };
    for (const i of Object.keys(playerData.projects)) {
        list.raw.push({
            "type": "private",
            "name": i,
            "source": player.name
        });
    }
    for (const i of Object.keys(worldData.projects)) {
        list.raw.push({
            "type": "public",
            "name": i
        });
    }
    if (JSON.stringify(list.raw) === "[]") {
        print_to_player(player, translate("filmcamera.scripts.editor.project.cannot_open.no_optional_projects"), "$filmcamera.scripts.editor.meta.source_id", "ERROR");
        return null;
    }
    for (const i of list.raw) {
        list.name.push(`[${i.type}] ${i.name}`);
    }
    return list;
}

function initProject(player, projectConfig) {
    if (!hasPermission(player)) {
        print_to_player(player, translate("filmcamera.scripts.no_permission"), "$filmcamera.scripts.editor.meta.source_id", "ERROR");
        return;
    }
    const projectData = {
        "scenes": [],
        "scenes_composer": [],
        "config": {}
    };
    const playerData = getDataManager(player);
    switch (projectConfig.type) {
        case "public":
            const worldData = getDataManager(ServerWorld);
            worldData.projects[projectConfig.name] = projectData;
            playerData.current_project = {
                type: "public",
                name: projectConfig.name
            };
            break;
        case "private":
            playerData.projects[projectConfig.name] = projectData;
            playerData.current_project = {
                type: "private",
                name: projectConfig.name,
                source: player.name
            };
            break;
        default:
            return;
    }
    print_to_player(player, translate("filmcamera.scripts.editor.project.init.success"), "$filmcamera.scripts.editor.meta.source_id");
}

export {
    openProject,
    getOptionalProjectsList,
    initProject,
    isProjectEditing
};
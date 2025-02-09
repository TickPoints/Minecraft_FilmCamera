import {
    translate,
    raw
}
from "../text/local.js";
import * as ui from "./module.js";
import * as dockingTool from "../controller/editor_monitor/docking_tool.js";

export const ui_list = {
    "menu": function(player) {
        const root = new ui.ActionUI();
        root.title = "$filmcamera.scripts.ui.new.menu.title";
        root.message = "$filmcamera.scripts.ui.new.menu.message";
        root.list = [
            "$filmcamera.scripts.ui.new.menu.button1",
            "$filmcamera.scripts.ui.new.menu.button2"
        ];
        root.func = [
            function(player) {
                ui_list.editor_menu(player);
            },
            function(player) {
                ui_list.setting_menu(player);
            }
        ];
        root.preventBusy();
        root.build();
        root.show(player);
    },
    "setting_menu": function(player) {
        const root = new ui.ActionUI();
        root.title = "$filmcamera.scripts.ui.new.setting_menu.title";
        root.message = "$filmcamera.scripts.ui.new.setting_menu.message";
        root.list = [
            "Debug"
        ];
        root.func = [
            function(player) {
                ui_list.debug_page(player);
            }
        ];
        root.UserClosedProcessor = function(player) {
            ui_list.menu(player);
        };
        root.build();
        root.show(player);
    },
    "debug_page": function(player) {
        const root = new ui.ModalUI();
        root.title = "DEBUG";
        root.message = "For checking data to debug.";
        const CurrentWorldData = dockingTool.getCurrentWorldData(player);
        const PlayerWorldData = dockingTool.getCurrentPlayerData(player);
        if (!CurrentWorldData) return;
        root.list = [
            ["textField", "WorldData", "Current WorldData", `#${JSON.stringify(CurrentWorldData)}`],
            ["textField", "ThisPlayerData", "Current PlayerData", `#${JSON.stringify(PlayerWorldData)}`]
        ];
        root.func = function(player, values) {
            // empty
        };
        root.UserClosedProcessor = function(player) {
            ui_list.setting_menu(player);
        };
        root.build();
        root.show(player);
    },
    "editor_working": function(player) {
        const root = new ui.ActionUI();
        const projectData = dockingTool.getCurrentProjectData(player);
        if (projectData == null) return;
        const projectMeta = dockingTool.getCurrentProjectMeta(player);
        root.title = "$filmcamera.scripts.ui.new.editor_working.title";
        root.message = translate("filmcamera.scripts.ui.new.editor_working.message", projectMeta.name, projectMeta.type, projectMeta.source);
        root.list = [
            "$filmcamera.scripts.ui.new.editor_working.button1",
            "$filmcamera.scripts.ui.new.editor_working.button2"
        ];
        for (const scene of Object.keys(projectData.scenes)) {
            root.list.push(scene);
        }
        root.func = [
            function(player) {
                player.sendMessage("Working...");
            },
            function(player) {
                player.sendMessage("Working...");
            }
        ];
        for (const scene of Object.keys(projectData.scenes)) {
            root.func.push(function (player) {
                player.sendMessage("Working...");
            });
        }
        root.build();
        root.show(player);
    },
    "editor_menu": function(player) {
        if (dockingTool.isProjectEditing(player)) {
            ui_list.editor_working(player);
            return;
        }
        const root = new ui.ActionUI();
        root.title = "$filmcamera.scripts.ui.new.editor_menu.title";
        root.message = "$filmcamera.scripts.ui.new.editor_menu.message";
        root.list = [
            "$filmcamera.scripts.ui.new.editor_menu.button1",
            "$filmcamera.scripts.ui.new.editor_menu.button2",
            "$filmcamera.scripts.ui.new.editor_menu.button3"
        ];
        root.func = [
            function(player) {
                ui_list.editor_new_setName(player);
            },
            function(player) {
                ui_list.editor_project_open(player);
            },
            function(player) {
                player.sendMessage("Working...");
            }
        ];
        root.UserClosedProcessor = function(player) {
            ui_list.menu(player);
        };
        root.build();
        root.show(player);
    },
    "editor_project_open": function(player) {
        const root = new ui.ActionUI();
        root.title = "$filmcamera.scripts.ui.new.editor_project_open.title";
        root.message = "$filmcamera.scripts.ui.new.editor_project_open.message";
        const list = dockingTool.getOptionalProjectsList(player);
        if (list == null) return;
        root.list = list.name;
        for (const project of list.raw) {
            root.func.push(function(player) {
                dockingTool.openProject(player, project);
                ui_list.editor_working(player);
            });
        }
        root.UserClosedProcessor = function(player) {
            ui_list.menu(player);
        };
        root.build();
        root.show(player);
    },
    "editor_new_setName": function(player) {
        const root = new ui.ModalUI();
        root.title = "$filmcamera.scripts.ui.new.editor_new.title";
        root.message = "$filmcamera.scripts.ui.new.editor_new_setName.message";
        root.list = [
            ["textField", "$filmcamera.scripts.ui.new.editor_new_setName.nameInput.label", "$filmcamera.scripts.ui.new.editor_new_setName.nameInput.placeholderText"]
        ];
        root.func = function(player, values) {
            const result = values[0];
            if (!/^[a-zA-Z0-9_]+$/.test(result)) {
                root.show(player);
                return;
            }
            ui.tip(player, translate("filmcamera.scripts.ui.new.editor_new_setName.tip.message", result), function() {
                ui_list.editor_new_setting(player, result);
            }, function() {
                ui_list.editor_new_setName(player);
            });
        };
        root.UserClosedProcessor = function(player) {
            ui_list.editor_menu(player);
        };
        root.build();
        root.show(player);
    },
    "editor_new_setting": function(player, projectName) {
        const root = new ui.ModalUI();
        root.title = "$filmcamera.scripts.ui.new.editor_new_setting.title";
        root.message = "$filmcamera.scripts.ui.new.editor_new_setting.message";
        root.submitMessage = "$filmcamera.scripts.ui.new.editor_new_setting.submitMessage";
        root.list = [
            ["dropdown", "$filmcamera.scripts.ui.new.editor_new_setting.belonging_selection.label", [translate("filmcamera.scripts.ui.new.editor_new_setting.belonging_selection.public"), translate("filmcamera.scripts.ui.new.editor_new_setting.belonging_selection.private")]]
        ];
        root.func = function(player, values) {
            dockingTool.initProject(player, {
                "name": projectName,
                "type": ["public", "private"][values[0]]
            });
        };
        root.preventCanceled();
        root.build();
        root.show(player);
    }
};
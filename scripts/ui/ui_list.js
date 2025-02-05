import * as ui from "./module.js";

export const ui_list = {
    "menu": function(player) {
        const root = new ui.ActionUI();
        root.title = "$filmcamera.scripts.ui.new.menu.title";
        root.message = "$filmcamera.scripts.ui.new.menu.message";
        root.list = [
            "编辑器",
            "设置"
        ];
        root.func = [
            function(player) {
                player.sendMessage("Test!");
            },
            function(player) {
            
            }
        ];
        root.preventBusy();
        root.build();
        root.show(player);
    }
};
// build a user-friendly UI project.
// Import original UI
import {
    ActionFormData,
    MessageFormData,
    ModalFormData
}
from "@minecraft/server-ui";
import {
    raw
}
from "../text/local.js";

function splitArray(arr, n) {
    return arr.reduce((acc, _, index) => {
        let subIndex = Math.floor(index / n);
        if (!acc[subIndex]) {
            acc[subIndex] = [];
        }
        acc[subIndex].push(arr[index]);
        return acc;
    }, []);
}

// Build a new UI classes.
class ActionUI {
    constructor() {};
    _rootUI = new ActionFormData();
    UserCanceledProcessor() {};
    UserBusyProcessor() {};
    UserClosedProcessor() {};
    title = "Unknown";
    message = "Unknown";
    list = [];
    func = [];
    build() {
        const rootUI = this._rootUI;
        rootUI.title(raw(this.title));
        rootUI.body(raw(this.message));
        for (const i of this.list) {
            if (typeof i === "string") rootUI.button(raw(i));
            else rootUI.button(raw(i[0]), i[1]);
        }
        return this;
    };
    preventBusy() {
        this.UserBusyProcessor = function(player) {
            this.show(player);
        }
        return this;
    };
    preventCanceled() {
        this.UserCanceledProcessor = function(player) {
            this.show(player);
        }
        return this;
    };
    show(player) {
        this.build();
        const rootUI = this._rootUI;
        return rootUI.show(player).then(response => {
            if (!response.canceled) {
                func[response.selection](player);
            }
            switch (response.cancelationReason) {
                case "UserBusy":
                    this.UserBusyProcessor(player);
                    break;
                case "UserClosed":
                    this.UserClosedProcessor(player);
                    break;
                default:
                    return;
            }
            this.UserCanceledProcessor(player);
        });
    };
}


// Special UI
class MultiPageUI {
    constructor() {};
    _rootUIs = [];
    UserCanceledProcessor() {};
    UserBusyProcessor() {};
    UserClosedProcessor() {};
    title = "Unknown";
    message = [
        "Unknown"
    ];
    list = [];
    func = [];
    pageValue = 10;
    preventBusy() {
        this.UserBusyProcessor = function(player, page) {
            this.show(player, page);
        }
        return this;
    };
    preventCanceled() {
        this.UserCanceledProcessor = function(player) {
            this.show(player, page);
        }
        return this;
    };
    build() {
        const lists = splitArray(this.list, this.pageValue);
        const rootUIs = this._rootUIs;
        for (let i = 0; i < lists.length; i++) {
            rootUIs[i] = new ActionFormData();
            const rootUI = rootUIs[i];
            rootUI.title({
                "rawtext": [
                    raw(title),
                    {
                        "text": ` [${i + 1}/${lists.length}]`
                    }
                ]
            });
            rootUI.body(raw(this.message[i]));
            rootUI.button(raw("$"));
            for (const buttonData of lists[i]) {
                if (typeof buttonData === "string") rootUI.button(raw(buttonData));
                else rootUI.button(raw(buttonData[0]), buttonData[1]);
            }
            rootUI.button(raw("$"));
        }
        return this;
    };
    show(player, pageIndex = 0) {
        this.build();
        const rootUIs = this._rootUIs;
        return rootUIs[pageIndex].show(player).then(response => {
            if (!response.canceled) {
                const func = splitArray(this.func, this.pageValue)[pageIndex];
                if (response.selection > 0) {
                    func[response.selection](player);
                    return;
                }
                if (response.selection === 0) {
                    if (pageIndex === 0) return rootUIs[pageIndex].show(player);
                    return rootUIs[pageIndex - 1].show(player);
                }
                if (response.selection === rootUIs.length) {
                    if (pageIndex === 0) return rootUIs[pageIndex].show(player);
                    return rootUIs[pageIndex + 1].show(player);
                }
            }
            switch (response.cancelationReason) {
                case "UserBusy":
                    this.UserBusyProcessor(player, pageIndex);
                    break;
                case "UserClosed":
                    this.UserClosedProcessor(player, pageIndex);
                    break;
                default:
                    return;
            }
            this.UserCanceledProcessor(player, pageIndex);
        });
    }
}

class BookUI extends MultiPageUI {
    pageValue = 10;
    list = [];
    func = [];
}

export {
    ActionUI,
    MultiPageUI
};
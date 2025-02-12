import {
    world as ServerWorld,
    system as ServerSystem,
} from "@minecraft/server";

function getTimestamp() {
    return new Date().getTime();
}

const timeTypeMap = {
    realistic_stamp: function ({ time_stamp }) {
        let hasTriggered = false;
        return function (trigger) {
            if (!hasTriggered && getTimestamp() <= time_stamp) {
                trigger();
                hasTriggered = true;
            }
        };
    },
    realistic_date: function ({ year, month, day, hours, minutes, seconds }) {
        let hasTriggered = false;
        function getCurrentDateTime() {
            const now = new Date();
            const cur_year = now.getFullYear();
            const cur_month = now.getMonth() + 1;
            const cur_day = now.getDate();
            const cur_hours = now.getHours();
            const cur_minutes = now.getMinutes();
            const cur_seconds = now.getSeconds();
            return new Date(
                cur_year,
                cur_month - 1,
                cur_day,
                cur_hours,
                cur_minutes,
                cur_seconds,
            ).getTime();
        }
        return function (trigger) {
            const target = new Date(
                year,
                month - 1,
                day,
                hours,
                minutes,
                seconds,
            ).getTime();
            if (!hasTriggered && getCurrentDateTime() <= target) {
                trigger();
                hasTriggered = true;
            }
        };
    },
    minecraft_stamp: function ({ time_stamp }) {
        let hasTriggered = false;
        return function (trigger) {
            if (!hasTriggered && ServerWorld.getAbsoluteTime() <= time_stamp) {
                trigger();
                hasTriggered = true;
            }
        };
    },
    minecraft_tick: function ({ tick }) {
        let hasTriggered = false;
        return function (trigger) {
            if (!hasTriggered && ServerSystem.currentTick <= tick) {
                trigger();
                hasTriggered = true;
            }
        };
    },
};

function parseAbsoluteTime(time) {
    return timeTypeMap[time.type](time);
}

function parseRelativeTime(time, sourceTime) {
    return function (trigger) {
        parseAbsoluteTime(sourceTime)(async () => {
            await handleRelativeTime(time, trigger);
        });
    };
}

async function handleRelativeTime(time, trigger) {
    switch (time.type) {
        case "minecraft_tick":
            await ServerSystem.waitTicks(time.tick);
            trigger();
            break;
        default:
            trigger();
            return;
    }
}

export { parseAbsoluteTime, parseRelativeTime };

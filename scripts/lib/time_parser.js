import {
    world as ServerWorld,
    system as ServerSystem
}
from "@minecraft/server";

const time_type_map = {
    "realistic_stamp": function({ time_stamp }) {
        function getTimeStamp() {
            return new Date().getTime();
        }
        let hasTriggered = false;
        return function(trigger) {
            if (!hasTriggered && getTimeStamp() <= time_stamp) {
                trigger();
                hasTriggered = true;
            }
        };
    },
    "realistic_date": function({ year, month, day, hours, minutes, seconds }) {
        function getCurrentDateTime() {
            const now = new Date();
            const cur_year = now.getFullYear();
            const cur_month = now.getMonth() + 1;
            const cur_day = now.getDate();
            const cur_hours = now.getHours();
            const cur_minutes = now.getMinutes();
            const cur_seconds = now.getSeconds();
            return new Date(cur_year, cur_month - 1, cur_day, cur_hours, cur_minutes, cur_seconds).getTime();
        }
        let hasTriggered = false;
        return function(trigger) {
            const target = new Date(year, month - 1, day, hours, minutes, seconds).getTime();
            if (!hasTriggered && getCurrentDateTime() <= target) {
                trigger();
                hasTriggered = true;
            }
        };
    },
    "minecraft_stamp": function({ time_stamp }) {
        let hasTriggered = false;
        return function(trigger) {
            if (!hasTriggered && ServerWorld.getAbsoluteTime() <= time_stamp) {
                trigger();
                hasTriggered = true;
            }
        };
    },
    "minecraft_tick": function({ tick }) {
        let hasTriggered = false;
        return function(trigger) {
            if (!hasTriggered && ServerSystem.currentTick <= tick) {
                trigger();
                hasTriggered = true;
            }
        };
    }
};

function parse_absolute_time(time) {
    return time_type_map[time.type](time);
}

function parse_relative_time(time, sourceTime) {
    parse_absolute_time(sourceTime)
}
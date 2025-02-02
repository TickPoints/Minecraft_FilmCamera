export const entry = {
    "scenes": [{
        "frames": [{
            "operator": "camera-clear",
            "args": []
        }, {
            "operator": "player-runMinecraftCommand",
            "args": [
                "say Hello"
            ]
        }, {
            "operator": "time-waitTicks",
            "args": [
                20
            ]
        }, {
            "operator": "player-runMinecraftCommand",
            "args": [
                "say FilmCamera"
            ]
        }]
    }],
    "scenes_composer": [{
        "order": "top"
    }]
};
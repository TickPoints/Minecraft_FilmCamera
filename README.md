# About
FilmCamera is a convenient "/camera" tool based on SAPI.

This addon uses `GPL` license.
___
# Adapt
The first thing to note is that FilmCamera is always available for the latest stable Bedrock version, but you can also use it in some versions, but you need to pay attention to the following:
* FilmCamera uses the `/camera` command, which was added to the game in version `1.20.0` and cannot be used in versions earlier than that.
* FilmCamera uses experimental creator lenses and cameras, which were added to the game in version `1.21.20.23`, and do not work well below that.
* SAPI has a major revision in `1.9.0` (this is the SAPI version), which is also around `1.20.0`, and is not available below this version.
Once you know these things, you can try compatibility:
1. Open the `manifest.json` under the behavior pack directory, and modify the `header.min_engine_version` entry to the version you need
2. `dependencies[1].version` to `1.10.0` (this is the lowest item, if you have a certain development foundation, you can try to modify higher)
## About Source Code
On Github and other platforms, in order to display all the code, we put the resource package files in the 'Resources' directory under the behavior package folder, and the relevant documents and LICENSE are also under the behavior package, which is not particularly safe. And you can't just package the source code and run it. If you have some development base, you can package it yourself (the latest committed data is not necessarily safe), otherwise get the package from the distribution file or somewhere else.
___
# Describe
Suitable for use by individuals or multiple people to build world scenarios.

Principal Author: [TickPoints](https://github.com/TickPoints)

Publicly available:

* Github: https://github.com/TickPoints/Minecraft_FilmCamera
___
# More
If you need more languages, please read [this](./Documents/README/index.md).

Read [document](./Documents/en/index.md).
# 关于
FilmCamera 是一款基于`SAPI`的 "/camera" 命令工具。

该Addon使用`GPL`协议开源。
___
# 兼容
首先要注意的是，FilmCamera总是为最新正式基岩版提供服务，但您也可以在一些版本中使用，不过需要注意有关事项：
* FilmCamera使用了`/camera`命令，它在`1.20.0`版本被加入游戏，低于该版本的均无法使用。
* FilmCamera使用了实验性的创作者镜头和相机，它们在`1.21.20.23`版本被加入游戏，低于该版本的无法较好的运行。
* SAPI在`1.9.0`(这是SAPI版本)有较大的修改，这同样在`1.20.0`版本左右，低于该版本的均无法使用。
了解这些内容之后，您可以尝试进行兼容性操作：
1. 打开行为包目录下的`manifest.json`，修改`header.min_engine_version`条目为您所需要的版本
2. 修改`dependencies[1].version`为`1.10.0`(这是至低项，如果您有一定的开发基础，可以尝试修改更高)
## 有关源代码
Github等平台上为了能展示所有的代码，我们把资源包文件放到了行为包文件夹下的`Resources`目录，有关文档和LICENSE也同样在行为包下，这并不是特别安全。而且您也不可以直接将源代码打包后直接运行。如果您有一些开发基础，可以自己打包(最新提交的数据不一定是安全的)，否则请从发行版文件或其他地方获取包。
___
# 描述
适合个人或多人使用来构建世界场景。

主作: [TickPoints](https://github.com/TickPoints)

公开支持:

* Github: https://github.com/TickPoints/Minecraft_FilmCamera
___
# 更多
如果您需要更多语言，请阅读 [这个](./index.md)。

欲了解更多，请阅读 [文档](../zh/index.md)。
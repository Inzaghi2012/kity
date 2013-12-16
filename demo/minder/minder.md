# 脑图 Demo 功能点

# 整体设计

## MinderNode

MinderNode 是 Kity Minder 需要展示和控制的树的一个节点。节点上提供了*树遍历*和*数据存取*的功能。并且提供对节点对应的渲染容器（Kity.Group）的访问

节点上提供公开字段，任何模块可以读取和修改，这些字段会提供给 KityMinder 作为渲染的依据。

公开的字段和存放的数据都会在导出、保存现场的时候被保留。

MinderTreeNode 维护的树关系和数据只是作为一个脑图的结构和数据，不具有任何渲染和交互的能力。

### 树遍历

通过 6 个接口来进行树的访问和修改操作

`node.getParent()` 返回当前节点的父节点

`node.getChildren()` 返回当前节点的子节点

`node.getIndex()` 返回当前节点在父节点中的位置，如果没有父节点，返回 -1

`node.insertChild( node, index )` 插入一个子节点到当前节点上，插入的位置为 index

`node.removeChild( node | index )` 移除一个子节点或指定位置的子节点

`node.getChild( index )` 获得指定位置的子节点

### 数据存取

`node.getData(name)` 获得指定字段的数据

`node.setData(name, value)` 设定指定字段的数据

### 公开字段

`node.setData( "x", value )` 设置节点的 x 坐标

`node.setData( "y", value )` 设置节点的 y 坐标

`node.getData( "x", value )` 获取节点的 x 坐标

`node.getData( "y", value )` 获取节点的 y 坐标

`node.setData( "text", value )` 设置节点的文本

`node.getData( "text", value )` 获取节点的文本

### 渲染容器

`node.getRenderContainer()` 返回当前节点的渲染容器


## Minder
脑图使用类

### `static method` registerCommand( name, commandClass ) : this
注册一个命令

### `static method` registerModule( name, module )
注册一个模块

### `constructor` Minder()
创建脑图画布

### `method` getRoot() : MinderNode
获取脑图根节点

`option.execCommand` 给定一个方法，命令执行的时候去执行

### `method` execCommand( name [, params...] )
执行指定的命令

### `method` update(MinderNode node) : this
更新指定节点及其子树的呈现，如果不指定节点，则更新跟节点的呈现（整棵树）

### `method` export() : object
以导出节点以及所有子树的数据（data上所有的字段会被导出）

### `method` import(object data) : this
导入节点数据，会节点以及所有子树结构以及子树数据

### `event` beforecommand(e), precommand(e), command(e), aftercommand(e)
执行命令前后触发的事件，其中 beforecommand 中可以取消命令的执行，而 precommand 已经确定了命令要执行

`e.command` 调用的命令实例

`e.cancel` 是否要阻止命令的执行

### `event` beforeinsert(e), preinsert(e), insert(e), afterinsert(e)
发生节点插入的前后触发的事件

`e.targetNode` 获取要插入新节点的目标节点

`e.insertNode` 获取插入的节点

`e.insertIndex` 获取插入的位置

`e.cancel` 是否要阻止节点的插入（仅在 before 的时候有效）

### `event` beforeremove(e), preremove(e), remove(e), afterremove(e)
发生节点移除的前后触发的事件

`e.targetNode` 获取要移除节点的目标节点

`e.removeNode` 获取将要被移除的节点

`e.removeIndex` 获取被移除的节点在目标节点的位置

`e.cancel` 是否要阻止节点的移除（仅在 before 的时候有效）

### `event` beforedatachange(e), predatachange(e), datachange(e), afterdatachange(e)

`e.targetNode` 发生数据改变的节点

`e.dataField` 改变的数据的字段

`e.oldDataValue` 改变前数据的值

`e.dataValue` 改变的数据的值

`e.cancel` 是否要阻止数据的改变（仅在 before 的时候有效）

### `event` click(evt)、mousedown(evt)、mouseup(evt)、mousemove(evt)
表示节点点击的相关事件

`evt.targetNode` 表示事件发生的 Minder 节点

`evt.getPosition()` 获取事件发生时鼠标位置在 Paper 上的位置

### `event` keydown(evt)、keyup(evt)、keypress(evt)
表示发生的键盘事件

## `abstract` Module
表示控制脑图中一个功能的模块（布局、渲染、输入文字、图标叠加等）

### load(Minder minder) : this
模块装载的时候被调用，此时应该注册命令、绑定事件

### destroy() : this
模块卸载时被调用

## `abstract` Command
表示命令

### execute(Minder minder [,args...] )
命令执行，如果该命令可撤销，应自行保存需要的状态

### revert()
撤销命令的执行
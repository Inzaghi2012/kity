# 脑图 Demo 功能点

## 数据支持

支持 Markdown 大纲作为数据，支持一级和二级标题，三级以上标题和列表作为子元素。比如：

    # WebFE 第 13 周工作周报

    ## FIS

    * F.I.S 工作 1

    * F.I.S 工作 2

    ## UEditor

    * UEditor 工作 1

    * UEditor 工作 2 

    * UEditor 工作 3

    ## Kity

    * Kity 工作 1

    * Kity 工作 2

    * Kity 工作 3

### 数据流入

数据流入是指输入 Markdown 数据如何渲染出脑图。规则如下：

1. 要求文档有且只有一个一级大纲，否则不予解析；一级大纲将渲染为脑图的中心思想

2. 要求文档有至少一个二级大纲，否则不予解析；二级大纲将渲染为脑图的 Topic

3. 每个二级大纲下可以有任意个的三级以上大纲或者列表；如果有大纲，则渲染大纲为 Topic 的要点，并且会把要点的大纲树同时渲染；如果没有大纲，则会渲染列表为二级大纲的要点。


### 数据流出

数据流出是脑图编辑器能生成 Markdown 数据，规则如下：

1. 中心思想会被渲染为一级大纲

2. 中心思想下的每个 Topic 会被渲染为二级大纲

3. 每个 Topic 下的要点如果全是叶子，则要点被渲染为列表，否则渲染为下一级大纲，并且递归渲染

## 交互说明

1. 中心思想的位置固定，不可拖动
=======
1. 支持两种布局模式：自由布局和自动布局
2. 自动布局描述
    1) 子树自动和父节点居中对齐
    2) 子树增长会导致这棵树递归调整位置，保证不会出现重叠的情形
    3) 默认一级节点会在右面展开，如果右面的节点超过一定高度（比如300像素），那么将会在左右两边挑选高度最小的一面展开
3. 自由模式布局描述
    1）一级节点直接按照规律展开
    2）节点可以拖动，拖动是包括字节点整棵树的
    3）子节点增长不调整其他节点的位置
4. 支持拖动改变子树
5. 支持画布拖放和缩放
6. 数据导出导入（Json格式）

# 整体设计



## MinderTreeNode
提供树遍历、操作等方法

### `method` getParentNode() : MinderTreeNode
获取父级节点

### `method` getChildNodes() : MinderTreeNode[]
获取所有的子节点

### `method` getIndexOfParent() : int
获取当前节点在父节点中的位置

### `method` insertNode(MinderTreeNode node, int index) : this
插入子节点到指定的位置，不指定 index 插入到最后

### `method` removeNode(MinderTreeNode node | int index) : this
删除指定位置的节点或指定的节点

### `method` getRenderContainer() : kity.Group
获取用于渲染图形的容器

### `method` setData(string name, object value) : this
在节点上附加数据

### `method` getData(string name) : object
获取节点上附加的数据



## MindModule
表示控制脑图中一个功能的模块（布局、渲染、输入文字、图标叠加等）

### load(Minder minder) : this
模块装载的时候被调用

### destroy() : this
模块卸载时被调用

## LayouModule `abstract`
提供节点布局功能的模块

## RenderModule `abstract`
提供节点渲染功能的模块

## EditModule `abstract`
提供节点编辑功能的模块

## ConnectModule `abstract`
提供节点之间连接功能的模块

## AutoLayoutModule
提供自动布局功能的模块

## FreeLayoutModule
提供自由布局功能的模块

## DefaultRenderModule
提供默认渲染功能的模块

## TextEditModule
提供节点文本编辑的模块

## BezierConnectModule
提供节点之间连接曲线的模块


## Minder
脑图使用类
> base: Paper

### `constructor` Minder(HTMLDomElement container)
创建脑图画布，并且将其放在指定的容器上

### `method` getRoot() : MinderNode
获取脑图根节点

### `method` addModule(MindModule module) : this
添加脑图功能模块

### `method` removeModule(MindModule module) : this
移除脑图功能模块

### `method` replaceModule(MindModule current, MindModule replace)
替换脑图功能模块

### `method` getModuleOfType(KityClass moduleClass) : Module[]
获取具有指定类型的脑图模块

### `method` undo() : this
撤销上一步操作

### `method` redo() : this
如果有被撤销的步骤，恢复之

### `method` export() : object
以导出节点以及所有子树的数据（data上所有的字段会被导出）

### `method` import(object data) : this
导入节点数据，会节点以及所有子树结构以及子树数据

### `event` beforeinsert(evt)
表示节点上准备有子节点插入

`evt.targetNode` 表示发生准备插入子树的节点

`evt.insertIndex` 表示将要插入的节点插入的目标位置

`evt.insertNode` 表示将要插入的子树节点

`evt.cancel` 表示是否要阻止节点的插入，设置为 true 阻止节点插入

### `event` afterinsert(evt)
表示节点或子树发生了节点插入

`evt.targetNode` 表示插入了子树节点的父节点

`evt.insertIndex` 表示插入的子树在父节点的位置

`evt.insertNode` 表示插入的子树节点

### `event` beforeremove(evt)

表示节点上准备有子节点被移除

`evt.targetNode` 表示准备移除子节点的节点

`evt.removeIndex` 表示要移除的子节点在父节点中的位置

`evt.removeNode` 表示要移除的子节点（注意，此时子节点还在父节点上）

`evt.cancel` 表示是否要阻止节点的移除，设置为 true 阻止节点移除

### `event` beforedatachange(evt)

表示节点的数据发生了变化

`evt.targetNode` 表示数据发生变化的节点

`evt.dataField` 表示发生变化的数据字段

`evt.originValue` 表示数据发生变化前的值

`evt.newValue` 表示数据将要设置的新值

`evt.cancel` 表示是否要阻止数据的变化，设置为 true 阻止数据变化

### `event` afterdatachange(evt)
表示节点的数据发生了变化

`evt.targetNode` 表示数据发生变化的节点

`evt.dataField` 表示发生变化的数据字段

`evt.originValue` 表示数据发生变化前的值

`evt.newValue` 表示数据将要设置的新值

### `event` click(evt)、mousedown(evt)、mouseup(evt)、mousemove(evt)
表示节点点击的相关事件

`evt.targetNode` 表示事件发生的 Minder 节点

`evt.getPosition()` 获取事件发生时鼠标位置在 Paper 上的位置

### `event` keydown(evt)、keyup(evt)、keypress(evt)
表示发生的键盘事件
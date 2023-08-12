# Stage

负责
  提供 api 通过 id、坐标获取 runtime dom
  加载 runtime ，并接受 runtime 操作手柄
  创建 runtime 的蒙层，负责滚动、捕获事件

使用
  iframe 加载 runtime，会给其暴露 onRuntimeReady、onPageElUpdate
    onRuntimeReady：iframe 加载成功，通过此方法将操作 runtime 的句柄传递给 stage
      主要包括
        更新根配置、更新 page id
        runtime dom 增删查改选
    onPageElUpdate：runtime 基于 dsl 渲染出 dom，通过此方法将根 dom 传递给 stage

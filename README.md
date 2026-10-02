# 计算器前端（Calculator Frontend）

这是「前后端分离计算器」的前端页面，负责用户交互和信息展示。

## 项目介绍

- 提供计算器按钮和表达式输入。
- 通过 HTTP/JSON 接口调用后端完成计算。
- 展示计算结果和后端返回的错误信息。
- 展示从后端数据库读取的计算历史，并支持删除记录。

## 技术栈

- HTML
- CSS
- 原生 JavaScript（Fetch API）

## 运行环境

任意现代浏览器（Chrome、Edge 等）。

## 安装方法

无需安装，前端为纯静态文件。

## 启动方法

1. 先启动后端（见后端 README）。
2. 双击打开 `index.html`，或在命令行用任意静态服务器托管该目录。

## 配置说明

- 后端地址在 `app.js` 顶部的 `API_BASE` 中配置，默认 `http://127.0.0.1:5000`。
- 部署到公网后，请把 `API_BASE` 改为公网后端地址。

## 前后端连接方式

前端通过 `fetch` 调用后端的 HTTP 接口：

- 计算：`POST /api/calculate`
- 查询历史：`GET /api/history`
- 删除历史：`DELETE /api/history/{id}`
- 清空历史：`DELETE /api/history`

# 七天天气预报应用

一个基于 React 和 TypeScript 开发的简单天气预报应用，可以查看上海及其他城市未来七天的天气情况。

## 功能特点

- 显示未来七天的天气预报
- 包含温度、湿度、风速等天气数据
- 支持城市切换
- 响应式设计，适配各种设备
- 美观的 UI 界面

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- WeatherMap API

## 开始使用

### 先决条件

- Node.js 18.0.0 或更高版本

### 安装

1. 克隆代码库

```bash
git clone <repository-url>
cd weather
```

2. 安装依赖

```bash
npm install
```

3. 在项目根目录创建`.env.local`文件并添加你的 API 密钥

```
OPENWEATHER_API_KEY=your_api_key_here
```

4. 启动开发服务器

```bash
npm run dev
```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 许可证

MIT

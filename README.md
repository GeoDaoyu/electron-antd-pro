# 安徽非线性加密程序

基于 Ant Design Pro 和 Electron 搭建。前端负责页面和交互、加密逻辑使用 jar 包。

## 开发环境

Install `node_modules`:

```bash
yarn
```

### 开发调试

先修改package.json里面的main属性为`src/main.js`

然后手动启动jar包。

```bash
yarn start
```

```bash
yarn electron
```

### 打包部署

先修改package.json里面的main属性为`dist/main.js`

```bash
yarn build
```

```bash
yarn package
```

打包完在`/out`文件夹下。

把 jar 包和 bat 文件拷贝进 index.html 目录下。

> 不放到 public 下自动打包的原因：jar 包太大，打包时容易内存溢出，导致打包失败。

第一次打包需要如上操作。

之后修改了代码，可以只执行`yarn build`。然后把 dist 文件夹下的内容拷贝到`out\anhui-secret-win32-x64\resources\app\dist`下，不用重新`yarn package`



注意： dist下的main.js来自public下，要手动同步`public`和`src`下的main.js
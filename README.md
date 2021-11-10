# 安徽非线性加密程序

基于 Ant Design Pro 和 Electron 搭建。前端负责页面和交互、加密逻辑使用 jar 包。

## Environment Prepare

Install `node_modules`:

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
yarn start
```

```bash
yarn electron
```

### Build project

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

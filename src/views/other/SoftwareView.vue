<template>
  <n-h1 prefix="bar" style="margin-top: 30px">
    <i class="twa twa-flashlight"></i>
    <n-text type="success"> 软件下载</n-text>
  </n-h1>
  <n-alert title="说明" type="info">
    若您并不知道 Frpc 到底是干什么用的，请不要直接下载它。
  </n-alert>
  <n-space vertical>
    <n-grid cols="1" item-responsive>
      <n-grid-item class="item" span="1">
        <h2>启动器</h2>
        <br />
        <n-card title="Nya LoCyanFrp! 乐青映射启动器" size="medium">
          <h3>系统及架构支持</h3>
          <p>
            <span>Windows (至少需要 Windows 10), Linux, macOS</span>
            <br />
            <span>架构支持</span>
          </p>
          <ul>
            <li>GUI: x86_64, arm64 (macOS)</li>
            <li>CLI: x86_64, arm64 (macOS)</li>
          </ul>
          <h3>下载</h3>
          <p>
            <a href="https://nyalcf.1l1.icu" target="_blank"> Nya LoCyanFrp! 官方网站 </a>
            <br />
            <a
              href="https://mirrors.locyan.cn/github-release/Muska-Ami/NyaLCF/LatestRelease/"
              target="_blank"
            >
              LoCyan Mirrors 镜像站
            </a>
            <br />
            <a href="https://github.com/Muska-Ami/NyaLCF/releases" target="_blank"> GitHub </a>
          </p>
        </n-card>
      </n-grid-item>
      <n-grid-item class="item" span="1">
        <n-card title="Kairo" size="medium">
          <h3>系统及架构支持</h3>
          <p>
            <span>Windows (至少需要 Windows 10)</span>
            <br />
            <span>架构支持</span>
          </p>
          <ul>
            <li>x86_64</li>
          </ul>
          <h3>下载</h3>
          <p>
            <a
              href="https://mirrors.locyan.cn/github-release/Shiroiame-Kusu/Kairo/LatestRelease/"
              target="_blank"
            >
              LoCyan Mirrors 镜像站
            </a>
            <br />
            <a href="https://github.com/Shiroiame-Kusu/Kairo/releases" target="_blank"> GitHub </a>
          </p>
        </n-card>
      </n-grid-item>
      <n-grid-item class="item" span="1">
        <h2>游戏联机客户端</h2>
        <br />
        <n-card title="Eda" size="medium">
          <h3>系统及架构支持</h3>
          <p>
            <span>Windows (至少需要 Windows 10), Linux</span>
            <br />
            <span>架构支持</span>
          </p>
          <ul>
            <li>x86_64</li>
          </ul>
          <h3>下载</h3>
          <p>
            <a
              href="https://mirrors.locyan.cn/github-release/LoCyan-Team/Eda/LatestRelease/"
              target="_blank"
            >
              LoCyan Mirrors 镜像站
            </a>
            <br />
            <a href="https://github.com/LoCyan-Team/Eda/releases" target="_blank"> GitHub </a>
          </p>
        </n-card>
      </n-grid-item>
      <n-grid-item class="item" span="1">
        <h2>其他</h2>
        <br />
        <n-card title="纯净版客户端 (Frpc)" size="medium">
          <a
            href="https://mirrors.locyan.cn/github-release/LoCyan-Team/LoCyanFrpPureApp/LatestRelease/"
            target="_blank"
          >
            LoCyan Mirrors 镜像站
          </a>
          <br />
          <a href="https://github.com/LoCyan-Team/LoCyanFrpPureApp/releases" target="_blank">
            GitHub
          </a>
        </n-card>
      </n-grid-item>
    </n-grid>
  </n-space>
</template>

<style>
.item {
  margin-top: 20px;
}
</style>
<script setup lang="ts"></script>

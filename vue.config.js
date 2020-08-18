module.exports = {
  pluginOptions: {
    // NOTE:https://www.electron.build
    // NOTE:https://nklayman.github.io/vue-cli-plugin-electron-builder/
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: 'com.uniecloud.ppt-admin',
        productName: 'ppt-admin',
        copyright: 'Copyright©unicloud',
        asar: false,
        directories: {
          output: './dist_electron' // 输出文件路径
        },
        win: {
          // win相关配置
          icon: 'public/icon.png', // 图标256*256
          target: [
            {
              target: 'nsis', // 不打包为安装程序
              arch: [
                'x64' //64位
                // "ia32", //32位
              ]
            }
          ],
          "publish": {
            provider: 'github',
            token: 'a70174c43c2f4ade9c570f054d4912a37b0895b1',
          }
        },
        mac: {
          artifactName: "${productName}-${version}-osx.${ext}",
          category: "public.app-category.productivity",
          target: [
            "dmg"
          ]
        },
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
}
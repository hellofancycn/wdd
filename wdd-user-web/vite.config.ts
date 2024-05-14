import {UserConfig, ConfigEnv, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons';
import path from 'path';
import {createHtmlPlugin} from "vite-plugin-html";

// @see: https://gitee.com/holysheng/vite2-config-description/blob/master/vite.config.ts
export default ({mode}: ConfigEnv): UserConfig => {
  // 获取 .env 环境配置文件
  const env = loadEnv(mode, process.cwd());

  return {
    build: {
      outDir: 'wdd-user-web'
    },
    server: {
      host: '0.0.0.0',
      port: 6001,
      open: true, // 运行自动打开浏览器
      proxy: {
        '/api': {
          target:  env.VITE_APP_RESOURCE_URL,
          changeOrigin: true
        }
      }
    },
    plugins: [
      vue(),
      createHtmlPlugin(
        {
          inject: {
            data: {
              VITE_APP_SYSTEM_NAME: env.VITE_APP_SYSTEM_NAME
            }
          }
        }
      ),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      })
    ],
    resolve: {
      // Vite路径别名配置
      alias: {
        '@': path.resolve('./src')
      }
    }
  };
};

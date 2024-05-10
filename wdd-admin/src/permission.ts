import router from '@/router';
import {ElMessage} from 'element-plus';
import useStore from '@/store';

// 白名单路由
const whiteList = ['/login'];

router.beforeEach(async (to, from, next) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (window._hmt && to.path) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window._hmt.push(['_trackPageview', `/#${to.path}`])
    }

    const {user, permission} = useStore();
    const hasToken = user.token;
    if (hasToken) {
        // 登录成功，跳转到首页
        if (to.path === '/login') {
            next({path: '/'});
        } else {
            const hasPermission = permission.perms.length > 0;
            if (hasPermission) {
                if (to.matched.length === 0) {
                    from.name ? next({name: from.name as any}) : next('/404');
                } else {
                    next();
                }
            } else {
                try {
                    const response: any = await permission.getUserRoutePermission();
                    if (response.code === 1) {
                        response.data.forEach((route: any) => {
                            router.addRoute(route);
                        });
                        next({...to, replace: true});
                    } else {
                        await user.resetToken();
                        if (response.code !== 401) {
                            ElMessage.error(response.data);
                        }
                        next(`/login?redirect=${to.path}`);
                    }
                } catch (error) {
                    // 移除 token 并跳转登录页
                    await user.resetToken();
                    ElMessage.error((error as any) || 'Has Error');
                    next(`/login?redirect=${to.path}`);
                }
            }
        }
    } else {
        // 未登录可以访问白名单页面(登录页面)
        if (whiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            next(`/login?redirect=${to.path}`);
        }
    }
});

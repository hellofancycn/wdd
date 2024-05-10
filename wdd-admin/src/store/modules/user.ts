import {defineStore} from 'pinia';
import {LoginResponseData} from '@/types/api/login';
import {UserState} from '@/types/store/user';

import {logout} from '@/api/login';
import {resetRouter} from '@/router';
import Cookies from "js-cookie";

const key = {
    userNameKey: 'wdd-admin-user-name',
    realNameKey: 'wdd-admin-real-name'
}

const useUserStore = defineStore({
    id: 'user',
    state: (): UserState => ({
        userName: Cookies.get(key.userNameKey) || '',
        realName: Cookies.get(key.realNameKey) || '',
        token: Cookies.get(import.meta.env.VITE_APP_TOKEN_KEY) || ''
    }),
    actions: {
        async RESET_STATE() {
            this.$reset();
        },
        login(loginData: LoginResponseData) {
            const expires = new Date(loginData.endTime)
            Cookies.set(key.userNameKey, loginData.userName, {expires: expires})
            Cookies.set(key.realNameKey, loginData.realName, {expires: expires})
            Cookies.set(import.meta.env.VITE_APP_TOKEN_KEY, loginData.token, {expires: expires})
            this.userName = loginData.userName
            this.realName = loginData.realName
            this.token = loginData.token
        },
        updateRealName(realName: string) {
            Cookies.set(key.realNameKey, realName, {expires: 15})
            this.realName = realName
        },
        removeLoginCookies() {
            Cookies.remove(key.userNameKey)
            Cookies.remove(key.realNameKey)
            Cookies.remove(import.meta.env.VITE_APP_TOKEN_KEY)
        },
        logout() {
            return new Promise((resolve, reject) => {
                logout()
                    .then(() => {
                        this.removeLoginCookies()
                        this.RESET_STATE();
                        resetRouter();
                        resolve(null);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        resetToken() {
            return new Promise((resolve) => {
                Cookies.remove(import.meta.env.VITE_APP_TOKEN_KEY)
                this.RESET_STATE();
                resolve(null);
            });
        },
    },
});

export default useUserStore;

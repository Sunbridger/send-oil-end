import { Application } from 'egg';
import Dusbo from '@souche/node-dubbo-client';

const CSsoDubboSymbol = Symbol('Application#CSsoDubbo');
const BSsoDubboSymbol = Symbol('Application#BSsoDubbo');

export default {
    get CSsoDubbo(this: Application) {
        if (!this[CSsoDubboSymbol]) {
            this[CSsoDubboSymbol] = new Dusbo({
                zk: this.config.zkCSso,
                service: 'com.souche.sso.store.manage.SsoStoreManage',
            });
        }
        return this[CSsoDubboSymbol];
    },
    get BSsoDubbo(this: Application) {
        if (!this[BSsoDubboSymbol]) {
            this[BSsoDubboSymbol] = new Dusbo({
                zk: this.config.zk,
                service: 'com.souche.sso.service.TokenService',
            });
        }
        return this[BSsoDubboSymbol];
    },
};

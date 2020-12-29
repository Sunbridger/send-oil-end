export default (app: Egg.Application) => {
    const { router, controller } = app;

    // router.get('/', controller.home.index);
    router.post('/api/report/excel', controller.home.excel);
    // router.get('/api/report/sendEmail', controller.home.sendEmail);

    /**
     * toC模块
     */
    router.get('/api/toC/getActivityTimeAndShops', controller.toC.getActivityTimeAndShops);
    router.get('/api/toC/getActivityAndUserStatus', controller.toC.getActivityAndUserStatus);
    router.post('/api/toC/generateCode', controller.toC.generateCode);
    router.get('/api/toC/getCode', controller.toC.getCode);
    router.get('/api/toC/getUserData', controller.toC.getUserData);

    /**
     * toB 模块
     */
    // 核销 核销码接口
    router.post('/api/toB/verifiedCode', controller.toB.verifiedCode);
    // 店铺获取核销记录
    router.get('/api/toB/getVerifiedHistory', controller.toB.getVerifiedHistory);
    // // 定时任务获取Excel Data
    // router.get('/api/toB/getExcelData', controller.toB.getExcelData);
    // // 定时任务获取Excel
    // router.get('/api/toB/getExcel', controller.toB.getExcel);

    /**
     * 测试
     */
    // router.post('/api/test/genUser', controller.test.genUser);
    // router.post('/api/test/resetUser', controller.test.resetUser);
    // router.post('/api/test/delUser', controller.test.delUser);
    // router.post('/api/test/bulkData', controller.test.bulkData);
    // router.post('/api/test/delBulkData', controller.test.delBulkData);
    // router.post('/api/test/cancelVerified', controller.test.cancelVerified);
    // router.post('/api/test/genShop', controller.test.genShop);
    // router.post('/api/test/delShop', controller.test.delShop);
    // router.post('/api/test/modifyTime', controller.test.modifyTime);

    /**
     * TODO: 上线下架：用于测试和模拟数据的接口
     */
    // 模拟用户获取核销码操作
    // router.get('/api/test/mockGetCode', controller.test.mockGetCode);
    // router.get('/api/test/mockVerifiedCodeList', controller.test.mockVerifiedCodeList);
};

import { Router } from 'express';
import glob from 'glob';

const routers = glob
    .sync('**/*.ts', { cwd: `${__dirname}/` })
    .map((filename: string) => require(`./${filename}`))
    .filter((router: any) => {
        return router.default && Object.getPrototypeOf(router.default) === Router
    })
    .reduce((rootRouter: Router, router: any) => {
        return rootRouter.use(router.default)
    }, Router({ mergeParams: true }));

export default routers;
import getViteConfig from '../../electron.vite.config';

import { ElectronViteConfigParams } from '../interface';

export const getElectronViteConfig = async ({command, mode}: ElectronViteConfigParams) => {
    return await getViteConfig({command, mode});
}

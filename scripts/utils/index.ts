import path from 'path';
import fs from 'fs';
import type { PackageJson } from '../interface';
export * from './config';
export * from './plugins';


let cachedPackageJson: PackageJson | null = null;

export function getPackageJson(root = process.cwd()): PackageJson {
    if (cachedPackageJson) {
        return cachedPackageJson;
    }
    const pkg = path.join(root, 'package.json');

    if (fs.existsSync(pkg)) {
        try {
            const data = fs.readFileSync(pkg, 'utf8');
            const packageJson = JSON.parse(data);
            cachedPackageJson = {
                main: packageJson.main,
                type: packageJson.type,
                dependencies: packageJson.dependencies
            }
            return packageJson;
        } catch (e) {
            throw new Error(`Failed to parse package.json: ${e}`);
        }
    }
    throw new Error(`package.json not found in ${root}`);
}

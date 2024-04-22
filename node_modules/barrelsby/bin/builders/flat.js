"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFlatBarrel = void 0;
const builder_1 = require("../builder");
function dotOrDashStrToCamelCase(str) {
    // massage any `example.file.name` to `exampleFileName`
    return str.replace(/[-_.]([a-z0-9])/g, (_, group) => group.toUpperCase());
}
function arrayToCamelCase(arr) {
    let camelCaseStr = arr[0].toLowerCase();
    for (let i = 1; i < arr.length; i++) {
        camelCaseStr += arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return camelCaseStr;
}
function buildFlatBarrel(directory, modules, quoteCharacter, semicolonCharacter, logger, baseUrl, exportDefault, fullPathname) {
    return modules.reduce((previous, current) => {
        const importPath = (0, builder_1.buildImportPath)(directory, current, baseUrl);
        logger.debug(`Including path ${importPath}`);
        if (exportDefault) {
            const filename = (0, builder_1.getBasename)(current.path);
            // expect if `importPath` is './example/of/path/file.full-name' and split to ['example', 'of', 'path', 'fileFullName']
            const arryPath = importPath
                .split('/')
                .slice(1)
                .map(x => dotOrDashStrToCamelCase(x));
            // expect ['example', 'of', 'path', 'name'] transform to exampleOfPathName
            const camelCaseFullPathname = arrayToCamelCase(arryPath);
            const defaultName = fullPathname ? camelCaseFullPathname : dotOrDashStrToCamelCase(filename);
            logger.debug(`camelCaseFullPathname: ${camelCaseFullPathname}`);
            logger.debug(`Default Name ${defaultName}`);
            previous += `export { default as ${defaultName} } from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`;
        }
        return (previous += `export * from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`);
    }, '');
}
exports.buildFlatBarrel = buildFlatBarrel;
//# sourceMappingURL=flat.js.map
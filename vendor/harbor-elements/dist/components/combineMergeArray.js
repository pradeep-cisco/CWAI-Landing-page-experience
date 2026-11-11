import { c as cjs } from './cjs.js';

const combineMergeArray = (target, source, options) => {
    const destination = target.slice();
    source.forEach((item, index) => {
        if (typeof destination[index] === "undefined") {
            destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
        }
        else if (options.isMergeableObject(item)) {
            destination[index] = cjs(target[index], item, options);
        }
        else if (target.indexOf(item) === -1) {
            destination.push(item);
        }
    });
    return destination;
};

export { combineMergeArray as c };


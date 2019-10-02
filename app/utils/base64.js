
export const decode = str => Buffer.from(str, "base64").toString();
export const encode = str => Buffer.from(str).toString('base64');

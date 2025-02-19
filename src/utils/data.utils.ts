import type { DataType } from "@jaclight/dbsdk";

export const getResponseErrorMessage = (e, noStatusCode = false) => {
    console.error('error', e)
    let errMsg = e.response?.data?.message || e.response?.data?.error;
    let errPath = e.response?.data?.path
    let message = errMsg + ' ' + errPath + ' ' + (noStatusCode ? '' : e.message)
    if (message.indexOf('/') > 1) {
        message = message.split('/')[0]
    }
    return message;
}
export const createBaseData = (datatype: DataType, data?, author?, owner?) => {
    return {
        pk: "",
        name: "",
        version: 0,
        author,
        sk: "",
        isNew: true,
        datatype,
        data,
        owner
    }
}

import request from "@/utils/request";

// 查询配件信息列表
export function listAccessories(query) {
    return request({
        url: "/system/accessories/list",
        method: "get",
        params: query,
    });
}

// 查询配件信息详细
export function getAccessories(id) {
    return request({
        url: "/system/accessories/" + id,
        method: "get",
    });
}

// 新增配件信息
export function addAccessories(data) {
    return request({
        url: "/system/accessories",
        method: "post",
        data: data,
    });
}

// 修改配件信息
export function updateAccessories(data) {
    return request({
        url: "/system/accessories",
        method: "put",
        data: data,
    });
}

// 删除配件信息
export function delAccessories(id) {
    return request({
        url: "/system/accessories/" + id,
        method: "delete",
    });
}

export function getAccessoriePrice(number) {
    return request({
        url: "system/accessories/price/" + number,
        method: "get",
    });
}

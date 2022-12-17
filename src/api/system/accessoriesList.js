import request from "@/utils/request";

// 查询配件单列表
export function listAccessoriesList(query) {
    return request({
        url: "/system/accessoriesList/list",
        method: "get",
        params: query,
    });
}

// 查询配件单详细
export function getAccessoriesList(id) {
    return request({
        url: "/system/accessoriesList/" + id,
        method: "get",
    });
}

// 新增配件单
export function addAccessoriesList(data) {
    return request({
        url: "/system/accessoriesList",
        method: "post",
        data: data,
    });
}

// 修改配件单
export function updateAccessoriesList(data) {
    return request({
        url: "/system/accessoriesList",
        method: "put",
        data: data,
    });
}

// 删除配件单
export function delAccessoriesList(id) {
    return request({
        url: "/system/accessoriesList/" + id,
        method: "delete",
    });
}

// 通过类别配件单
export function getAccessoriesOption(id, data) {
    return request({
        url: `/system/accessoriesList/getCateAcce/${id}`,
        data: data,
        method: "post",
    });
}

export function mapAccessoriesMap() {
    return request({
        url: `/system/accessoriesList/map`,
        method: "get",
    });
}

export function updatePriceByList(id) {
    return request({
        url: `/system/accessoriesList/getPriceById/${id}`,
        method: "get",
    });
}

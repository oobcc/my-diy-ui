import request from "@/utils/request";

// 查询标签管理列表
export function listLable(query) {
    return request({
        url: "/system/lable/list",
        method: "get",
        params: query,
    });
}

// 查询标签管理详细
export function getLable(id) {
    return request({
        url: "/system/lable/" + id,
        method: "get",
    });
}

// 新增标签管理
export function addLable(data) {
    return request({
        url: "/system/lable",
        method: "post",
        data: data,
    });
}

// 修改标签管理
export function updateLable(data) {
    return request({
        url: "/system/lable",
        method: "put",
        data: data,
    });
}

// 删除标签管理
export function delLable(id) {
    return request({
        url: "/system/lable/" + id,
        method: "delete",
    });
}

/**
 * 获取配件单map
 */
export function mapLable() {
    return request({
        url: "/system/lable/map",
        method: "get",
    });
}

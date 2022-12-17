<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryRef"
            :inline="true"
            v-show="showSearch"
            label-width="100px"
        >
            <el-form-item label="配件单名" prop="name">
                <el-input
                    v-model="queryParams.name"
                    placeholder="请输入配件单名"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="配件单类别" prop="type">
                <el-select
                    v-model="queryParams.type"
                    placeholder="请选择配件单类别"
                    clearable
                >
                    <el-option
                        v-for="dict in diy_accessories_category_type"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="cpu" prop="cpuId">
                <el-input
                    v-model="queryParams.cpuId"
                    placeholder="请输入cpu"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="主板" prop="motherboardId">
                <el-input
                    v-model="queryParams.motherboardId"
                    placeholder="请输入主板"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="显卡" prop="graphicsCardId">
                <el-input
                    v-model="queryParams.graphicsCardId"
                    placeholder="请输入显卡"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="内存" prop="memoryId">
                <el-input
                    v-model="queryParams.memoryId"
                    placeholder="请输入内存"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="储存" prop="storeId">
                <el-input
                    v-model="queryParams.storeId"
                    placeholder="请输入储存"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="电源" prop="powerId">
                <el-input
                    v-model="queryParams.powerId"
                    placeholder="请输入电源"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="机箱" prop="chassisId">
                <el-input
                    v-model="queryParams.chassisId"
                    placeholder="请输入机箱"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="价格" prop="price">
                <el-input
                    v-model="queryParams.price"
                    placeholder="请输入价格"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="标签" prop="label">
                <el-input
                    v-model="queryParams.label"
                    placeholder="请输入标签"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input
                    v-model="queryParams.remark"
                    placeholder="请输入备注"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery"
                    >搜索</el-button
                >
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="Plus"
                    @click="handleAdd"
                    v-hasPermi="['system:accessoriesList:add']"
                    >新增</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="success"
                    plain
                    icon="Edit"
                    :disabled="single"
                    @click="handleUpdate"
                    v-hasPermi="['system:accessoriesList:edit']"
                    >修改</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="danger"
                    plain
                    icon="Delete"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['system:accessoriesList:remove']"
                    >删除</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="Download"
                    @click="handleExport"
                    v-hasPermi="['system:accessoriesList:export']"
                    >导出</el-button
                >
            </el-col>
            <right-toolbar
                v-model:showSearch="showSearch"
                @queryTable="getList"
            ></right-toolbar>
        </el-row>

        <el-table
            v-loading="loading"
            :data="accessoriesListList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="id" align="center" prop="id" v-if="true" />
            <el-table-column label="配件单名" align="center" prop="name" />
            <el-table-column label="cpu" align="center" prop="cpuId">
                <template #default="scope">
                    {{
                        scope.row.cpuId
                            ? accessoriesMap[scope.row.cpuId]["name"]
                            : "无"
                    }}
                </template>
            </el-table-column>
            <el-table-column label="主板" align="center" prop="motherboardId">
                <template #default="scope">
                    {{
                        scope.row.motherboardId
                            ? accessoriesMap[scope.row.motherboardId]["name"]
                            : "无"
                    }}
                </template>
            </el-table-column>
            <el-table-column label="显卡" align="center" prop="graphicsCardId">
                <template #default="scope">
                    {{
                        scope.row.graphicsCardId
                            ? accessoriesMap[scope.row.graphicsCardId]["name"]
                            : "无"
                    }}
                </template>
            </el-table-column>
            <el-table-column label="内存" align="center" prop="memoryId">
                <template #default="scope">
                    {{
                        scope.row.memoryId
                            ? accessoriesMap[scope.row.memoryId]["name"]
                            : "无"
                    }}
                </template>
            </el-table-column>
            <el-table-column label="储存" align="center" prop="storeId">
                <template #default="scope">
                    {{
                        scope.row.storeId
                            ? accessoriesMap[scope.row.storeId]["name"]
                            : "无"
                    }}
                </template>
            </el-table-column>
            <el-table-column label="电源" align="center" prop="powerId">
                <template #default="scope">
                    {{
                        scope.row.powerId
                            ? accessoriesMap[scope.row.powerId]["name"]
                            : "无"
                    }}
                </template>
            </el-table-column>
            <el-table-column label="机箱" align="center" prop="chassisId">
                <template #default="scope">
                    {{
                        scope.row.chassisId
                            ? accessoriesMap[scope.row.chassisId]["name"]
                            : "无"
                    }}
                </template>
            </el-table-column>
            <el-table-column label="价格" align="center" prop="price" />
            <el-table-column label="标签" align="center" prop="label">
                <template #default="scope">
                    <el-tag
                        class="ml-2"
                        type="danger"
                        v-for="(item, i) in scope.row.label"
                        effect="light"
                    >
                        {{ lablesMap[item].name }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template #default="scope">
                    <el-button
                        type="text"
                        icon="Refresh"
                        @click="updataPrice(scope.row)"
                        >更新价格</el-button
                    >
                    <el-button
                        type="text"
                        icon="Edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:accessoriesList:edit']"
                        >修改</el-button
                    >
                    <el-button
                        type="text"
                        icon="Delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['system:accessoriesList:remove']"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />

        <!-- 添加或修改配件单对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form
                ref="accessoriesListRef"
                :model="form"
                :rules="rules"
                label-width="80px"
            >
                <el-form-item label="配件单名" prop="name">
                    <el-input
                        v-model="form.name"
                        placeholder="请输入配件单名"
                    />
                </el-form-item>
                <el-form-item label="cpu" prop="cpuId">
                    <el-select
                        v-model="form.cpuId"
                        clearable
                        placeholder="请选择cpu"
                        :loading="optionsLoading"
                        @visible-change="getCpuOption"
                    >
                        <el-option
                            v-for="item in CpuOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="主板" prop="motherboardId">
                    <el-select
                        v-model="form.motherboardId"
                        clearable
                        placeholder="请选择主板"
                        :loading="optionsLoading"
                        @visible-change="getMotherboardOption"
                    >
                        <el-option
                            v-for="item in MotherboardOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="显卡" prop="graphicsCardId">
                    <el-select
                        v-model="form.graphicsCardId"
                        clearable
                        placeholder="请选择显卡"
                        :loading="optionsLoading"
                        @visible-change="getGraphicsCarOption"
                    >
                        <el-option
                            v-for="item in GraphicsCarOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="内存" prop="memoryId">
                    <el-select
                        v-model="form.memoryId"
                        clearable
                        placeholder="请选择内存"
                        :loading="optionsLoading"
                        @visible-change="getMemoryOption"
                    >
                        <el-option
                            v-for="item in MemoryOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="储存" prop="storeId">
                    <el-select
                        v-model="form.storeId"
                        clearable
                        placeholder="请选择储存"
                        :loading="optionsLoading"
                        @visible-change="getStoreOption"
                    >
                        <el-option
                            v-for="item in StoreOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="电源" prop="powerId">
                    <el-select
                        v-model="form.powerId"
                        clearable
                        placeholder="请选择电源"
                        :loading="optionsLoading"
                        @visible-change="getPowerOption"
                    >
                        <el-option
                            v-for="item in PowerOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="机箱" prop="chassisId">
                    <el-select
                        v-model="form.chassisId"
                        clearable
                        placeholder="请选择机箱"
                        :loading="optionsLoading"
                        @visible-change="getChassisOption"
                        :render-after-expand="false"
                    >
                        <el-option
                            v-for="item in ChassisOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="form.price" placeholder="请输入价格" />
                </el-form-item>
                <el-form-item label="标签" prop="label">
                    <el-select
                        v-model="form.label"
                        multiple
                        clearable
                        placeholder="请选择标签"
                        style="width: 240px"
                        value-key="id"
                    >
                        <el-option
                            v-for="item in lables"
                            :key="parseInt(item.id)"
                            :label="item.name"
                            :value="parseInt(item.id)"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input
                        v-model="form.remark"
                        type="textarea"
                        placeholder="请输入内容"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-butto                        :loading="buttonLoading"
                        type="primary"
                        @click="submitForm"
                        >确 定</el-button
                    >
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="AccessoriesList">
import {
    listAccessoriesList,
    getAccessoriesList,
    delAccessoriesList,
    addAccessoriesList,
    updateAccessoriesList,
    getAccessoriesOption,
    mapAccessoriesMap,
    updatePriceByList,
} from "@/api/system/accessoriesList";

import { listLable, mapLable } from "@/api/system/lable";

const { proxy } = getCurrentInstance();
const { diy_accessories_category_type } = proxy.useDict(
    "diy_accessories_category_type"
);

const accessoriesListList = ref([]);
const open = ref(false);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const optionsLoading = ref(false);
const CpuOptions = ref("");
const MotherboardOptions = ref("");
const GraphicsCarOptions = ref("");
const MemoryOptions = ref("");
const StoreOptions = ref("");
const PowerOptions = ref("");
const ChassisOptions = ref("");
const accessoriesMap = ref();
const lables = ref();
const lablesMap = ref();

function getLables() {
    mapLable().then((res) => {
        lablesMap.value = res.data;
    });
    listLable().then((res) => {
        lables.value = res.rows;
    });
}

function setOptions(obj) {
    const idArr = [
        "cpuId",
        "graphicsCardId",
        "memoryId",
        "motherboardId",
        "powerId",
        "chassisId",
        "storeId",
    ];

    const OptionsArr = [
        CpuOptions,
        GraphicsCarOptions,
        MemoryOptions,
        MotherboardOptions,
        PowerOptions,
        ChassisOptions,
        StoreOptions,
    ];
    for (let i = 0; i < idArr.length; i++) {
        if (obj[idArr[i]]) {
            OptionsArr[i].value = [
                {
                    id: obj[idArr[i]],
                    name: accessoriesMap.value[obj[idArr[i]]]["name"],
                },
            ];
        }
    }
}

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        type: undefined,
        cpuId: undefined,
        motherboardId: undefined,
        graphicsCardId: undefined,
        memoryId: undefined,
        storeId: undefined,
        powerId: undefined,
        chassisId: undefined,
        price: undefined,
        label: undefined,
        remark: undefined,
    },
    rules: {
        id: [{ required: true, message: "id不能为空", trigger: "blur" }],
        name: [
            { required: true, message: "配件单名不能为空", trigger: "blur" },
        ],
    },
});

const { queryParams, form, rules } = toRefs(data);

watch(
    form,
    (nn, oo) => {
        const arr = [
            "cpuId",
            "motherboardId",
            "graphicsCardId",
            "memoryId",
            "storeId",
            "powerId",
            "chassisId",
        ];
        let price = 0;
        for (const i of arr) {
            if (nn[i] != undefined && nn[i] != "" && nn[i] != null) {
                price += Number(accessoriesMap.value[nn[i]]["price"]);
            }
        }
        form.value["price"] = price;
    },
    { deep: true }
);

function getCpuOption(e) {
    if (e) getOptionTh("2", CpuOptions);
}
function getMotherboardOption(e) {
    if (e) getOptionTh("3", MotherboardOptions);
}
function getGraphicsCarOption(e) {
    if (e) getOptionTh("4", GraphicsCarOptions);
}
function getMemoryOption(e) {
    if (e) getOptionTh("5", MemoryOptions);
}
function getStoreOption(e) {
    if (e) getOptionTh("6", StoreOptions);
}
function getPowerOption(e) {
    if (e) getOptionTh("7", PowerOptions);
}
function getChassisOption(e) {
    if (e) getOptionTh("8", ChassisOptions);
}
const getOptionTh = throttle(getOption, 1000);

function getOption(id, op) {
    return getAccessoriesOption(id, form.value).then((resp) => {
        op.value = resp.data;
    });
}

/** 更新配件单的价格 */
function updataPrice(row) {
    const _id = row.id || ids.value;
    return updatePriceByList(_id).then(() => {
        getList();
    });
}

/** 查询配件id和配件名MAP */
function getAccessoriesMap() {
    return mapAccessoriesMap().then((resp) => {
        accessoriesMap.value = resp.data;
        getList();
    });
}

/** 查询配件单列表 */
function getList() {
    loading.value = true;
    listAccessoriesList(queryParams.value).then((response) => {
        accessoriesListList.value = response.rows;
        total.value = response.total;
        loading.value = false;
    });
}

// 取消按钮
function cancel() {
    open.value = false;
    reset();
}

// 表单重置
function reset() {
    form.value = {
        id: null,
        name: null,
        type: null,
        cpuId: null,
        motherboardId: null,
        graphicsCardId: null,
        memoryId: null,
        storeId: null,
        powerId: null,
        chassisId: null,
        price: null,
        label: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
    };
    proxy.resetForm("accessoriesListRef");
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
}

/** 重置按钮操作 */
function resetQuery() {
    proxy.resetForm("queryRef");
    handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
    ids.value = selection.map((item) => item.id);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加配件单";
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true;
    reset();
    const _id = row.id || ids.value;
    getAccessoriesList(_id).then((response) => {
        setOptions(response.data);
        loading.value = false;
        form.value = response.data;
        open.value = true;
        title.value = "修改配件单";
    });
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["accessoriesListRef"].validate((valid) => {
        if (valid) {
            buttonLoading.value = true;
            if (form.value.id != null) {
                updateAccessoriesList(form.value)
                    .then((response) => {
                        proxy.$modal.msgSuccess("修改成功");
                        open.value = false;
                        getList();
                    })
                    .finally(() => {
                        buttonLoading.value = false;
                    });
            } else {
                addAccessoriesList(form.value)
                    .then((response) => {
                        proxy.$modal.msgSuccess("新增成功");
                        open.value = false;
                        getList();
                    })
                    .finally(() => {
                        buttonLoading.value = false;
                    });
            }
        }
    });
}

/** 删除按钮操作 */
function handleDelete(row) {
    const _ids = row.id || ids.value;
    proxy.$modal
        .confirm('是否确认删除配件单编号为"' + _ids + '"的数据项？')
        .then(function () {
            loading.value = true;
            return delAccessoriesList(_ids);
        })
        .then(() => {
            loading.value = true;
            getList();
            proxy.$modal.msgSuccess("删除成功");
        })
        .catch(() => {})
        .finally(() => {
            loading.value = false;
        });
}

/** 导出按钮操作 */
function handleExport() {
    proxy.download(
        "system/accessoriesList/export",
        {
            ...queryParams.value,
        },
        `accessoriesList_${new Date().getTime()}.xlsx`
    );
}

/**节流 + 最后一次一定运行 */
function throttle(func, wait) {
    let timer = null;
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall < wait) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                lastCall = now;
                func(...args);
            }, wait);
        } else {
            lastCall = now;
            func(...args);
        }
    };
}
getLables();
getAccessoriesMap();
</script>

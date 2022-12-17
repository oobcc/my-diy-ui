<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryRef"
            :inline="true"
            v-show="showSearch"
            label-width="80px"
        >
            <el-form-item label="配件名" prop="name">
                <el-input
                    v-model="queryParams.name"
                    placeholder="请输入配件名"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="配件编号" prop="number">
                <el-input
                    v-model="queryParams.number"
                    placeholder="请输入配件编号"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="配件价格" prop="price">
                <el-input
                    v-model="queryParams.price"
                    placeholder="请输入配件价格"
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
                    v-hasPermi="['system:accessories:add']"
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
                    v-hasPermi="['system:accessories:edit']"
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
                    v-hasPermi="['system:accessories:remove']"
                    >删除</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="Download"
                    @click="handleExport"
                    v-hasPermi="['system:accessories:export']"
                    >导出</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-tree-select
                    v-model="queryParams.parentId"
                    :data="categoryOptions"
                    :props="{
                        value: 'id',
                        label: 'name',
                        children: 'children',
                    }"
                    value-key="id"
                    placeholder="选择硬件类别"
                    :check-strictly="true"
                />
            </el-col>
            <right-toolbar
                v-model:showSearch="showSearch"
                @queryTable="getList"
            ></right-toolbar>
        </el-row>

        <el-table
            v-loading="loading"
            :data="accessoriesList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
                label="配件id"
                align="center"
                prop="id"
                v-if="true"
            />
            <el-table-column label="配件名" align="center" prop="name" />
            <el-table-column label=" 配件编号" align="center" prop="number" />
            <el-table-column label="配件价格" align="center" prop="price" />
            <el-table-column label="警告信息" align="center" prop="warning" />
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template #default="scope">
                    <el-button
                        type="text"
                        icon="Edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:accessories:edit']"
                        >修改</el-button
                    >
                    <el-button
                        type="text"
                        icon="Delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['system:accessories:remove']"
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

        <!-- 添加或修改配件信息对话框 -->
        <el-dialog :title="title" v-model="open" width="600px" append-to-body>
            <el-form
                ref="accessoriesRef"
                :model="form"
                :rules="rules"
                label-width="100px"
            >
                <el-form-item label="配件名" prop="name">
                    <el-input v-model="form.name" placeholder="请输入配件名" />
                </el-form-item>
                <el-form-item label="配件编号" prop="number">
                    <el-input
                        v-model="form.number"
                        placeholder="请输入配件编号"
                    />
                </el-form-item>
                <el-form-item label="硬件类别" prop="categoryId">
                    <el-tree-select
                        v-model="form.categoryId"
                        :data="categoryOptions"
                        :props="{
                            value: 'id',
                            label: 'name',
                            children: 'children',
                        }"
                        value-key="id"
                        placeholder="选择硬件类别"
                    />
                </el-form-item>
                <el-form-item label="配件价格" prop="price">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-input
                                v-model="form.price"
                                placeholder="请输入配件价格"
                            />
                        </el-col>

                        <el-col :span="12">
                            <el-button
                                type="primary"
                                :disabled="checkNumberInput"
                                :loading="getPriceButtonLoading"
                                @click="getPrice"
                                >获取价格</el-button
                            >
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button
                        :loading="buttonLoading"
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

<script setup name="Accessories">
import {
    listAccessories,
    getAccessories,
    delAccessories,
    addAccessories,
    updateAccessories,
    getAccessoriePrice,
} from "@/api/system/accessories";

import { listCategory } from "@/api/system/category";

const { proxy } = getCurrentInstance();

const open = ref(false);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const categoryOptions = ref([]);
const getPriceButtonLoading = ref(false);
const categoryStep = ref(0);
const accessoriesList = ref([]);

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        number: undefined,
        price: undefined,
        categoryId: undefined,
        parentId: 1,
    },
    rules: {
        id: [{ required: true, message: "配件id不能为空", trigger: "blur" }],
        name: [{ required: true, message: "配件名不能为空", trigger: "blur" }],
        categoryId: [
            {
                required: true,
                message: "请选择配件类别",
                trigger: "blur",
            },
        ],
        number: [
            {
                required: true,
                trigger: "blur",
                asyncValidator: () => {
                    return new Promise((resolve, reject) => {
                        if (checkNumberInput.value) {
                            reject("请输入正确的编号");
                        } else {
                            resolve();
                        }
                    });
                },
            },
        ],
    },
});

const { queryParams, form, rules } = toRefs(data);

const checkNumberInput = computed(
    () =>
        form.value.number === "" ||
        form.value.number === undefined ||
        form.value.number === null ||
        !checkNumber(form.value.number)
);

/** 查询配件信息列表 */
function getList() {
    loading.value = true;
    listAccessories(queryParams.value)
        .then((response) => {
            accessoriesList.value = response.rows;
            total.value = response.total;
            loading.value = false;
        })
        .finally(() => {
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
        number: null,
        price: null,
        delFlag: null,
        categoryId: queryParams.value.parentId,
    };
    proxy.resetForm("accessoriesRef");
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
    getCategortTreeselect();
    open.value = true;
    title.value = "添加配件信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true;
    getCategortTreeselect();
    reset();
    const _id = row.id || ids.value;
    getAccessories(_id).then((response) => {
        loading.value = false;
        form.value = response.data;
        open.value = true;
        title.value = "修改配件信息";
    });
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["accessoriesRef"].validate((valid) => {
        if (valid) {
            buttonLoading.value = true;
            if (form.value.id != null) {
                updateAccessories(form.value)
                    .then((response) => {
                        proxy.$modal.msgSuccess("修改成功");
                        open.value = false;
                        getList();
                    })
                    .finally(() => {
                        buttonLoading.value = false;
                    });
            } else {
                addAccessories(form.value)
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
        .confirm('是否确认删除配件名为"' + row.name + '"的数据项？')
        .then(function () {
            loading.value = true;
            return delAccessories(_ids);
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
        "system/accessories/export",
        {
            ...queryParams.value,
        },
        `accessories_${new Date().getTime()}.xlsx`
    );
}

/** 查询菜单下拉树结构 */
function getCategortTreeselect() {
    listCategory().then((response) => {
        categoryOptions.value = [];
        const data = { id: 0, name: "类别", children: [] };
        data.children = proxy.handleTree(response.data, "id", "parentId");
        categoryOptions.value.push(data);
        categoryOptions.value = categoryOptions.value[0].children;
    });
}

function getPrice() {
    getPriceButtonLoading.value = true;
    getAccessoriePrice(form.value.number)
        .then((response) => {
            form.value.price = response.data;
        })
        .catch((e) => {})
        .finally(() => {
            getPriceButtonLoading.value = false;
        });
}

//验证字符串是否是数字
function checkNumber(theObj) {
    const reg = /^[-]?[\.\d]+$/;
    if (reg.test(theObj)) {
        return true;
    }
    return false;
}

watch(queryParams.value, (v) => {
    getList();
});

getCategortTreeselect();
getList();
</script>

<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryRef"
            :inline="true"
            v-show="showSearch"
            label-width="120px"
        >
            <el-form-item label="配件类别名" prop="name">
                <el-input
                    v-model="queryParams.name"
                    placeholder="请输入配件类别名"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="不兼容类别id" prop="incompatible">
                <el-input
                    v-model="queryParams.incompatible"
                    placeholder="请输入不兼容类别id"
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
                    v-hasPermi="['system:category:add']"
                    >新增</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="info"
                    plain
                    icon="Sort"
                    @click="toggleExpandAll"
                    >展开/折叠</el-button
                >
            </el-col>
            <right-toolbar
                v-model:showSearch="showSearch"
                @queryTable="getList"
            ></right-toolbar>
        </el-row>

        <el-table
            v-if="refreshTable"
            v-loading="loading"
            :data="categoryList"
            row-key="id"
            :default-expand-all="isExpandAll"
            :expand-row-keys="ExpandRowKeys"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <!-- <el-table-column label="父id" prop="parentId" /> -->
            <el-table-column label="配件类别名" align="center" prop="name" />
            <el-table-column
                label="不兼容类别"
                align="center"
                prop="incompatible"
            >
                <template #default="scope">
                    <el-tag
                        class="ml-2"
                        type="danger"
                        v-for="(item, i) in scope.row.incompatible"
                        effect="light"
                    >
                        {{ categoryMap[item] }}
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
                        v-if="scope.row.id > 10"
                        type="text"
                        icon="Edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:category:edit']"
                        >修改</el-button
                    >
                    <el-button
                        type="text"
                        icon="Plus"
                        @click="handleAdd(scope.row)"
                        v-hasPermi="['system:category:add']"
                        >新增</el-button
                    >
                    <el-button
                        v-if="scope.row.id > 10"
                        type="text"
                        icon="Delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['system:category:remove']"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或修改配件类别对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form
                ref="categoryRef"
                :model="form"
                :rules="rules"
                label-width="100px"
            >
                <el-form-item
                    label="父类别"
                    prop="parentId"
                    v-if="form.parentId > 10"
                >
                    <el-tree-select
                        v-model="form.parentId"
                        :data="categoryOptions"
                        :props="{
                            value: 'id',
                            label: 'name',
                            children: 'children',
                        }"
                        value-key="id"
                        placeholder="请选择父类别"
                        check-strictly
                    />
                </el-form-item>
                <el-form-item label="配件类别名" prop="name">
                    <el-input
                        v-model="form.name"
                        placeholder="请输入配件类别名"
                    />
                </el-form-item>
                <el-form-item
                    label="不兼容类别"
                    v-if="form.parentId !== 0"
                    prop="incompatible"
                >
                    <el-tree-select
                        v-model="form.incompatible"
                        :data="categoryOptions"
                        :props="{
                            value: 'id',
                            label: 'name',
                            children: 'children',
                        }"
                        value-key="id"
                        placeholder="不兼容类别"
                        multiple
                        check-strictly
                        :render-after-expand="false"
                        show-checkbox
                    />
                    <!-- <el-input
                        v-model="form.incompatible"
                        placeholder="请输入不兼容类别id"
                    /> -->
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm"
                        >确 定</el-button
                    >
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="Category">
import {
    listCategory,
    getCategory,
    delCategory,
    addCategory,
    updateCategory,
    listCategoryExcludeChild,
} from "@/api/system/category";
import { computedAsync } from "@vueuse/core";

const { proxy } = getCurrentInstance();

const categoryList = ref([]);
const categoryOptions = ref([]);
const open = ref(false);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const isExpandAll = ref(false);
const refreshTable = ref(true);

const categoryMap = ref({});

const ExpandRowKeys = ref(["1"]);

const data = reactive({
    form: {},
    queryParams: {
        parentId: undefined,
        name: undefined,
        incompatible: undefined,
    },
    rules: {
        parentId: [
            {
                required: true,
                trigger: "blur",
                asyncValidator: () => {
                    return new Promise((resolve, reject) => {
                        if (
                            form.value.parentId == 0 ||
                            form.value.parentId == undefined
                        ) {
                            reject("选择父列表");
                        } else {
                            resolve();
                        }
                    });
                },
            },
        ],
        name: [
            { required: true, message: "配件类别名不能为空", trigger: "blur" },
        ],
    },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询配件类别列表 */
function getList() {
    loading.value = true;
    listCategory(queryParams.value)
        .then((response) => {
            for (const i of response.data) {
                categoryMap.value[i.id] = i.name;
            }
            categoryList.value = proxy.handleTree(
                response.data,
                "id",
                "parentId"
            );
            loading.value = false;
        })
        .finally(() => {
            loading.value = false;
        });
}

/** 查询配件类别下拉树结构 */
function getTreeselect() {
    listCategory().then((response) => {
        categoryOptions.value = [];
        const data = { id: 0, name: "顶级节点", children: [] };
        data.children = proxy.handleTree(response.data, "id", "parentId");
        categoryOptions.value.push(data);
        categoryOptions.value = categoryOptions.value[0].children;
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
        parentId: null,
        name: null,
        incompatible: null,
    };
    proxy.resetForm("categoryRef");
}

/** 搜索按钮操作 */
function handleQuery() {
    getList();
}

/** 重置按钮操作 */
function resetQuery() {
    proxy.resetForm("queryRef");
    handleQuery();
}

/** 新增按钮操作 */
function handleAdd(row) {
    reset();
    getTreeselect();
    if (row != null && row.id) {
        form.value.parentId = row.id;
    } else {
        form.value.parentId = 1;
    }
    open.value = true;
    title.value = "添加配件类别";
}

/** 展开/折叠操作 */
function toggleExpandAll() {
    refreshTable.value = false;
    isExpandAll.value = !isExpandAll.value;
    nextTick(() => {
        refreshTable.value = true;
    });
}

/** 修改按钮操作 */
async function handleUpdate(row) {
    loading.value = true;
    reset();
    // await getTreeselect();
    if (row != null) {
        form.value.parentId = row.id;
    }
    getCategory(row.id).then((response) => {
        form.value = response.data;
        listCategoryExcludeChild(row.id).then((rep) => {
            categoryOptions.value = [];
            const data = { id: 0, name: "顶级节点", children: [] };
            data.children = proxy.handleTree(rep.data, "id", "parentId");
            categoryOptions.value.push(data);
            categoryOptions.value = categoryOptions.value[0].children;
        });
        loading.value = false;
        open.value = true;
        title.value = "修改配件类别";
    });
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["categoryRef"].validate((valid) => {
        if (valid) {
            buttonLoading.value = true;
            if (form.value.id != null) {
                updateCategory(form.value)
                    .then((response) => {
                        proxy.$modal.msgSuccess("修改成功");
                        open.value = false;
                        getList();
                    })
                    .finally(() => {
                        buttonLoading.value = false;
                    });
            } else {
                addCategory(form.value)
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
    proxy.$modal
        .confirm('是否确认删除配件类别编号为"' + row.id + '"的数据项？')
        .then(function () {
            loading.value = true;
            return delCategory(row.id);
        })
        .then(() => {
            loading.value = false;
            getList();
            proxy.$modal.msgSuccess("删除成功");
        })
        .catch(() => {})
        .finally(() => {
            loading.value = false;
        });
}

getList();
</script>

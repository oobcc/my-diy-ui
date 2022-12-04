<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryRef"
            :inline="true"
            v-show="showSearch"
            label-width="98px"
        >
            <el-form-item label="用户id" prop="userId">
                <el-input
                    v-model="queryParams.userId"
                    placeholder="请输入用户id"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="用户openid" prop="openId">
                <el-input
                    v-model="queryParams.openId"
                    placeholder="请输入用户openid"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickName">
                <el-input
                    v-model="queryParams.nickName"
                    placeholder="请输入用户昵称"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="手机号码" prop="phonenumber">
                <el-input
                    v-model="queryParams.phonenumber"
                    placeholder="请输入手机号码"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="用户头像" prop="avatar">
                <el-input
                    v-model="queryParams.avatar"
                    placeholder="请输入用户头像"
                    clearable
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="是否更新过用户信息" prop="isInit">
                <el-select
                    v-model="queryParams.isInit"
                    placeholder="请选择是否更新过用户信息"
                    clearable
                >
                    <el-option
                        v-for="dict in wx_user_init"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime">
                <el-date-picker
                    clearable
                    v-model="queryParams.createTime"
                    type="date"
                    value-format="YYYY-MM-DD"
                    placeholder="请选择创建时间"
                >
                </el-date-picker>
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
                    v-hasPermi="['wx:wxuser:add']"
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
                    v-hasPermi="['wx:wxuser:edit']"
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
                    v-hasPermi="['wx:wxuser:remove']"
                    >删除</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="Download"
                    @click="handleExport"
                    v-hasPermi="['wx:wxuser:export']"
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
            :data="wxuserList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
                label="用户id"
                align="center"
                prop="userId"
                v-if="true"
            />
            <el-table-column label="用户openid" align="center" prop="openId" />
            <el-table-column label="用户昵称" align="center" prop="nickName" />
            <el-table-column
                label="手机号码"
                align="center"
                prop="phonenumber"
            />
            <el-table-column label="用户头像" align="center" prop="avatar" />
            <el-table-column
                label="是否更新过用户信息"
                align="center"
                prop="isInit"
            >
                <template #default="scope">
                    <dict-tag
                        :options="wx_user_init"
                        :value="scope.row.isInit"
                    />
                </template>
            </el-table-column>
            <el-table-column label="用户类型" align="center" prop="userType" />
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
                        v-hasPermi="['wx:wxuser:edit']"
                        >修改</el-button
                    >
                    <el-button
                        type="text"
                        icon="Delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['wx:wxuser:remove']"
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

        <!-- 添加或修改wx 端用户信息对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form
                ref="wxuserRef"
                :model="form"
                :rules="rules"
                label-width="100px"
            >
                <el-form-item label="用户openid" prop="openId">
                    <el-input
                        v-model="form.openId"
                        placeholder="请输入用户openid"
                    />
                </el-form-item>
                <el-form-item label="用户昵称" prop="nickName">
                    <el-input
                        v-model="form.nickName"
                        placeholder="请输入用户昵称"
                    />
                </el-form-item>
                <el-form-item label="手机号码" prop="phonenumber">
                    <el-input
                        v-model="form.phonenumber"
                        placeholder="请输入手机号码"
                    />
                </el-form-item>
                <el-form-item label="用户头像" prop="avatar">
                    <el-input
                        v-model="form.avatar"
                        placeholder="请输入用户头像"
                    />
                </el-form-item>
                <el-form-item label="是否更新过用户信息" prop="isInit">
                    <el-select
                        v-model="form.isInit"
                        placeholder="请选择是否更新过用户信息"
                    >
                        <el-option
                            v-for="dict in wx_user_init"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        ></el-option>
                    </el-select>
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

<script setup name="Wxuser">
import {
    listWxuser,
    getWxuser,
    delWxuser,
    addWxuser,
    updateWxuser,
} from "@/api/wx/wxuser";

const { proxy } = getCurrentInstance();
const { wx_user_init } = proxy.useDict("wx_user_init");

const wxuserList = ref([]);
const open = ref(false);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: undefined,
        openId: undefined,
        nickName: undefined,
        phonenumber: undefined,
        avatar: undefined,
        isInit: undefined,
        createTime: undefined,
        userType: undefined,
    },
    rules: {
        userId: [
            { required: true, message: "用户id不能为空", trigger: "blur" },
        ],
        openId: [
            { required: true, message: "用户openid不能为空", trigger: "blur" },
        ],
        isInit: [
            {
                required: true,
                message: "是否更新过用户信息不能为空",
                trigger: "change",
            },
        ],
        userType: [
            { required: true, message: "用户类型不能为空", trigger: "change" },
        ],
    },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询wx 端用户信息列表 */
function getList() {
    loading.value = true;
    listWxuser(queryParams.value).then((response) => {
        wxuserList.value = response.rows;
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
        userId: null,
        openId: null,
        nickName: null,
        phonenumber: null,
        avatar: null,
        isInit: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        userType: null,
    };
    proxy.resetForm("wxuserRef");
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
    ids.value = selection.map((item) => item.userId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加wx 端用户信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
    loading.value = true;
    reset();
    const _userId = row.userId || ids.value;
    getWxuser(_userId).then((response) => {
        loading.value = false;
        form.value = response.data;
        open.value = true;
        title.value = "修改wx 端用户信息";
    });
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["wxuserRef"].validate((valid) => {
        if (valid) {
            buttonLoading.value = true;
            if (form.value.userId != null) {
                updateWxuser(form.value)
                    .then((response) => {
                        proxy.$modal.msgSuccess("修改成功");
                        open.value = false;
                        getList();
                    })
                    .finally(() => {
                        buttonLoading.value = false;
                    });
            } else {
                addWxuser(form.value)
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
    const _userIds = row.userId || ids.value;
    proxy.$modal
        .confirm('是否确认删除wx 端用户信息编号为"' + userIds + '"的数据项？')
        .then(function () {
            loading.value = true;
            return delWxuser(_userIds);
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
        "wx/wxuser/export",
        {
            ...queryParams.value,
        },
        `wxuser_${new Date().getTime()}.xlsx`
    );
}

getList();
</script>

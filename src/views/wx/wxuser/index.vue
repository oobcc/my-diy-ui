<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="用户openid" prop="openId">
                <el-input
                    v-model="queryParams.openId"
                    placeholder="请输入用户openid"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickName">
                <el-input
                    v-model="queryParams.nickName"
                    placeholder="请输入用户昵称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="手机号码" prop="phonenumber">
                <el-input
                    v-model="queryParams.phonenumber"
                    placeholder="请输入手机号码"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="用户头像" prop="avatar">
                <el-input
                    v-model="queryParams.avatar"
                    placeholder="请输入用户头像"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <!-- <el-form-item label="是否更新过用户信息" prop="isInit">
                <el-select
                    v-model="queryParams.isInit"
                    placeholder="请选择是否更新过用户信息"
                    clearable
                >
                    <el-option
                        v-for="dict in dict.type.wx_user_init"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item> -->
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="mini"
                    @click="handleQuery"
                    >搜索</el-button
                >
                <el-button
                    icon="el-icon-refresh"
                    size="mini"
                    @click="resetQuery"
                    >重置</el-button
                >
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                    v-hasPermi="['wx:wxuser:add']"
                    >新增</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="success"
                    plain
                    icon="el-icon-edit"
                    size="mini"
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
                    icon="el-icon-delete"
                    size="mini"
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
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    v-hasPermi="['wx:wxuser:export']"
                    >导出</el-button
                >
            </el-col>
            <right-toolbar
                :showSearch.sync="showSearch"
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
                <template slot-scope="scope">
                    <dict-tag
                        :options="dict.type.wx_user_init"
                        :value="scope.row.isInit"
                    />
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['wx:wxuser:edit']"
                        >修改</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
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
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />

        <!-- 添加或修改wx 端用户信息对话框 -->
        <el-dialog
            :title="title"
            :visible.sync="open"
            width="500px"
            append-to-body
        >
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="用户昵称" prop="nickName">
                    <el-input
                        v-model="form.nickName"
                        placeholder="请输入用户昵称"
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button
                    :loading="buttonLoading"
                    type="primary"
                    @click="submitForm"
                    >确 定</el-button
                >
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listWxuser,
    getWxuser,
    delWxuser,
    addWxuser,
    updateWxuser,
} from "@/api/wx/wxuser";

export default {
    name: "Wxuser",
    dicts: ["wx_user_init"],
    data() {
        return {
            // 按钮loading
            buttonLoading: false,
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // wx 端用户信息表格数据
            wxuserList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                openId: undefined,
                nickName: undefined,
                phonenumber: undefined,
                avatar: undefined,
                isInit: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                userId: [
                    {
                        required: true,
                        message: "用户id不能为空",
                        trigger: "blur",
                    },
                ],
                openId: [
                    {
                        required: true,
                        message: "用户openid不能为空",
                        trigger: "blur",
                    },
                ],
                nickName: [
                    {
                        required: true,
                        message: "用户昵称不能为空",
                        trigger: "blur",
                    },
                ],
                phonenumber: [
                    {
                        required: true,
                        message: "手机号码不能为空",
                        trigger: "blur",
                    },
                ],
                avatar: [
                    {
                        required: true,
                        message: "用户头像不能为空",
                        trigger: "blur",
                    },
                ],
                isInit: [
                    {
                        required: true,
                        message: "是否更新过用户信息不能为空",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询wx 端用户信息列表 */
        getList() {
            this.loading = true;
            listWxuser(this.queryParams).then((response) => {
                this.wxuserList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                userId: undefined,
                openId: undefined,
                nickName: undefined,
                phonenumber: undefined,
                avatar: undefined,
                isInit: undefined,
                createBy: undefined,
                createTime: undefined,
                updateBy: undefined,
                updateTime: undefined,
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.userId);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加wx 端用户信息";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.loading = true;
            this.reset();
            const userId = row.userId || this.ids;
            getWxuser(userId).then((response) => {
                this.loading = false;
                this.form = response.data;
                this.open = true;
                this.title = "修改wx 端用户信息";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    if (this.form.userId != null) {
                        updateWxuser(this.form)
                            .then((response) => {
                                this.$modal.msgSuccess("修改成功");
                                this.open = false;
                                this.getList();
                            })
                            .finally(() => {
                                this.buttonLoading = false;
                            });
                    } else {
                        addWxuser(this.form)
                            .then((response) => {
                                this.$modal.msgSuccess("新增成功");
                                this.open = false;
                                this.getList();
                            })
                            .finally(() => {
                                this.buttonLoading = false;
                            });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const userIds = row.userId || this.ids;
            this.$modal
                .confirm(
                    '是否确认删除wx 端用户信息编号为"' + userIds + '"的数据项？'
                )
                .then(() => {
                    this.loading = true;
                    return delWxuser(userIds);
                })
                .then(() => {
                    this.loading = false;
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false;
                });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "wx/wxuser/export",
                {
                    ...this.queryParams,
                },
                `wxuser_${new Date().getTime()}.xlsx`
            );
        },
    },
};
</script>

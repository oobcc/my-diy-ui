<template>
    <div class="app-container home">
        <el-row :gutter="20">
            <el-col :sm="24" :lg="12" style="padding-left: 20px">
                <h2>电脑DIY配件推荐后台管理系统</h2>
                <p>
                    * 前端开发框架 Vue、Element UI、Uniapp、TypeScript<br />
                    * 后端开发框架 Spring Boot、Gin、Django<br />
                    * 深度学习框架 paddle、paddlenlp<br />
                    * NLP预训练模型 ERNIE 3.0 <br />
                    * 配置管理 Nacos <br />
                    * 权限认证框架 Sa-Token 支持多终端认证系统<br />
                    * 关系数据库 MySQL 8.X <br />
                    * 数据库框架 Mybatis-Plus 快速 CRUD 增加开发效率<br />
                    * 序列化框架 Jackson 统一使用 jackson 高效可靠<br />
                    * Redis客户端 Redisson 性能强劲、API丰富<br />
                    * 文件存储 阿里OSS<br />
                    * 文档框架 SpringDoc、javadoc 无注解零入侵基于java注释<br />
                    * 原子化CSS Unocss<br />
                </p>
            </el-col>

            <el-col :sm="24" :lg="12" style="padding-left: 50px">
                <el-row>
                    <el-col :span="12">
                        <h2>技术选型</h2>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <h4>后端技术</h4>
                        <ul>
                            <li>SpringBoot</li>
                            <li>Gin</li>
                            <li>Django</li>
                            <li>Nacos</li>
                            <li>Sa-Token</li>
                            <li>MyBatis-Plus</li>
                            <li>Jackson</li>
                            <li>Redis</li>
                            <li>...</li>
                        </ul>
                    </el-col>
                    <el-col :span="6">
                        <h4>前端技术</h4>
                        <ul>
                            <li>Vue</li>
                            <li>Pinia</li>
                            <li>Element-ui</li>
                            <li>Axios</li>
                            <li>Sass</li>
                            <li>Uniapp</li>
                            <li>TypeScript</li>
                            <li>Unocss</li>
                            <li>Vite</li>
                            <li>...</li>
                        </ul>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-divider />
    </div>
</template>

<script setup name="Index">
const version = ref("4.3.1");

function goTarget(url) {
    window.open(url, "__blank");
}
</script>

<style scoped lang="scss">
.home {
    blockquote {
        padding: 10px 20px;
        margin: 0 0 20px;
        font-size: 17.5px;
        border-left: 5px solid #eee;
    }
    hr {
        margin-top: 20px;
        margin-bottom: 20px;
        border: 0;
        border-top: 1px solid #eee;
    }
    .col-item {
        margin-bottom: 20px;
    }

    ul {
        padding: 0;
        margin: 0;
    }

    font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 13px;
    color: #676a6c;
    overflow-x: hidden;

    ul {
        list-style-type: none;
    }

    h4 {
        margin-top: 0px;
    }

    h2 {
        margin-top: 10px;
        font-size: 26px;
        font-weight: 100;
    }

    p {
        margin-top: 10px;

        b {
            font-weight: 700;
        }
    }

    .update-log {
        ol {
            display: block;
            list-style-type: decimal;
            margin-block-start: 1em;
            margin-block-end: 1em;
            margin-inline-start: 0;
            margin-inline-end: 0;
            padding-inline-start: 40px;
        }
    }
}
</style>

from __future__ import annotations

def fix_login_view(c: str) -> str:
    return LOGIN_VIEW


def _r(content: str, *pairs: tuple[str, str]) -> str:
    out = content
    for old, new in pairs:
        out = out.replace(old, new)
    return out

def fix_students(c: str) -> str:
    return _r(
        c,
        ("label: '??', to: '/dashboard'", "label: '首页', to: '/dashboard'"),
        ("{ label: '????' }, { label: '????' }]", "{ label: '教务业务' }, { label: '学生管理' }]"),
        ("title=\"????\"", "title=\"学生管理\""),
        ("{ key: 'name', label: '??' }", "{ key: 'name', label: '姓名' }"),
        ("{ key: 'studentNo', label: '??' }", "{ key: 'studentNo', label: '学号' }"),
        ("{ key: 'grade', label: '??' }", "{ key: 'grade', label: '年级' }"),
        ("{ key: 'className', label: '??' }", "{ key: 'className', label: '班级' }"),
        ("{ key: 'status', label: '??' }", "{ key: 'status', label: '状态' }"),
        ("{ key: 'enrolledAt', label: '????' }", "{ key: 'enrolledAt', label: '入学日期' }"),
        ("{ key: 'actions', label: '??', width: 140 }", "{ key: 'actions', label: '操作', width: 140 }"),
        ("placeholder=\"?? / ??\"", "placeholder=\"姓名 / 学号\""),
        ("{ label: '??', value: '??' }, { label: '??', value: '??' }, { label: '??', value: '??' }]", "{ label: '高一', value: '高一' }, { label: '高二', value: '高二' }, { label: '高三', value: '高三' }]"),
        ("placeholder=\"??\"\n          clearable\n          style=\"width: 8rem\"\n        />\n        <WiSelect\n          v-model=\"status\"", "placeholder=\"年级\"\n          clearable\n          style=\"width: 8rem\"\n        />\n        <WiSelect\n          v-model=\"status\""),
        ("{ label: '??', value: 'active' }, { label: '??', value: 'leave' }, { label: '??', value: 'graduated' }]", "{ label: '在读', value: 'active' }, { label: '休学', value: 'leave' }, { label: '毕业', value: 'graduated' }]"),
        ("placeholder=\"??\"\n          clearable\n          style=\"width: 8rem\"\n        />\n        <WiButton>??</WiButton>", "placeholder=\"状态\"\n          clearable\n          style=\"width: 8rem\"\n        />\n        <WiButton>查询</WiButton>"),
        ("<WiButton severity=\"secondary\">??</WiButton>", "<WiButton severity=\"secondary\">重置</WiButton>"),
        ("students-page__columns-label\">????</span>", "students-page__columns-label\">显示列</span>"),
        ("summary: '??? CSV ????' })", "summary: '演示：CSV 导出已触发' })"),
        (">??\n      </WiButton>\n    </template>\n\n    <template #cell-status", ">导出\n      </WiButton>\n    </template>\n\n    <template #cell-status"),
        (":value=\"value === 'active' ? '??' : value === 'leave' ? '??' : '??'\"", ":value=\"value === 'active' ? '在读' : value === 'leave' ? '休学' : '毕业'\""),
        (">??</WiButton>\n        <WiButton size=\"small\" severity=\"danger\">??</WiButton>", ">编辑</WiButton>\n        <WiButton size=\"small\" severity=\"danger\">删除</WiButton>"),
    )

def fix_teachers(c: str) -> str:
    return _r(
        c,
        ("label: '??', to: '/dashboard'", "label: '首页', to: '/dashboard'"),
        ("{ label: '????' }, { label: '????' }]", "{ label: '教务业务' }, { label: '教师管理' }]"),
        ("title=\"????\"", "title=\"教师管理\""),
        ("{ key: 'name', label: '??' }", "{ key: 'name', label: '姓名' }"),
        ("{ key: 'title', label: '??' }", "{ key: 'title', label: '职称' }"),
        ("{ key: 'department', label: '???' }", "{ key: 'department', label: '院系' }"),
        ("{ key: 'courses', label: '???', width: 88 }", "{ key: 'courses', label: '课程数', width: 88 }"),
        ("{ key: 'status', label: '??', width: 88 }", "{ key: 'status', label: '状态', width: 88 }"),
        ("{ key: 'actions', label: '??', width: 120 }", "{ key: 'actions', label: '操作', width: 120 }"),
        ("placeholder=\"????\"", "placeholder=\"姓名关键词\""),
        ("<WiButton>??</WiButton>", "<WiButton>查询</WiButton>"),
        (":value=\"value === 'active' ? '??' : '??'\"", ":value=\"value === 'active' ? '在职' : '离职'\""),
        (">??</WiButton>\n    </template>", ">详情</WiButton>\n    </template>"),
    )

def fix_courses(c: str) -> str:
    return _r(
        c,
        ("label: '??', to: '/dashboard'", "label: '首页', to: '/dashboard'"),
        ("{ label: '????' }, { label: '????' }]", "{ label: '教务业务' }, { label: '课程管理' }]"),
        ("title=\"????\"", "title=\"课程管理\""),
        ("{ key: 'name', label: '????' }", "{ key: 'name', label: '课程名称' }"),
        ("{ key: 'category', label: '??' }", "{ key: 'category', label: '类别' }"),
        ("{ key: 'credits', label: '??', width: 72 }", "{ key: 'credits', label: '学分', width: 72 }"),
        ("{ key: 'teacher', label: '????' }", "{ key: 'teacher', label: '任课教师' }"),
        ("{ key: 'enrolled', label: '??/??', width: 112 }", "{ key: 'enrolled', label: '已选/容量', width: 112 }"),
        ("{ key: 'status', label: '??', width: 88 }", "{ key: 'status', label: '状态', width: 88 }"),
        ("{ key: 'actions', label: '??', width: 120 }", "{ key: 'actions', label: '操作', width: 120 }"),
        ("placeholder=\"????\"", "placeholder=\"课程名称\""),
        ("{ label: '??', value: '??' }, { label: '??', value: '??' }, { label: '??', value: '??' }]", "{ label: '理科', value: '理科' }, { label: '文科', value: '文科' }, { label: '实验', value: '实验' }]"),
        ("placeholder=\"??\"", "placeholder=\"类别\""),
        ("<WiButton>??</WiButton>", "<WiButton>查询</WiButton>"),
        (":value=\"value === 'open' ? '??' : value === 'full' ? '??' : '??'\"", ":value=\"value === 'open' ? '开放' : value === 'full' ? '已满' : '关闭'\""),
        (">??</WiButton>\n    </template>\n</template>", ">编辑</WiButton>\n    </template>\n</template>"),
    )

def fix_classes(c: str) -> str:
    return _r(
        c,
        ("label: '??', to: '/dashboard'", "label: '首页', to: '/dashboard'"),
        ("{ label: '????' }, { label: '????' }]", "{ label: '教务业务' }, { label: '班级管理' }]"),
        ("title=\"????\"", "title=\"班级管理\""),
        ("{ key: 'name', label: '??' }", "{ key: 'name', label: '班级' }"),
        ("{ key: 'grade', label: '??', width: 88 }", "{ key: 'grade', label: '年级', width: 88 }"),
        ("{ key: 'headTeacher', label: '???' }", "{ key: 'headTeacher', label: '班主任' }"),
        ("{ key: 'students', label: '??', width: 72 }", "{ key: 'students', label: '人数', width: 72 }"),
        ("{ key: 'room', label: '??', width: 88 }", "{ key: 'room', label: '教室', width: 88 }"),
        ("{ key: 'actions', label: '??', width: 120 }", "{ key: 'actions', label: '操作', width: 120 }"),
        (">???</WiButton>", ">花名册</WiButton>"),
        (">??</WiButton>", ">课表</WiButton>"),
    )

FIXERS: dict[str, callable] = {
    "views/academic/StudentsView.vue": fix_students,
    "views/academic/TeachersView.vue": fix_teachers,
    "views/academic/CoursesView.vue": fix_courses,
    "views/academic/ClassesView.vue": fix_classes,
}

def apply_fixes(rel: str, content: str) -> str:
    fn = FIXERS.get(rel)
    return fn(content) if fn else content

def fix_batch_ops(c: str) -> str:
    return _r(
        c,
        ("batch-ops__title\">??????</h1>", "batch-ops__title\">批量操作</h1>"),
        ("<WiCard title=\"??????\">", "<WiCard title=\"批量导入\">"),
        ("batch-ops__desc\">?? Excel / CSV ??????????????</p>", "batch-ops__desc\">上传 Excel / CSV 批量导入学生、课程或成绩数据。</p>"),
        (">????</WiButton>", ">开始导入</WiButton>"),
        ("summary: '??????', detail: '?? 128 ???? 2 ?'", "summary: '导入完成', detail: '成功 128 条，失败 2 条'"),
        ("<WiCard title=\"????\">", "<WiCard title=\"批量导出\">"),
        ("batch-ops__desc\">??????????????????</p>", "batch-ops__desc\">按筛选条件导出当前列表数据。</p>"),
        (">???? CSV</WiButton>", ">导出 CSV</WiButton>"),
        (">???? Excel</WiButton>", ">导出 Excel</WiButton>"),
        (">?? PDF ??</WiButton>", ">生成 PDF 报表</WiButton>"),
        ("<WiCard title=\"??????\">", "<WiCard title=\"批量审批\">"),
        ("<WiTag value=\"?? 0 ?\" severity=\"info\" />", "<WiTag value=\"已选 0 条\" severity=\"info\" />"),
        (">????</WiButton>", ">批量通过</WiButton>"),
        (">????</WiButton>", ">批量驳回</WiButton>"),
    )

def fix_enrollment(c: str) -> str:
    return _r(
        c,
        ("`${item.name}?${item.teacher}?`", "`${item.name} · ${item.teacher}`"),
        ("selectedCourse.value?.category === '??'", "selectedCourse.value?.category === '实验'"),
        ("summary: '?????', life: 2500 })", "summary: '草稿已保存', life: 2500 })"),
        ("summary: '???????', detail: '???????'", "summary: '选课申请已提交', detail: '请等待教务审核'"),
        ("<h1>??????</h1>", "<h1>选课报名表</h1>"),
        ("<p>?????????????????????????????</p>", "<p>填写学生与课程信息，支持上传实验类课程所需材料。</p>"),
        ("label=\"????\"", "label=\"学生姓名\""),
        ("label=\"??\"", "label=\"学号\""),
        ("label=\"????\"", "label=\"选择课程\""),
        ("placeholder=\"?????\"", "placeholder=\"请选择课程\""),
        ("label=\"???????\"", "label=\"上传材料\""),
        ("placeholder=\"????????\"", "placeholder=\"材料说明（可选）\""),
        ("label=\"????\"", "label=\"申请日期\""),
        ("label=\"????\"", "label=\"申请理由\""),
        ("label=\"???????\"", "label=\"短信通知家长\""),
        (">????</WiButton>", ">提交申请</WiButton>"),
        (">????</WiButton>", ">保存草稿</WiButton>"),
        (">??</WiButton>", ">取消</WiButton>"),
        ("enrollment-form__draft-hint\">???????? localStorage</p>", "enrollment-form__draft-hint\">草稿已保存至 localStorage</p>"),
    )

def fix_workflow(c: str) -> str:
    return _r(
        c,
        ("{ label: '????', description: '?? / ????' }", "{ label: '提交申请', description: '教师 / 学生' }"),
        ("{ label: '?????', description: '??' }", "{ label: '教务审核', description: '教务' }"),
        ("{ label: '????', description: '??' }", "{ label: '院系审批', description: '院长' }"),
        ("{ label: '??', description: '??' }", "{ label: '归档', description: '系统' }"),
        ("{ key: 'title', label: '??' }", "{ key: 'title', label: '标题' }"),
        ("{ key: 'applicant', label: '???', width: 96 }", "{ key: 'applicant', label: '申请人', width: 96 }"),
        ("{ key: 'step', label: '????', width: 112 }", "{ key: 'step', label: '当前节点', width: 112 }"),
        ("{ key: 'status', label: '??', width: 96 }", "{ key: 'status', label: '状态', width: 96 }"),
        ("{ key: 'updatedAt', label: '????', width: 140 }", "{ key: 'updatedAt', label: '更新时间', width: 140 }"),
        ("{ content: '??????', date: '2026-09-02 09:00'", "{ content: '申请已提交', date: '2026-09-02 09:00'"),
        ("{ content: '??????', date: '2026-09-02 10:15'", "{ content: '教务审核通过', date: '2026-09-02 10:15'"),
        ("{ content: '??????', date: '???'", "{ content: '等待院系审批', date: '待定'"),
        ("workflow-page__title\">????</h1>", "workflow-page__title\">审批流程</h1>"),
        ("<WiCard title=\"???????\">", "<WiCard title=\"流程进度示意\">"),
        ("<WiCard title=\"????\">", "<WiCard title=\"待办列表\">"),
        (":value=\"value === 'pending' ? '???' : value === 'approved' ? '???' : '???'\"", ":value=\"value === 'pending' ? '待审批' : value === 'approved' ? '已通过' : '已驳回'\""),
        ("<WiCard title=\"??????????????\">", "<WiCard title=\"最近动态（示例）\">"),
        (">??</WiButton>", ">刷新</WiButton>"),
    )

def fix_users(c: str) -> str:
    return _r(
        c,
        ("name: '???', email: 'admin@educloud.cn', role: '?????'", "name: '张管理员', email: 'admin@educloud.cn', role: '超级管理员'"),
        ("name: '???', email: 'li@educloud.cn', role: '????'", "name: '李老师', email: 'li@educloud.cn', role: '教务主任'"),
        ("name: '???', email: 'wang@educloud.cn', role: '???'", "name: '王班主任', email: 'wang@educloud.cn', role: '班主任'"),
        ("{ key: 'name', label: '??' }", "{ key: 'name', label: '姓名' }"),
        ("{ key: 'email', label: '??' }", "{ key: 'email', label: '邮箱' }"),
        ("{ key: 'role', label: '??' }", "{ key: 'role', label: '角色' }"),
        ("{ key: 'status', label: '??', width: 88 }", "{ key: 'status', label: '状态', width: 88 }"),
        ("{ key: 'lastLogin', label: '????', width: 140 }", "{ key: 'lastLogin', label: '最近登录', width: 140 }"),
        ("{ key: 'actions', label: '??', width: 120 }", "{ key: 'actions', label: '操作', width: 120 }"),
        ("label: '??', to: '/dashboard'", "label: '首页', to: '/dashboard'"),
        ("{ label: '?????' }, { label: '????' }]", "{ label: '权限与安全' }, { label: '用户管理' }]"),
        ("title=\"????\"", "title=\"用户管理\""),
        (":value=\"value === 'active' ? '??' : '??'\"", ":value=\"value === 'active' ? '正常' : '停用'\""),
        (">??</WiButton>\n        <WiButton size=\"small\" severity=\"danger\">??</WiButton>", ">编辑</WiButton>\n        <WiButton size=\"small\" severity=\"danger\">禁用</WiButton>"),
    )

def fix_roles(c: str) -> str:
    return _r(
        c,
        ("{ key: 'name', label: '????' }", "{ key: 'name', label: '角色名称' }"),
        ("{ key: 'code', label: '??' }", "{ key: 'code', label: '编码' }"),
        ("{ key: 'users', label: '???', width: 88 }", "{ key: 'users', label: '用户数', width: 88 }"),
        ("{ key: 'permissions', label: '????' }", "{ key: 'permissions', label: '权限范围' }"),
        ("{ key: 'status', label: '??', width: 88 }", "{ key: 'status', label: '状态', width: 88 }"),
        ("{ key: 'actions', label: '??', width: 120 }", "{ key: 'actions', label: '操作', width: 120 }"),
        ("label: '??', to: '/dashboard'", "label: '首页', to: '/dashboard'"),
        ("{ label: '?????' }, { label: '????' }]", "{ label: '权限与安全' }, { label: '角色管理' }]"),
        ("title=\"????\"", "title=\"角色管理\""),
        (":value=\"value === 'active' ? '??' : '??'\"", ":value=\"value === 'active' ? '启用' : '停用'\""),
        (">????</WiButton>", ">分配权限</WiButton>"),
    )

def fix_permissions(c: str) -> str:
    return _r(
        c,
        ("{ key: 'name', label: '????' }", "{ key: 'name', label: '权限名称' }"),
        ("{ key: 'code', label: '???' }", "{ key: 'code', label: '标识' }"),
        ("{ key: 'type', label: '??', width: 88 }", "{ key: 'type', label: '类型', width: 88 }"),
        ("{ key: 'module', label: '??', width: 96 }", "{ key: 'module', label: '模块', width: 96 }"),
        ("<h1>?????RBAC?</h1>", "<h1>权限清单（RBAC）</h1>"),
        ("<p class=\"permissions-page__desc\">??????????/????????</p>", "<p class=\"permissions-page__desc\">菜单、按钮与 API 权限统一管理。</p>"),
        (":value=\"value === 'menu' ? '??' : value === 'button' ? '??' : '??'\"", ":value=\"value === 'menu' ? '菜单' : value === 'button' ? '按钮' : '接口'\""),
    )

def fix_data_scope(c: str) -> str:
    return _r(
        c,
        ("<h1>????</h1>", "<h1>数据权限</h1>"),
        ("<p class=\"data-scope__desc\">????????????????????????</p>", "<p class=\"data-scope__desc\">配置角色可访问的数据范围，支持按院系隔离。</p>"),
        ("<WiCard title=\"??? 锟???????\">", "<WiCard title=\"示例：教务主任\">"),
        ("label=\"????\"", "label=\"数据范围\""),
        ("label=\"仅本人数据\"", "label=\"仅本人数据\""),
        ("<WiRadio value=\"self\" label=\"?????\" />", "<WiRadio value=\"self\" label=\"仅本人数据\" />"),
        ("<WiRadio value=\"department\" label=\"?????\" />", "<WiRadio value=\"department\" label=\"本部门数据\" />"),
        ("<WiRadio value=\"all\" label=\"????\" />", "<WiRadio value=\"all\" label=\"全部数据\" />"),
        ("label=\"????\"", "label=\"所属院系\""),
        ("{ label: '???', value: 'math' }", "{ label: '数学组', value: 'math' }"),
        ("{ label: '???', value: 'chinese' }", "{ label: '语文组', value: 'chinese' }"),
        ("{ label: '???', value: 'english' }", "{ label: '英语组', value: 'english' }"),
        (">????</WiButton>", ">保存配置</WiButton>"),
        (">????</WiButton>", ">重置</WiButton>"),
    )

def fix_audit_logs(c: str) -> str:
    return _r(
        c,
        ("{ key: 'operator', label: '???' }", "{ key: 'operator', label: '操作人' }"),
        ("{ key: 'action', label: '??', width: 88 }", "{ key: 'action', label: '动作', width: 88 }"),
        ("{ key: 'target', label: '??' }", "{ key: 'target', label: '对象' }"),
        ("{ key: 'time', label: '??', width: 140 }", "{ key: 'time', label: '时间', width: 140 }"),
        ("label: '??', to: '/dashboard'", "label: '首页', to: '/dashboard'"),
        ("{ label: '?????' }, { label: '????' }]", "{ label: '权限与安全' }, { label: '审计日志' }]"),
        ("title=\"????\"", "title=\"审计日志\""),
    )

FIXERS.update({
    "views/academic/BatchOpsView.vue": fix_batch_ops,
    "views/academic/EnrollmentFormView.vue": fix_enrollment,
    "views/academic/WorkflowView.vue": fix_workflow,
    "views/security/UsersView.vue": fix_users,
    "views/security/RolesView.vue": fix_roles,
    "views/security/PermissionsView.vue": fix_permissions,
    "views/security/DataScopeView.vue": fix_data_scope,
    "views/security/AuditLogsView.vue": fix_audit_logs,
})

def fix_messages(c: str) -> str:
    return _r(
        c,
        ("{ key: 'channel', label: '??', width: 88 }", "{ key: 'channel', label: '渠道', width: 88 }"),
        ("{ key: 'title', label: '??' }", "{ key: 'title', label: '标题' }"),
        ("{ key: 'template', label: '??', width: 140 }", "{ key: 'template', label: '模板', width: 140 }"),
        ("{ key: 'sentAt', label: '????', width: 140 }", "{ key: 'sentAt', label: '发送时间', width: 140 }"),
        ("{ key: 'status', label: '??', width: 88 }", "{ key: 'status', label: '状态', width: 88 }"),
        ("<h1>????</h1>", "<h1>消息中心</h1>"),
        ("{ label: '????', value: 'records' }", "{ label: '发送记录', value: 'records' }"),
        ("{ label: '????', value: 'templates' }", "{ label: '消息模板', value: 'templates' }"),
        (":value=\"value === 'success' ? '??' : value === 'failed' ? '??' : '???'\"", ":value=\"value === 'success' ? '成功' : value === 'failed' ? '失败' : '排队中'\""),
        ("<WiCard v-else title=\"????\">", "<WiCard v-else title=\"模板管理\">"),
        ("<p class=\"messages-page__desc\">?????????????????</p>", "<p class=\"messages-page__desc\">维护站内信、短信与邮件模板。</p>"),
        (">????</WiButton>", ">新建模板</WiButton>"),
    )

def fix_scheduler(c: str) -> str:
    return _r(
        c,
        ("summary: '???????', detail: id", "summary: '任务已触发', detail: id"),
        ("{ key: 'name', label: '????' }", "{ key: 'name', label: '任务名称' }"),
        ("{ key: 'lastRun', label: '????', width: 140 }", "{ key: 'lastRun', label: '上次执行', width: 140 }"),
        ("{ key: 'nextRun', label: '????', width: 140 }", "{ key: 'nextRun', label: '下次执行', width: 140 }"),
        ("{ key: 'status', label: '??', width: 96 }", "{ key: 'status', label: '状态', width: 96 }"),
        ("{ key: 'actions', label: '??', width: 160 }", "{ key: 'actions', label: '操作', width: 160 }"),
        ("label: '??', to: '/dashboard'", "label: '首页', to: '/dashboard'"),
        ("{ label: '????' }, { label: '????' }]", "{ label: '系统运营' }, { label: '定时任务' }]"),
        ("title=\"??????\"", "title=\"定时任务\""),
        (":value=\"value === 'running' ? '???' : value === 'paused' ? '???' : '??'\"", ":value=\"value === 'running' ? '运行中' : value === 'paused' ? '已暂停' : '空闲'\""),
        (">????</WiButton>", ">立即执行</WiButton>"),
        ("{{ row.status === 'paused' ? '??' : '??' }}", "{{ row.status === 'paused' ? '恢复' : '暂停' }}"),
    )

def fix_dictionary(c: str) -> str:
    return _r(
        c,
        ("{ key: 'type', label: '????', width: 140 }", "{ key: 'type', label: '字典类型', width: 140 }"),
        ("{ key: 'label', label: '???' }", "{ key: 'label', label: '显示名' }"),
        ("{ key: 'value', label: '?', width: 120 }", "{ key: 'value', label: '值', width: 120 }"),
        ("{ key: 'sort', label: '??', width: 72 }", "{ key: 'sort', label: '排序', width: 72 }"),
        ("{ key: 'status', label: '??', width: 88 }", "{ key: 'status', label: '状态', width: 88 }"),
        ("label: '??', to: '/dashboard'", "label: '首页', to: '/dashboard'"),
        ("{ label: '????' }, { label: '????' }]", "{ label: '系统运营' }, { label: '字典管理' }]"),
        ("title=\"????\"", "title=\"字典管理\""),
        (":value=\"value === 'enabled' ? '??' : '??'\"", ":value=\"value === 'enabled' ? '启用' : '停用'\""),
    )

def fix_reports(c: str) -> str:
    return _r(
        c,
        ("<h1>????</h1>", "<h1>数据报表</h1>"),
        ("{ label: '???', value: 'grade' }", "{ label: '按年级', value: 'grade' }"),
        ("{ label: '???', value: 'department' }", "{ label: '按院系', value: 'department' }"),
        ("{ label: '???', value: 'month' }", "{ label: '按月份', value: 'month' }"),
        (">?? Excel</WiButton>", ">导出 Excel</WiButton>"),
        (">?? PDF</WiButton>", ">导出 PDF</WiButton>"),
        ("<WiCard title=\"????\">", "<WiCard title=\"选课趋势\">"),
    )

def fix_error_monitor(c: str) -> str:
    return _r(
        c,
        ("{ key: 'endpoint', label: '??' }", "{ key: 'endpoint', label: '接口' }"),
        ("{ key: 'code', label: '???', width: 88 }", "{ key: 'code', label: '状态码', width: 88 }"),
        ("{ key: 'message', label: '????' }", "{ key: 'message', label: '错误信息' }"),
        ("{ key: 'count', label: '??', width: 72 }", "{ key: 'count', label: '次数', width: 72 }"),
        ("{ key: 'lastSeen', label: '????', width: 140 }", "{ key: 'lastSeen', label: '最近出现', width: 140 }"),
        ("label: '??', to: '/dashboard'", "label: '首页', to: '/dashboard'"),
        ("{ label: '?????' }, { label: '????' }]", "{ label: '分析报表' }, { label: '异常监控' }]"),
        ("title=\"????\"", "title=\"异常监控\""),
    )

def fix_recycle(c: str) -> str:
    return _r(
        c,
        ("summary: '???', detail: name", "summary: '已恢复', detail: name"),
        ("{ key: 'name', label: '??' }", "{ key: 'name', label: '名称' }"),
        ("{ key: 'module', label: '??', width: 112 }", "{ key: 'module', label: '模块', width: 112 }"),
        ("{ key: 'deletedBy', label: '???', width: 96 }", "{ key: 'deletedBy', label: '删除人', width: 96 }"),
        ("{ key: 'deletedAt', label: '????', width: 112 }", "{ key: 'deletedAt', label: '删除时间', width: 112 }"),
        ("{ key: 'expireAt', label: '????', width: 112 }", "{ key: 'expireAt', label: '过期时间', width: 112 }"),
        ("{ key: 'actions', label: '??', width: 120 }", "{ key: 'actions', label: '操作', width: 120 }"),
        ("label: '??', to: '/dashboard'", "label: '首页', to: '/dashboard'"),
        ("{ label: '????' }, { label: '???' }]", "{ label: '能力增强' }, { label: '回收站' }]"),
        ("title=\"???\"", "title=\"回收站\""),
        (">??</WiButton>", ">恢复</WiButton>"),
        (">????</WiButton>", ">彻底删除</WiButton>"),
    )



def fix_register(c: str) -> str:
    return _r(
        c,
        ("summary: '???????', life: 3000 })", "summary: '两次密码不一致', life: 3000 })"),
        ("summary: '????', life: 2500 })", "summary: '注册成功', life: 2500 })"),
        ("summary: '????'", "summary: '注册失败'"),
        ("<h1>???????</h1>", "<h1>注册智学云账号</h1>"),
        ("<p>??????????? localStorage</p>", "<p>演示注册，数据保存在 localStorage</p>"),
        ("label=\"??\"", "label=\"姓名\""),
        ("label=\"??\"", "label=\"邮箱\""),
        ("label=\"??\"", "label=\"密码\""),
        ("label=\"????\"", "label=\"确认密码\""),
        (">?????</WiButton>", ">提交注册</WiButton>"),
        ("?????", "已有账号？"),
        (">????</RouterLink>", ">去登录</RouterLink>"),
    )

def fix_dashboard(c: str) -> str:
    return _r(
        c,
        ("{ label: '????', value: dashboardStats.students", "{ label: '在校学生', value: dashboardStats.students"),
        ("{ label: '????', value: String(dashboardStats.teachers)", "{ label: '在职教师', value: String(dashboardStats.teachers)"),
        ("{ label: '????', value: String(dashboardStats.courses)", "{ label: '开设课程', value: String(dashboardStats.courses)"),
        ("{ label: '?????', value: `${dashboardStats.enrollmentRate}%`", "{ label: '选课完成率', value: `${dashboardStats.enrollmentRate}%`"),
        ("{ key: 'title', label: '??' }", "{ key: 'title', label: '标题' }"),
        ("{ key: 'applicant', label: '???', width: 96 }", "{ key: 'applicant', label: '申请人', width: 96 }"),
        ("{ key: 'status', label: '??', width: 96 }", "{ key: 'status', label: '状态', width: 96 }"),
        ("dashboard__title\">??? ? ????</h1>", "dashboard__title\">智学云 · 教务概览</h1>"),
        ("<WiCard title=\"?????? 6 ???\">", "<WiCard title=\"近 6 个月选课趋势\">"),
        ("aria-label=\"???????\"", "aria-label=\"选课趋势柱状图\""),
        ("<WiCard title=\"????\">", "<WiCard title=\"年级人数\">"),
        ("<WiCard title=\"????\">", "<WiCard title=\"待办审批\">"),
        (":value=\"value === 'pending' ? '???' : value === 'approved' ? '???' : '???'\"", ":value=\"value === 'pending' ? '待审批' : value === 'approved' ? '已通过' : '已驳回'\""),
        ("[{ key: 'name', label: '??' }, { key: 'enrolled', label: '??', width: 72 }]", "[{ key: 'name', label: '课程' }, { key: 'enrolled', label: '人数', width: 72 }]"),
        ("<WiCard title=\"????\">", "<WiCard title=\"热门课程\">"),
    )

FIXERS.update({
    "views/system/MessageCenterView.vue": fix_messages,
    "views/system/SchedulerView.vue": fix_scheduler,
    "views/system/DictionaryView.vue": fix_dictionary,
    "views/analytics/ReportsView.vue": fix_reports,
    "views/analytics/ErrorMonitorView.vue": fix_error_monitor,
    "views/extras/RecycleBinView.vue": fix_recycle,
    "views/auth/LoginView.vue": fix_login_view,
    "views/auth/RegisterView.vue": fix_register,
    "views/dashboard/DashboardView.vue": fix_dashboard,
})

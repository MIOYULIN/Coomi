# -*- coding: utf-8 -*-
"""发布 v1.4.8-test.3 到测试通道 updates.septemc.com/coomi/android_test（不动稳定通道）。"""
import hashlib
import json
import sys

import paramiko

SSH_CFG = r"F:\_WorkSpace\Projects\AILab\SSH-Agent\ssh-configs\ssh-8.148.146.68-2C2G-阿里云.txt"
APK_LOCAL = r"apps/coomi-app/app/build/outputs/apk/release/coomi-app_apt-android-7-release_arm64-v8a.apk"
NAME = "Coomi-Android-arm64-v1.4.8-test.3.apk"
BASE = "/www/wwwroot/updates.septemc.com/coomi/android_test"
SHA256 = "39DAFF0A45953ADD36DFF7FB0BA65D07C6A5F6F38F62FD1AD3B06270D66E342F"

NOTES_T3 = """v1.4.8-test.3 更新说明【测试】

本版合并社区 PR #23：Git 面板、数据/运维面板、Git AI 助手与全局动效。

Git 面板：工作区版本管理五标签页（改动/分支/历史/临时收纳/同步），diff 行级着色，提交/拉取/推送、Stash、PR 描述生成与 A/B 方案对比；不触碰用户暂存区的轮次存档点（git 对象快照）+ 定时快照调度，配合还原页可逐快照回滚。

Git AI 助手：提交信息生成、变更总结、代码审查、对抗性盲点审查、根因分析、冲突解决建议、README 生成与结构化修复建议（可应用补丁）；模型不可用时自动降级为启发式文本，不让 AI 失败阻塞面板。

Agent Git 工具：git_status / git_diff / git_branches / git_log / git_stage / git_commit / git_snapshot / git_restore / git_stash 九件套，写操作需用户审批，还原前自动打备份快照。

数据/运维面板：会话搜索与 Markdown 导出、按日用量统计、网络诊断、存储占用与 guest 工具检查。

角色剧场修复：工作室编辑器挂载时拉取提供商列表并补齐默认模型；旧数据成员未配置模型时回退到激活提供商，消除空 selector 报错。

全局动效：弹簧回弹曲线、标签滑块、按压反馈、消息入场与路由过渡；修复函数 ref 重渲染死循环。

合入时修正：剔除社区 PR 误替换的签名密钥（保持官方签名，确保可覆盖升级）；App 的 DeepSeek 账号登录不受影响（PR 仅移除 Git AI 内的 DeepSeek 专属通道）。

v1.4.8-test.2 更新说明【测试】

本版合并社区 PR #21（psi-v2 认知引擎升级），并包含 1.4.8-test.1 的引擎重启风暴修复。

数字生命体 psi-v2 认知引擎：内稳态需求驱动、Russell 环状情绪模型、多因子羁绊关系、情景记忆（TF-IDF 检索 + 艾宾浩斯遗忘曲线）、记挂事项议程、用户心情镜像、做梦与怀旧时间线；引擎重写为纯 Python 标准库实现，扩展安装不再需要设备联网 apt 安装依赖（移除 numpy/aiohttp）。

成长档案：人格徽章、羁绊进度、五维需求雷达、里程碑时间线，「数字生命体」页新增入口。

对话时光机：按月历回看历史会话，当天会话数高亮并标注当日情绪，可将某天会话一键改写成小说 / 剧本 / 漫画。

角色剧场：温柔、高冷等人格预设，可一键添加为 AI 工作室剧场演员。

连接健壮性：WebSocket 重试耗尽后进入停摆态、网络恢复自动复活；连接建立前发送的消息不再被静默丢弃。

引擎重启风暴修复（1.4.8-test.1 同源）：状态机补边、恢复不阻断启动、快速崩溃熔断与反馈节流，详见 v1.4.8-test.1 更新说明。

合入时修正：剔除社区 PR 误替换的签名密钥（保持官方签名，确保可覆盖升级）；修复 sidecar 在非 UTF-8 平台的输出编码缺陷（官方测试套件 68/68 通过）。语音朗读为预留能力，原生桥将在后续版本提供。

v1.4.8-test.1 更新说明【测试】

引擎反复重启修复（关键）：修复引擎重启恢复时，磁盘上遗留的「已入队未运行」任务会让引擎启动即崩溃的问题；该缺陷叠加自动拉起机制形成重启死循环，1.4.7 反馈中约 96% 的「引擎异常自动重启 / 启动失败」均源于此，本版彻底修复。

崩溃循环熔断：引擎若在启动后短时间内再次崩溃，连续 5 次后停止自动重启并提示手动重启，不再无限循环；重启计数仅在引擎稳定运行 90 秒后才清零。

反馈通道保护：同一原因的重启反馈 5 分钟内只记录一条，避免重启死循环场景下刷爆反馈队列（此前两台设备各产生数百条重复反馈）。

诊断信息修复：引擎版本号读取增加格式校验，引导脚本的异常输出不再污染诊断数据（此前约 39% 的反馈丢失引擎版本信息）。

运行时升级恢复收敛：引擎不再被重启循环打断后，内置运行时自动升级可正常完成。"""

MANIFEST = {
    "versionCode": 69,
    "version": "1.4.8-test.3",
    "file": NAME,
    "channel": "test",
    "platform": "android",
    "arch": "arm64-v8a",
    "minAndroid": "7.0",
    "date": "2026-09-13",
    "size": None,  # filled at runtime from APK stat
    "sha256": SHA256,
    "notes": NOTES_T3,
}

VERSIONS_PREPEND = {"version": "v1.4.8-test.3", "file": NAME}


def parse_ssh_config(path):
    ip = port = user = pwd = None
    for line in open(path, encoding="utf-8", errors="replace"):
        raw = line.strip().lstrip("-*· ").strip()
        if ":" not in raw and "：" not in raw:
            continue
        key, _, value = raw.partition("：" if "：" in raw else ":")
        key, value = key.strip(), value.strip()
        if not value:
            continue
        if "IP" in key and ip is None:
            ip = value
        elif "端口" in key and port is None:
            port = value
        elif "用户名" in key and user is None:
            user = value
        elif key == "密码" and pwd is None:
            pwd = value
    assert ip and pwd, "无法解析 SSH 配置"
    return {"host": ip, "port": int(port or 22), "user": user or "root", "password": pwd}


def main():
    import os
    cfg = parse_ssh_config(SSH_CFG)
    size = os.path.getsize(APK_LOCAL)
    digest = hashlib.sha256(open(APK_LOCAL, "rb").read()).hexdigest().upper()
    if digest != SHA256:
        sys.exit(f"SHA256 不匹配: {digest}")
    manifest = dict(MANIFEST, size=size)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(cfg["host"], port=cfg["port"], username=cfg["user"],
                   password=cfg["password"], timeout=30,
                   allow_agent=False, look_for_keys=False)
    sftp = client.open_sftp()

    def run(cmd):
        _, out, err = client.exec_command(cmd, timeout=120)
        o = out.read().decode("utf-8", "replace").strip()
        e = err.read().decode("utf-8", "replace").strip()
        if e and "warning" not in e.lower():
            print("ERR:", e[:200])
        return o

    print(run(f"mkdir -p {BASE}"))

    # 备份当前 latest.json / versions.json（仅测试通道）
    print(run(f"cp {BASE}/latest.json {BASE}/latest.json.bak-test3 2>/dev/null; "
              f"cp {BASE}/versions.json {BASE}/versions.json.bak-test3 2>/dev/null; echo backed-up"))

    # 上传 APK 与校验文件
    with open(APK_LOCAL, "rb") as f:
        sftp.putfo(f, f"{BASE}/{NAME}")
    print("uploaded APK")
    sftp.open(f"{BASE}/{NAME}.sha256", "w").write(digest + "\n")
    sftp.open(f"{BASE}/last.sha256", "w").write(digest)
    with sftp.open(f"{BASE}/latest.json", "w") as f:
        f.write(json.dumps(manifest, ensure_ascii=False, indent=2))
    print("latest.json written")

    # versions.json：把新版本插到最前（保留旧记录）
    old = {}
    try:
        with sftp.open(f"{BASE}/versions.json") as f:
            old = json.loads(f.read().decode("utf-8"))
    except FileNotFoundError:
        old = {}
    versions = [v for v in old.get("versions", []) if v.get("file") != NAME]
    old["versions"] = [VERSIONS_PREPEND] + versions
    old["channel"] = "android_test"
    with sftp.open(f"{BASE}/versions.json", "w") as f:
        f.write(json.dumps(old, ensure_ascii=False, indent=2))
    print("versions.json updated:", [v["version"] for v in old["versions"]][:5])

    run(f"chown -R www:www {BASE}")

    # 回读验证
    out = run(f"curl -s -o /dev/null -w '%{{http_code}}' http://127.0.0.1/coomi/android_test/{NAME} "
              f"-H 'Host: updates.septemc.com'")
    print("APK http status:", out)
    lj = run(f"curl -s http://127.0.0.1/coomi/android_test/latest.json -H 'Host: updates.septemc.com'")
    j = json.loads(lj)
    print("latest.json readback:", j["version"], j["versionCode"], j["channel"], len(j["notes"]))
    client.close()
    print("done")


if __name__ == "__main__":
    main()

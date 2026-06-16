import os
import re
from pathlib import Path
from typing import Any

import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env", encoding="utf-8-sig", override=True)

DOUBAO_API_KEY = (os.getenv("DOUBAO_API_KEY") or os.getenv("\ufeffDOUBAO_API_KEY") or "").strip()
DOUBAO_API_URL = os.getenv("DOUBAO_API_URL", "https://ark.cn-beijing.volces.com/api/v3/chat/completions").strip()
DOUBAO_MODEL = os.getenv("DOUBAO_MODEL", "doubao-seed-2-0-mini-260428").strip()


def cloud_error_message(error: Exception) -> str:
    message = str(error)
    if "401" in message or "Unauthorized" in message:
        return "豆包/火山方舟鉴权失败，请检查后端 .env 里的 DOUBAO_API_KEY 是否有效、是否开通模型权限。"
    if "403" in message or "Forbidden" in message:
        return "豆包/火山方舟权限不足，请检查 API Key 对应账号是否有该模型或 endpoint 的调用权限。"
    if "404" in message:
        return "豆包/火山方舟接口或模型不存在，请检查 DOUBAO_API_URL 和 DOUBAO_MODEL。"
    if "429" in message:
        return "豆包/火山方舟调用频率或额度受限，请稍后再试或检查额度。"
    return f"云端 AI 暂不可用：{message}"


def extract_text_from_response(data: dict[str, Any]) -> str:
    if isinstance(data.get("output_text"), str):
        return data["output_text"].strip()

    choices = data.get("choices")
    if isinstance(choices, list) and choices:
        message = choices[0].get("message", {})
        content = message.get("content")
        if isinstance(content, str):
            return content.strip()
        if isinstance(content, list):
            parts = [item.get("text", "") for item in content if isinstance(item, dict)]
            return "\n".join(part for part in parts if part).strip()

    output = data.get("output")
    if isinstance(output, list):
        parts: list[str] = []
        for item in output:
            if not isinstance(item, dict):
                continue
            content = item.get("content", [])
            if isinstance(content, list):
                for block in content:
                    if isinstance(block, dict):
                        parts.append(block.get("text") or block.get("content") or "")
            elif isinstance(content, str):
                parts.append(content)
        text = "\n".join(part for part in parts if part).strip()
        if text:
            return text

    raise RuntimeError("API 返回格式异常，未找到可用文本。")


def call_doubao_api(prompt: str) -> str:
    if not DOUBAO_API_KEY:
        raise RuntimeError("缺少 DOUBAO_API_KEY。")

    headers = {
        "Authorization": f"Bearer {DOUBAO_API_KEY}",
        "Content-Type": "application/json",
    }

    if DOUBAO_API_URL.endswith("/responses"):
        payload: dict[str, Any] = {
            "model": DOUBAO_MODEL,
            "input": prompt,
        }
    else:
        payload = {
            "model": DOUBAO_MODEL,
            "messages": [{"role": "user", "content": prompt}],
        }

    response = requests.post(DOUBAO_API_URL, headers=headers, json=payload, timeout=45)
    try:
        response.raise_for_status()
    except requests.HTTPError as exc:
        detail = response.text[:500]
        raise RuntimeError(f"{exc}; {detail}") from exc

    return extract_text_from_response(response.json())


def clean_result(result: str) -> str:
    patterns = [
        r"^优化后的内容：\s*",
        r"^优化内容：\s*",
        r"^优化结果：\s*",
        r"^个人简介：\s*",
        r"^简介：\s*",
        r"^\s*[-*]\s*",
        r"^\s*\d+\.\s*",
    ]

    cleaned = result.strip()
    for pattern in patterns:
        cleaned = re.sub(pattern, "", cleaned)
    return cleaned.strip()


def safe_cloud_result(prompt: str, fallback: str) -> str:
    try:
        return clean_result(call_doubao_api(prompt))
    except Exception as exc:
        return f"{fallback}\n\n提示：{cloud_error_message(exc)}当前已使用本地规则兜底结果。"


def keyword_hits(text: str, keywords: list[str]) -> list[str]:
    lowered = text.lower()
    return [keyword for keyword in keywords if keyword.lower() in lowered or keyword in text]


def fallback_analyze_jd(jd_text: str) -> str:
    skill_keywords = [
        "Vue",
        "React",
        "TypeScript",
        "JavaScript",
        "Node.js",
        "Python",
        "Java",
        "SQL",
        "算法",
        "数据结构",
        "机器学习",
        "沟通",
        "项目管理",
        "科研",
        "论文",
    ]
    skills = keyword_hits(jd_text, skill_keywords)
    first_line = jd_text.strip().splitlines()[0][:40] if jd_text.strip() else "未识别"
    return "\n".join(
        [
            f"【职位/目标名称】：{first_line}",
            "【公司/项目行业】：请结合 JD 中的公司背景进一步确认",
            f"【必备技能】：{('、'.join(skills[:8]) if skills else '请从 JD 中补充硬技能关键词')}",
            "【加分技能】：项目成果、可量化经验、跨团队协作、英文/文档能力",
            "【岗位职责】：围绕 JD 中高频动词提炼，例如开发、优化、分析、交付、协作",
            "【任职要求】：优先匹配学历/专业、核心技能、项目经验、工具栈和软技能",
        ]
    )


def fallback_match_resume(resume_text: str, jd_text: str) -> str:
    tokens = re.findall(r"[\u4e00-\u9fa5A-Za-z0-9+#.]{2,}", jd_text)
    stop_words = {"要求", "负责", "岗位", "经验", "能力", "相关", "以及", "进行", "熟悉", "具备"}
    keywords = []
    for token in tokens:
        if token in stop_words or token in keywords:
            continue
        keywords.append(token)

    matched = [keyword for keyword in keywords if keyword.lower() in resume_text.lower() or keyword in resume_text]
    missing = [keyword for keyword in keywords if keyword not in matched]
    score = 55 if not keywords else min(95, max(35, round(len(matched) / len(keywords) * 100)))

    return "\n".join(
        [
            f"【匹配分数】：{score}/100",
            f"【匹配关键词】：{('、'.join(matched[:12]) if matched else '暂未发现明显匹配关键词')}",
            f"【缺失关键词】：{('、'.join(missing[:12]) if missing else '暂无明显缺失关键词')}",
            "【改进建议】：把 JD 中反复出现的技能词写进技能区；在项目/实践中补充动作、工具、规模和结果；优先补齐缺失关键词对应的证明材料。",
        ]
    )


def fallback_career_path(resume_text: str) -> str:
    is_technical = bool(keyword_hits(resume_text, ["Vue", "React", "TypeScript", "Python", "算法", "数据", "工程"]))
    direction = "技术/产品研发方向" if is_technical else "专业能力深化方向"
    return "\n".join(
        [
            "【当前水平评估】：材料已有一定经历基础，下一步需要把经历中的能力证据写得更具体，尤其是工具、方法、难点和结果。",
            f"【短期目标（1-2年）】：围绕{direction}补齐核心技能栈，形成 2-3 个可复盘、可展示的代表项目。",
            "【中期目标（3-5年）】：沉淀可迁移能力，例如独立负责模块、跨团队协作、研究/业务问题拆解和成果表达。",
            "【推荐学习技能】：目标岗位关键词、数据分析/文档表达、英文阅读、项目复盘、面试表达。",
            "【发展路径建议】：先用目标岗位或目标院校要求倒推材料缺口，再按技能、项目、奖项、课程成绩逐项补证据。",
        ]
    )


def optimize_resume_section(content: str, section: str) -> str:
    prompt = f"""
请优化以下简历「{section}」内容，使其更专业、更有说服力。

原始内容：
{content}

要求：
1. 保持原意，不编造经历。
2. 突出动作、方法、结果和量化成果。
3. 语言适合直接放入简历。
4. 只返回优化后的文本。
"""
    return safe_cloud_result(prompt, content)


def analyze_jd(jd_text: str) -> str:
    prompt = f"""
请分析以下目标岗位/项目要求，提取关键信息。

目标描述：
{jd_text}

请按以下格式返回：
【职位/目标名称】：
【公司/项目行业】：
【必备技能】：
【加分技能】：
【岗位职责】：
【任职要求】：
"""
    return safe_cloud_result(prompt, fallback_analyze_jd(jd_text))


def match_resume(resume_text: str, jd_text: str) -> str:
    prompt = f"""
请对比以下简历和目标要求，进行匹配分析。

简历内容：
{resume_text}

目标要求：
{jd_text}

请按以下格式返回：
【匹配分数】：（0-100分）
【匹配关键词】：
【缺失关键词】：
【改进建议】：
"""
    return safe_cloud_result(prompt, fallback_match_resume(resume_text, jd_text))


def generate_career_path(resume_text: str) -> str:
    prompt = f"""
请根据以下简历内容，提供发展建议。

简历内容：
{resume_text}

请按以下格式返回：
【当前水平评估】：
【短期目标（1-2年）】：
【中期目标（3-5年）】：
【推荐学习技能】：
【发展路径建议】：
"""
    return safe_cloud_result(prompt, fallback_career_path(resume_text))


def generate_summary(resume_text: str) -> str:
    fallback = resume_text.strip().splitlines()[0][:80] if resume_text.strip() else "请先补充简历内容。"
    prompt = f"""
请根据以下简历内容，生成一段专业个人简介。

简历内容：
{resume_text}

要求：
1. 50-120 字。
2. 突出核心竞争力和目标方向。
3. 不编造信息。
4. 只返回简介内容。
"""
    return safe_cloud_result(prompt, fallback)

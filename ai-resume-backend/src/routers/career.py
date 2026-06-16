import json
from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from src.services.doubao_service import generate_career_path

router = APIRouter()


class CareerRequest(BaseModel):
    resume_text: str | None = None
    resume: dict[str, Any] | None = None


class CareerResponse(BaseModel):
    success: bool
    result: str


def resolve_resume_text(request: CareerRequest) -> str:
    if request.resume_text and request.resume_text.strip():
        return request.resume_text.strip()

    if request.resume:
        return json.dumps(request.resume, ensure_ascii=False, indent=2)

    return ""


@router.post("", response_model=CareerResponse)
@router.post("/", response_model=CareerResponse)
def get_career_advice(request: CareerRequest):
    resume_text = resolve_resume_text(request)
    if not resume_text:
        return {"success": False, "result": "请先填写简历内容后再生成发展建议。"}

    try:
        result = generate_career_path(resume_text)
        return {"success": True, "result": result}
    except Exception as e:
        return {"success": False, "result": str(e)}

from fastapi import APIRouter
from pydantic import BaseModel, Field

from src.services.doubao_service import analyze_jd, match_resume

router = APIRouter()


class JDAnalyzeRequest(BaseModel):
    jd_text: str = Field(..., min_length=1)


class JDAnalyzeResponse(BaseModel):
    success: bool
    result: str


class JDMatchRequest(BaseModel):
    resume_text: str = Field(..., min_length=1)
    jd_text: str = Field(..., min_length=1)


class JDMatchResponse(BaseModel):
    success: bool
    result: str


@router.post("/analyze", response_model=JDAnalyzeResponse)
def analyze_jd_endpoint(request: JDAnalyzeRequest):
    try:
        return {"success": True, "result": analyze_jd(request.jd_text)}
    except Exception as exc:
        return {"success": False, "result": str(exc)}


@router.post("/match", response_model=JDMatchResponse)
def match_resume_endpoint(request: JDMatchRequest):
    try:
        return {"success": True, "result": match_resume(request.resume_text, request.jd_text)}
    except Exception as exc:
        return {"success": False, "result": str(exc)}

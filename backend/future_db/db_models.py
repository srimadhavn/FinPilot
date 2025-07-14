"""
SQLAlchemy database models for FinPilot
"""

import uuid
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

# Create base class
Base = declarative_base()


class UserProfile(Base):
    """User investment profile model"""
    __tablename__ = "user_profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    monthly_investment = Column(String(50), nullable=False)
    preference = Column(String(100), nullable=False)
    risk_tolerance = Column(String(50), nullable=False)
    goal = Column(String(200), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship to chat sessions
    chat_sessions = relationship("ChatSession", back_populates="user")
    
    def __repr__(self):
        return f"<UserProfile(id={self.id}, investment={self.monthly_investment})>"


class ChatSession(Base):
    """Chat session model"""
    __tablename__ = "chat_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_profiles.id"), nullable=True)
    chat_history = Column(JSONB, nullable=False, default=list)
    current_answers = Column(JSONB, nullable=False, default=dict)
    is_complete = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship to user profile
    user = relationship("UserProfile", back_populates="chat_sessions")
    
    def __repr__(self):
        return f"<ChatSession(id={self.id}, complete={self.is_complete})>"


class APILog(Base):
    """API request logging model"""
    __tablename__ = "api_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    endpoint = Column(String(200), nullable=False)
    method = Column(String(10), nullable=False)
    status_code = Column(String(10))
    response_time_ms = Column(String(20))
    user_agent = Column(Text)
    ip_address = Column(String(45))
    request_data = Column(JSONB)
    response_data = Column(JSONB)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<APILog(id={self.id}, endpoint={self.endpoint})>"

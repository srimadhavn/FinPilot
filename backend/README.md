# FinPilot Backend

A FastAPI-based backend for the FinPilot AI investment advisor application.

## Features

- **Dynamic Chat System**: AI-powered question generation using LLaMA 3
- **Investment Profile Management**: Save and retrieve user investment profiles
- **CORS Support**: Configured for frontend integration
- **Type Safety**: Full Pydantic model validation
- **RESTful API**: Clean API design with proper status codes

## API Endpoints

### Health Check
- `GET /` - Health check endpoint

### Chat System
- `POST /api/next-question` - Generate next AI question based on chat history and answers

### Profile Management
- `POST /api/save-profile` - Save completed investment profile
- `GET /api/profiles/{profile_id}` - Retrieve profile by ID
- `GET /api/profiles` - List all profiles

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the development server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Data Models

### ChatMessage
```json
{
  "role": "ai" | "user",
  "message": "string"
}
```

### UserAnswers
```json
{
  "monthly_investment": "string",
  "preference": "string", 
  "risk_tolerance": "string",
  "goal": "string"
}
```

## LLaMA 3 Integration

The `ask_llama3()` function in `llama_service.py` is currently mocked. To integrate with actual LLaMA 3:

1. Replace the mock implementation with actual API calls
2. Add authentication/API keys as needed
3. Handle rate limiting and retries

## Environment Variables

Create a `.env` file for configuration:
```
LLAMA_API_KEY=your_api_key_here
LLAMA_API_URL=your_llama_endpoint
```

## Production Considerations

- Replace in-memory storage with a proper database (PostgreSQL, MongoDB)
- Add authentication and authorization
- Implement proper logging
- Add rate limiting
- Use environment-based configuration
- Add health checks and monitoring

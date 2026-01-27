---
name: API Docs Generator
version: 1.0.0
author: newth.ai
category: development
tags:
  - api
  - documentation
  - openapi
  - swagger
compatibility:
  - gemini
  - claude
---

# API Docs Generator

Generate comprehensive API documentation from code. Create OpenAPI/Swagger specs, markdown API reference guides, and SDK documentation for REST APIs across multiple programming languages.

## Triggers

Use this skill when the user wants to:
- Generate API documentation from code
- Create OpenAPI/Swagger specifications
- Document REST endpoints automatically
- Generate client SDK documentation
- Create API reference guides
- Maintain up-to-date API specs

Keywords: "api", "documentation", "openapi", "swagger", "rest", "endpoints", "api docs", "api reference", "sdk"

## Features

- **OpenAPI/Swagger Generation**: Automatically create OpenAPI 3.0 specs from code
- **Markdown Documentation**: Generate beautiful markdown API references
- **Multi-Language Support**: Works with TypeScript, Python, Go, and more
- **REST Endpoint Documentation**: Document HTTP methods, parameters, and responses
- **SDK Documentation**: Create client library documentation

## Usage Examples

### Generate OpenAPI spec from TypeScript

```typescript
// Example Express API with TypeScript
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'A simple user management API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.ts'], // Path to API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/api/users', async (req, res) => {
  // Handler logic
});

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
app.get('/api/users/:id', async (req, res) => {
  // Handler logic
});

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: User ID
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         name:
 *           type: string
 *           description: User full name
 */

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('API docs at http://localhost:3000/api-docs');
});
```

### Generate OpenAPI spec from Python FastAPI

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Optional

app = FastAPI(
    title="User API",
    description="A simple user management API",
    version="1.0.0",
    docs_url="/api-docs",
    redoc_url="/api-redoc"
)

class User(BaseModel):
    """User model"""
    id: str
    email: EmailStr
    name: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "123",
                "email": "user@example.com",
                "name": "John Doe"
            }
        }

class UserCreate(BaseModel):
    """User creation model"""
    email: EmailStr
    name: Optional[str] = None

@app.get(
    "/api/users",
    response_model=List[User],
    summary="Get all users",
    description="Retrieve a list of all users in the system",
    tags=["Users"]
)
async def get_users():
    """
    Get all users:
    - Returns a list of user objects
    - Each user contains id, email, and optional name
    """
    # Handler logic
    return []

@app.get(
    "/api/users/{user_id}",
    response_model=User,
    summary="Get user by ID",
    description="Retrieve a specific user by their ID",
    tags=["Users"],
    responses={
        200: {"description": "User found"},
        404: {"description": "User not found"}
    }
)
async def get_user(user_id: str):
    """
    Get a specific user:
    - **user_id**: The ID of the user to retrieve
    """
    # Handler logic
    raise HTTPException(status_code=404, detail="User not found")

@app.post(
    "/api/users",
    response_model=User,
    status_code=201,
    summary="Create a new user",
    description="Create a new user in the system",
    tags=["Users"]
)
async def create_user(user: UserCreate):
    """
    Create a new user with:
    - **email**: Valid email address (required)
    - **name**: User's full name (optional)
    """
    # Handler logic
    return User(id="new-id", email=user.email, name=user.name)

# FastAPI automatically generates:
# - OpenAPI 3.0 spec at /openapi.json
# - Swagger UI at /api-docs
# - ReDoc at /api-redoc
```

### Generate markdown documentation

```python
# generate_api_docs.py
import yaml
import json
from pathlib import Path

def generate_markdown_from_openapi(spec_file: str, output_file: str):
    """Generate markdown documentation from OpenAPI spec"""
    
    # Load OpenAPI spec
    with open(spec_file, 'r') as f:
        if spec_file.endswith('.yaml') or spec_file.endswith('.yml'):
            spec = yaml.safe_load(f)
        else:
            spec = json.load(f)
    
    markdown = []
    
    # Title and description
    markdown.append(f"# {spec['info']['title']}\n")
    markdown.append(f"{spec['info'].get('description', '')}\n")
    markdown.append(f"**Version:** {spec['info']['version']}\n")
    
    # Base URL
    if 'servers' in spec:
        markdown.append("\n## Base URL\n")
        for server in spec['servers']:
            markdown.append(f"- `{server['url']}` - {server.get('description', '')}")
    
    # Endpoints
    markdown.append("\n## Endpoints\n")
    
    for path, methods in spec['paths'].items():
        markdown.append(f"\n### `{path}`\n")
        
        for method, details in methods.items():
            if method in ['get', 'post', 'put', 'delete', 'patch']:
                markdown.append(f"\n#### {method.upper()}\n")
                markdown.append(f"{details.get('summary', '')}\n")
                
                if 'description' in details:
                    markdown.append(f"{details['description']}\n")
                
                # Parameters
                if 'parameters' in details:
                    markdown.append("\n**Parameters:**\n")
                    for param in details['parameters']:
                        required = "required" if param.get('required') else "optional"
                        markdown.append(
                            f"- `{param['name']}` ({param['in']}, {required}): "
                            f"{param.get('description', '')}"
                        )
                
                # Request body
                if 'requestBody' in details:
                    markdown.append("\n**Request Body:**\n")
                    content = details['requestBody'].get('content', {})
                    for content_type, schema_info in content.items():
                        markdown.append(f"Content-Type: `{content_type}`\n")
                
                # Responses
                if 'responses' in details:
                    markdown.append("\n**Responses:**\n")
                    for status, response in details['responses'].items():
                        markdown.append(
                            f"- `{status}`: {response.get('description', '')}"
                        )
    
    # Write to file
    with open(output_file, 'w') as f:
        f.write('\n'.join(markdown))
    
    print(f"Documentation generated: {output_file}")

# Usage
generate_markdown_from_openapi('openapi.yaml', 'API_REFERENCE.md')
```

### Go API with Swagger annotations

```go
package main

import (
    "github.com/gin-gonic/gin"
    "github.com/swaggo/files"
    "github.com/swaggo/gin-swagger"
    
    // Import generated docs
    _ "myapp/docs"
)

// User represents a user in the system
type User struct {
    ID    string `json:"id" example:"123"`
    Email string `json:"email" example:"user@example.com"`
    Name  string `json:"name" example:"John Doe"`
}

// @title User API
// @version 1.0
// @description A simple user management API
// @host localhost:8080
// @BasePath /api

// GetUsers godoc
// @Summary Get all users
// @Description Get a list of all users
// @Tags users
// @Accept json
// @Produce json
// @Success 200 {array} User
// @Router /users [get]
func GetUsers(c *gin.Context) {
    users := []User{}
    c.JSON(200, users)
}

// GetUser godoc
// @Summary Get user by ID
// @Description Get a specific user by their ID
// @Tags users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} User
// @Failure 404 {object} map[string]string
// @Router /users/{id} [get]
func GetUser(c *gin.Context) {
    id := c.Param("id")
    c.JSON(404, gin.H{"error": "User not found"})
}

// CreateUser godoc
// @Summary Create a new user
// @Description Create a new user in the system
// @Tags users
// @Accept json
// @Produce json
// @Param user body User true "User object"
// @Success 201 {object} User
// @Failure 400 {object} map[string]string
// @Router /users [post]
func CreateUser(c *gin.Context) {
    var user User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    c.JSON(201, user)
}

func main() {
    r := gin.Default()
    
    // API routes
    api := r.Group("/api")
    {
        api.GET("/users", GetUsers)
        api.GET("/users/:id", GetUser)
        api.POST("/users", CreateUser)
    }
    
    // Swagger documentation
    r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
    
    r.Run(":8080")
}

// Generate docs with: swag init
// Access Swagger UI at: http://localhost:8080/swagger/index.html
```

### Generate SDK documentation

```typescript
// sdk-generator.ts
import { OpenAPIV3 } from 'openapi-types';
import fs from 'fs';

function generateTypeScriptSDK(spec: OpenAPIV3.Document): string {
  const lines: string[] = [];
  
  // Generate types from schemas
  lines.push('// Auto-generated API client\n');
  lines.push('export interface APIClient {');
  
  for (const [path, pathItem] of Object.entries(spec.paths)) {
    if (!pathItem) continue;
    
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) continue;
      
      const op = operation as OpenAPIV3.OperationObject;
      const operationId = op.operationId || 
        `${method}${path.replace(/\//g, '_').replace(/{|}/g, '')}`;
      
      lines.push(`  /**`);
      lines.push(`   * ${op.summary || operationId}`);
      if (op.description) {
        lines.push(`   * ${op.description}`);
      }
      lines.push(`   */`);
      lines.push(`  ${operationId}: (params?: any) => Promise<any>;`);
    }
  }
  
  lines.push('}\n');
  
  // Generate client implementation
  lines.push('export function createClient(baseURL: string): APIClient {');
  lines.push('  return {');
  
  for (const [path, pathItem] of Object.entries(spec.paths)) {
    if (!pathItem) continue;
    
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) continue;
      
      const op = operation as OpenAPIV3.OperationObject;
      const operationId = op.operationId || 
        `${method}${path.replace(/\//g, '_').replace(/{|}/g, '')}`;
      
      lines.push(`    async ${operationId}(params?: any) {`);
      lines.push(`      const response = await fetch(\`\${baseURL}${path}\`, {`);
      lines.push(`        method: '${method.toUpperCase()}',`);
      lines.push(`        headers: { 'Content-Type': 'application/json' },`);
      if (method !== 'get') {
        lines.push(`        body: JSON.stringify(params),`);
      }
      lines.push(`      });`);
      lines.push(`      return response.json();`);
      lines.push(`    },`);
    }
  }
  
  lines.push('  };');
  lines.push('}');
  
  return lines.join('\n');
}

// Usage
const spec = JSON.parse(fs.readFileSync('openapi.json', 'utf-8'));
const sdk = generateTypeScriptSDK(spec);
fs.writeFileSync('sdk.ts', sdk);
console.log('SDK generated: sdk.ts');
```

## Dependencies

### TypeScript/Node.js
```bash
npm install swagger-jsdoc swagger-ui-express
npm install @types/swagger-jsdoc @types/swagger-ui-express --save-dev
```

### Python
```bash
pip install fastapi uvicorn pydantic
```

### Go
```bash
go get -u github.com/swaggo/swag/cmd/swag
go get -u github.com/swaggo/gin-swagger
go get -u github.com/swaggo/files
```

## Best Practices

1. **Use JSDoc/docstrings**: Document your code inline for automatic spec generation
2. **Version your API**: Always specify API version in the spec
3. **Provide examples**: Include request/response examples in your documentation
4. **Keep specs up-to-date**: Regenerate docs when endpoints change
5. **Validate schemas**: Use tools like Spectral to lint OpenAPI specs
6. **Security documentation**: Document authentication and authorization requirements
7. **Error responses**: Document all possible error codes and responses

## Tools & Resources

- **Swagger Editor**: https://editor.swagger.io - Edit and validate OpenAPI specs
- **Redoc**: https://github.com/Redocly/redoc - Beautiful API documentation
- **Spectral**: https://stoplight.io/open-source/spectral - OpenAPI linter
- **OpenAPI Generator**: https://openapi-generator.tech - Generate client SDKs
- **Postman**: Import OpenAPI specs for API testing

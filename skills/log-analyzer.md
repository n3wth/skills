---
name: Log Analyzer
version: 1.0.0
author: newth.ai
category: development
tags:
  - logs
  - debugging
  - analysis
  - monitoring
compatibility:
  - gemini
  - claude
---

# Log Analyzer

Parse and analyze log files to identify error patterns, extract metrics, reconstruct timelines, and detect anomalies. Essential for debugging production issues, performance analysis, and security investigations.

## Triggers

Use this skill when the user wants to:
- Parse log files in various formats
- Identify error patterns and anomalies
- Extract performance metrics from logs
- Reconstruct event timelines
- Debug production issues
- Analyze application behavior
- Investigate security incidents

Keywords: "logs", "log analysis", "parse logs", "error patterns", "log monitoring", "debugging", "anomaly detection", "log metrics"

## Features

- **Multi-Format Parsing**: Support for common log formats (Apache, nginx, JSON, syslog)
- **Regex Pattern Matching**: Extract specific data with custom patterns
- **Error Detection**: Identify and categorize error messages
- **Metric Extraction**: Pull performance data and statistics
- **Timeline Reconstruction**: Order events chronologically
- **Anomaly Detection**: Find unusual patterns and outliers
- **Filtering & Searching**: Query logs efficiently
- **Aggregation**: Group and count similar events

## Log Format Examples

### Apache/nginx Access Logs

```
127.0.0.1 - - [20/Jan/2026:10:15:32 +0000] "GET /api/users HTTP/1.1" 200 1234
192.168.1.1 - - [20/Jan/2026:10:15:33 +0000] "POST /api/login HTTP/1.1" 401 89
```

### JSON Logs

```json
{"timestamp": "2026-01-20T10:15:32Z", "level": "error", "message": "Database connection failed", "service": "api", "error": "ECONNREFUSED"}
{"timestamp": "2026-01-20T10:15:33Z", "level": "info", "message": "Request completed", "service": "api", "duration_ms": 234}
```

### Application Logs

```
2026-01-20 10:15:32 ERROR [api.database] Connection pool exhausted
2026-01-20 10:15:33 WARN [api.auth] Failed login attempt from 192.168.1.1
2026-01-20 10:15:34 INFO [api.users] User 12345 updated profile
```

## Use Cases

### 1. Debugging Production Issues

Quickly identify the root cause of production errors by:
- Filtering for error-level messages
- Finding stack traces and exception patterns
- Correlating errors with specific requests
- Identifying affected users or endpoints

**Example Task:**
```
Find all 500 errors in the last hour and group by endpoint
```

**Analysis Approach:**
```python
import re
from datetime import datetime, timedelta
from collections import Counter

def analyze_500_errors(log_file, hours=1):
    cutoff_time = datetime.now() - timedelta(hours=hours)
    endpoint_errors = Counter()
    
    with open(log_file) as f:
        for line in f:
            # Parse timestamp and status code
            match = re.search(r'\[(.*?)\].*?" (\d{3})', line)
            if match:
                timestamp_str, status = match.groups()
                timestamp = datetime.strptime(timestamp_str, '%d/%b/%Y:%H:%M:%S %z')
                
                if status == '500' and timestamp > cutoff_time:
                    # Extract endpoint
                    endpoint_match = re.search(r'"[A-Z]+ (.*?) HTTP', line)
                    if endpoint_match:
                        endpoint_errors[endpoint_match.group(1)] += 1
    
    return endpoint_errors
```

### 2. Performance Analysis

Extract performance metrics to understand application behavior:
- Response time distributions
- Slow query identification
- Resource usage patterns
- Throughput analysis

**Example Task:**
```
Calculate average response time per endpoint over the last day
```

**Analysis Approach:**
```python
import json
from collections import defaultdict

def analyze_performance(json_log_file):
    endpoint_times = defaultdict(list)
    
    with open(json_log_file) as f:
        for line in f:
            log = json.loads(line)
            if 'duration_ms' in log and 'endpoint' in log:
                endpoint_times[log['endpoint']].append(log['duration_ms'])
    
    # Calculate statistics
    results = {}
    for endpoint, times in endpoint_times.items():
        results[endpoint] = {
            'avg': sum(times) / len(times),
            'min': min(times),
            'max': max(times),
            'p95': sorted(times)[int(len(times) * 0.95)],
            'count': len(times)
        }
    
    return results
```

### 3. Security Incident Investigation

Investigate security events and suspicious activity:
- Failed authentication attempts
- Unusual access patterns
- Rate limit violations
- Suspicious IP addresses

**Example Task:**
```
Find IPs with more than 10 failed login attempts in 5 minutes
```

**Analysis Approach:**
```python
from datetime import datetime, timedelta
from collections import defaultdict

def detect_brute_force(log_file, threshold=10, window_minutes=5):
    failed_attempts = defaultdict(list)
    suspicious_ips = set()
    
    with open(log_file) as f:
        for line in f:
            if 'Failed login' in line or 'authentication failed' in line.lower():
                # Extract IP and timestamp
                ip_match = re.search(r'(\d+\.\d+\.\d+\.\d+)', line)
                time_match = re.search(r'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})', line)
                
                if ip_match and time_match:
                    ip = ip_match.group(1)
                    timestamp = datetime.strptime(time_match.group(1), '%Y-%m-%d %H:%M:%S')
                    failed_attempts[ip].append(timestamp)
                    
                    # Check if threshold exceeded in time window
                    recent = [t for t in failed_attempts[ip] 
                             if timestamp - t <= timedelta(minutes=window_minutes)]
                    if len(recent) >= threshold:
                        suspicious_ips.add(ip)
    
    return suspicious_ips
```

### 4. System Monitoring

Track system health and resource usage:
- Memory usage trends
- Error rate monitoring
- Service availability
- Dependency health

**Example Task:**
```
Detect service degradation by tracking error rate over time
```

**Analysis Approach:**
```python
from datetime import datetime, timedelta
from collections import defaultdict

def calculate_error_rates(log_file, interval_minutes=5):
    time_buckets = defaultdict(lambda: {'total': 0, 'errors': 0})
    
    with open(log_file) as f:
        for line in f:
            log = json.loads(line)
            timestamp = datetime.fromisoformat(log['timestamp'].replace('Z', '+00:00'))
            
            # Round to interval
            bucket = timestamp.replace(
                minute=(timestamp.minute // interval_minutes) * interval_minutes,
                second=0,
                microsecond=0
            )
            
            time_buckets[bucket]['total'] += 1
            if log.get('level') in ['error', 'ERROR']:
                time_buckets[bucket]['errors'] += 1
    
    # Calculate error rates
    results = {}
    for bucket, counts in sorted(time_buckets.items()):
        error_rate = (counts['errors'] / counts['total']) * 100
        results[bucket] = {
            'error_rate': error_rate,
            'total_requests': counts['total'],
            'errors': counts['errors']
        }
    
    return results
```

## Pattern Matching Techniques

### Common Regex Patterns

```python
# Timestamp patterns
ISO_8601 = r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?'
APACHE_TIMESTAMP = r'\d{2}/[A-Za-z]{3}/\d{4}:\d{2}:\d{2}:\d{2} [+-]\d{4}'
SYSLOG_TIMESTAMP = r'[A-Za-z]{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}'

# Network patterns
IPV4 = r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}'
IPV6 = r'(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}'
URL = r'https?://[^\s]+'

# Error patterns
STACK_TRACE = r'^\s+at\s+.*?\(.*?\)'
EXCEPTION = r'(?:Exception|Error):\s+(.+)'
ERROR_CODE = r'ERROR\s+\[?(\w+)\]?'
```

### Extracting Structured Data

```python
import re
from typing import Dict, Optional

def parse_apache_log(line: str) -> Optional[Dict]:
    """Parse Apache/nginx access log line."""
    pattern = r'(\S+) \S+ \S+ \[(.*?)\] "(.*?)" (\d{3}) (\d+)'
    match = re.search(pattern, line)
    
    if not match:
        return None
    
    ip, timestamp, request, status, size = match.groups()
    method, path, protocol = request.split() if len(request.split()) == 3 else (None, None, None)
    
    return {
        'ip': ip,
        'timestamp': timestamp,
        'method': method,
        'path': path,
        'protocol': protocol,
        'status': int(status),
        'size': int(size)
    }

def parse_json_log(line: str) -> Optional[Dict]:
    """Parse JSON-formatted log line."""
    try:
        return json.loads(line)
    except json.JSONDecodeError:
        return None

def parse_application_log(line: str) -> Optional[Dict]:
    """Parse typical application log format."""
    pattern = r'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) (\w+) \[(.*?)\] (.*)'
    match = re.search(pattern, line)
    
    if not match:
        return None
    
    timestamp, level, component, message = match.groups()
    
    return {
        'timestamp': timestamp,
        'level': level,
        'component': component,
        'message': message
    }
```

## Anomaly Detection

### Statistical Approaches

```python
import numpy as np
from scipy import stats

def detect_outliers_zscore(values, threshold=3):
    """Detect outliers using Z-score method."""
    z_scores = np.abs(stats.zscore(values))
    return np.where(z_scores > threshold)[0]

def detect_outliers_iqr(values):
    """Detect outliers using Interquartile Range."""
    q1 = np.percentile(values, 25)
    q3 = np.percentile(values, 75)
    iqr = q3 - q1
    lower_bound = q1 - (1.5 * iqr)
    upper_bound = q3 + (1.5 * iqr)
    return [i for i, v in enumerate(values) if v < lower_bound or v > upper_bound]

def moving_average_anomaly(values, window=10, threshold=2):
    """Detect anomalies using moving average."""
    moving_avg = np.convolve(values, np.ones(window)/window, mode='valid')
    moving_std = np.array([np.std(values[max(0, i-window):i+1]) 
                           for i in range(len(values))])
    
    anomalies = []
    for i in range(window, len(values)):
        if abs(values[i] - moving_avg[i-window]) > threshold * moving_std[i]:
            anomalies.append(i)
    
    return anomalies
```

## Timeline Reconstruction

### Correlating Events Across Services

```python
from datetime import datetime
from typing import List, Dict
import heapq

def merge_log_streams(log_files: List[str]) -> List[Dict]:
    """Merge multiple log streams by timestamp."""
    streams = []
    
    # Open all files and parse first line
    for log_file in log_files:
        f = open(log_file)
        line = f.readline()
        if line:
            log_entry = parse_json_log(line)
            if log_entry:
                timestamp = datetime.fromisoformat(log_entry['timestamp'].replace('Z', '+00:00'))
                heapq.heappush(streams, (timestamp, log_entry, f))
    
    # Merge using heap
    merged = []
    while streams:
        timestamp, entry, f = heapq.heappop(streams)
        merged.append(entry)
        
        # Read next line from same file
        line = f.readline()
        if line:
            log_entry = parse_json_log(line)
            if log_entry:
                timestamp = datetime.fromisoformat(log_entry['timestamp'].replace('Z', '+00:00'))
                heapq.heappush(streams, (timestamp, log_entry, f))
        else:
            f.close()
    
    return merged

def trace_request(merged_logs: List[Dict], request_id: str) -> List[Dict]:
    """Extract all log entries for a specific request."""
    return [log for log in merged_logs if log.get('request_id') == request_id]
```

## Command-Line Tools

### Using grep and awk

```bash
# Find all errors in the last hour
find /var/log -name "*.log" -mmin -60 -exec grep -i "error" {} \;

# Count errors by type
grep -i "error" app.log | awk '{print $4}' | sort | uniq -c | sort -rn

# Extract response times
awk '{print $NF}' access.log | awk '{sum+=$1; count++} END {print "Average:", sum/count}'

# Filter by time range
awk '$1 >= "2026-01-20" && $1 <= "2026-01-21"' app.log

# Top 10 IPs by request count
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10
```

### Using Python for Complex Analysis

```python
#!/usr/bin/env python3
"""
Log analyzer CLI tool
Usage: python log_analyzer.py --file app.log --action errors --hours 1
"""

import argparse
import json
from datetime import datetime, timedelta
from collections import Counter

def main():
    parser = argparse.ArgumentParser(description='Analyze log files')
    parser.add_argument('--file', required=True, help='Log file path')
    parser.add_argument('--action', choices=['errors', 'performance', 'timeline'], 
                       required=True)
    parser.add_argument('--hours', type=int, default=24, help='Time window in hours')
    parser.add_argument('--format', choices=['json', 'apache', 'app'], default='json')
    
    args = parser.parse_args()
    
    if args.action == 'errors':
        analyze_errors(args.file, args.hours, args.format)
    elif args.action == 'performance':
        analyze_performance(args.file, args.hours, args.format)
    elif args.action == 'timeline':
        show_timeline(args.file, args.hours, args.format)

if __name__ == '__main__':
    main()
```

## Best Practices

1. **Use Structured Logging**: JSON logs are easier to parse and analyze
2. **Include Context**: Add request IDs, user IDs, and trace IDs for correlation
3. **Standardize Timestamps**: Use ISO 8601 format with timezone
4. **Set Appropriate Log Levels**: DEBUG, INFO, WARN, ERROR, FATAL
5. **Avoid PII**: Don't log sensitive user data
6. **Implement Log Rotation**: Prevent disk space issues
7. **Centralize Logs**: Use log aggregation tools (ELK, Splunk, DataDog)
8. **Add Metrics**: Include duration, counts, and performance data

## Sample Log Analysis Workflow

1. **Identify the Problem**: What are you investigating?
2. **Gather Logs**: Collect relevant log files from all services
3. **Filter by Time**: Focus on the relevant time window
4. **Extract Patterns**: Use regex to pull out key information
5. **Aggregate Data**: Group similar events and count occurrences
6. **Visualize Trends**: Create timelines or charts
7. **Correlate Events**: Link related log entries across services
8. **Form Hypothesis**: Based on patterns, determine root cause
9. **Validate**: Check if the hypothesis explains all observations
10. **Document Findings**: Record insights for future reference

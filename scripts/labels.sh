#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Creating labels for Gründungszuschuss project...${NC}"

# Document type labels
gh label create "docs:personal" -c "7057ff" -d "Personal documentation and credentials"
gh label create "docs:business" -c "ff7070" -d "Business planning documents"
gh label create "docs:financial" -c "70ff9f" -d "Financial documentation"
gh label create "docs:legal" -c "70d7ff" -d "Legal and administrative documents"
gh label create "docs:assessment" -c "ffd670" -d "Expert assessment documents"

# Status labels (if needed)
gh label create "status:todo" -c "d4c5f9" -d "Task hasn't been started"
gh label create "status:in-progress" -c "fbca04" -d "Task is being worked on"
gh label create "status:done" -c "0e8a16" -d "Task has been completed"

# Priority labels
gh label create "priority:high" -c "b60205" -d "High priority task"
gh label create "priority:medium" -c "fbca04" -d "Medium priority task"
gh label create "priority:low" -c "0e8a16" -d "Low priority task"

echo -e "${GREEN}All labels created successfully!${NC}"

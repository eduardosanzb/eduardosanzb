#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Creating issues for Gründungszuschuss application project...${NC}"

# Document Collection Tasks
echo -e "${GREEN}Creating Document Collection tasks...${NC}"
gh issue create \
  -t "Update CV with cloud and DevOps focus" \
  -b "Update CV to highlight relevant experience in:
- Cloud architecture and implementations
- DevOps practices and tools
- Technical consulting projects
- Team leadership and mentoring
- Cost optimization achievements" \
  -m "Document Collection" \
  -l "docs:personal" \
  -p Freelance \
  -a @me

gh issue create \
  -t "Gather technical certifications" \
  -b "Collect and organize certifications:
- Cloud certifications (AWS, Azure, GCP)
- DevOps certifications
- Programming language certifications
- Ensure all are current and valid" \
  -m "Document Collection" \
  -l "docs:personal" \
  -p Freelance \
  -a @me

gh issue create \
  -t "Compile project portfolio" \
  -b "Create portfolio highlighting:
- Cloud migration projects
- Infrastructure optimization results
- Cost savings achievements
- Team leadership experience
- Technical architecture designs
Include metrics and results where possible" \
  -m "Document Collection" \
  -l "docs:personal" \
  -p Freelance \
  -a @me

# Business Plan Development Tasks
echo -e "${GREEN}Creating Business Plan Development tasks...${NC}"
gh issue create \
  -t "Create executive summary" \
  -b "Write executive summary including:
- Business mission and vision
- Key services offered
- Target market
- Competitive advantage
- Financial projections summary
- Background and qualifications" \
  -m "Business Plan Development" \
  -l "docs:business" \
  -p Freelance \
  -a @me

gh issue create \
  -t "Define service packages" \
  -b "Create detailed service packages for:
1. Technical Assessment & Strategy
   - Architecture review
   - DevOps maturity assessment
   - Cloud optimization audit

2. Implementation Services
   - Cloud migration
   - DevOps implementation
   - Performance optimization

3. Ongoing Support
   - Technical advisory
   - Architecture guidance
   - Crisis support

Include for each:
- Detailed scope
- Deliverables
- Timeline
- Pricing structure" \
  -m "Business Plan Development" \
  -l "docs:business" \
  -p Freelance \
  -a @me

gh issue create \
  -t "Develop pricing strategy" \
  -b "Create pricing strategy for services:
1. Hourly Rates
   - Base rate structure
   - Experience multipliers
   - Industry standards

2. Package Pricing
   - Assessment packages
   - Implementation packages
   - Support packages

3. Value-based Components
   - ROI calculations
   - Value multipliers
   - Client size adjustments" \
  -m "Business Plan Development" \
  -l "docs:business" \
  -p Freelance \
  -a @me

gh issue create \
  -t "Market analysis" \
  -b "Research German Freelance tech consulting market:
1. Market Size & Growth
   - Current market size
   - Growth projections
   - Key trends

2. Target Market
   - Industry segments
   - Company sizes
   - Geographic focus

3. Competition Analysis
   - Direct competitors
   - Indirect competitors
   - Market positioning" \
  -m "Business Plan Development" \
  -l "docs:business" \
  -p Freelance \
  -a @me

# Expert Assessment Tasks
echo -e "${GREEN}Creating Expert Assessment tasks...${NC}"
gh issue create \
  -t "Schedule IHK appointment" \
  -b "Preparation for IHK appointment:
1. Required Documents
   - Business plan
   - Financial projections
   - Market analysis
   - Qualifications proof

2. Schedule Steps
   - Contact IHK
   - Submit initial documents
   - Schedule review meeting
   - Prepare presentation" \
  -m "Expert Assessment" \
  -l "docs:assessment" \
  -p Freelance \
  -a @me

gh issue create \
  -t "Prepare financial viability documentation" \
  -b "Create comprehensive financial documentation:
1. Profitability Analysis
   - Break-even analysis
   - Profit margins by service
   - Growth projections

2. Market Opportunity
   - Market size calculations
   - Target client segments
   - Revenue potential

3. Risk Assessment
   - Market risks
   - Financial risks
   - Mitigation strategies" \
  -m "Expert Assessment" \
  -l "docs:assessment" \
  -p Freelance \
  -a @me

# Administrative Setup Tasks
echo -e "${GREEN}Creating Administrative Setup tasks...${NC}"
gh issue create \
  -t "Register business" \
  -b "Complete business registration process:
1. Gewerbeanmeldung
   - Form preparation
   - Required documents
   - Registration fee

2. Trade license requirements
3. Business address registration
4. Business name registration" \
  -m "Administrative Setup" \
  -l "docs:legal" \
  -p Freelance \
  -a @me

gh issue create \
  -t "Setup business banking" \
  -b "Business banking setup:
1. Research banks
   - Compare business accounts
   - Fee structures
   - Online banking features

2. Required documents
3. Initial deposit
4. Banking authorizations" \
  -m "Administrative Setup" \
  -l "docs:legal" \
  -p Freelance \
  -a @me

gh issue create \
  -t "Arrange insurance" \
  -b "Obtain necessary business insurance:
1. Professional Liability Insurance
   - Coverage requirements
   - Cost comparison

2. Business Liability Insurance
3. Health Insurance
4. Disability Insurance" \
  -m "Administrative Setup" \
  -l "docs:legal" \
  -p Freelance \
  -a @me

gh issue create \
  -t "Tax registration" \
  -b "Complete tax registration process:
1. Finanzamt Registration
   - Tax number application
   - VAT registration

2. Tax advisor consultation
3. Accounting system setup
4. Tax payment schedule" \
  -m "Administrative Setup" \
  -l "docs:legal" \
  -p Freelance \
  -a @me

echo -e "${BLUE}All issues have been created successfully!${NC}"

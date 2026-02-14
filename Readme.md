ACADLINK – Scholarship Finder

ACADLINK? is a simple web-based scholarship finder that helps students search and filter available scholarships based on keywords and academic strands. The project is built using HTML, CSS, and JavaScript with no backend required.

PROJECT STRUCTURE

AcadLinks/
│
├── about.html
├── contact.html
├── index.html
├── tools.html
├── core/
│   ├── start.bat
│   └── assets/
│       ├── css/
│       │   ├── all.min.css
│       │   ├── style.css
│       │   └── tools.css
│       ├── js/
│       │   ├── script.js
│       │   └── tools.js
│       ├── fonts/        → (fonts stored here)
│       ├── images/       → (images & logos stored here)
│       └── webfonts/     → (icon files stored here)
└── README.md

FEATURES (Bullets Word)
- Dynamic scholarship search
- Filter by academic strand (STEM, ABM, HUMSS, TVL, etc.)
- Location Filtering
- Animated rotating website title
- Loading animation while searching
- Responsive scholarship cards
- Direct links to official scholarship websites
- (Open And Closed) Status & Deadline

UI ENHANCEMENTS
- Font Awesome icons for better visuals
- Badges for location and strand
- Smooth transitions and hover effects
- Loader animation improves user experience

TECHNOLOGIES USED
- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Font Awesome
- Laptop / Computer
DEPLOYMENT USED (Online)
- Vercel 
- GitHub

PURPOSE OF THE PROJECT
This project aims to:
- Help students easily find scholarships
- Provide a clean and simple user interface
- Centralize scholarship information from different organizations and institutions
- Reduce the time and effort students spend searching for scholarship opportunities
- Serve as a helpful guide for senior high school and college students

🌱 FUTURE IMPROVEMENTS
- Connect to a real scholarship API (No official “scholarship API” in the Philippines exists)
- Save favorite scholarships
- User accounts and login system
- Admin dashboard to manage scholarships   =>    (Currently, the system only provides external links to scholarship websites. 
                                                 In the future, an admin dashboard will be added to manage scholarship listings, while students will be able to apply directly through a centralized fill-up form, making the application process easier and more efficient.)

WHAT THE SYSTEM CAN DO (CURRENT FEATURES)
1. Search Scholarships
Students can search scholarships using keywords (e.g., STEM, IT , ORG).
The system checks scholarship titles and descriptions and shows matching results instantly.
2. Filter by Academic Strand
Users can filter scholarships by strand such as: [STEM ABM HUMSS TVL GAS]
This helps students quickly find scholarships relevant to their academic background.
3. Centralized Scholarship Listings
All available scholarships are collected and displayed in one platform, instead of students searching multiple websites separately.
4. Scholarship Cards Display
Each scholarship is shown in a card with: [TITLE, DESCRIPTION, LOCATION, APPLICABLE STRAND, OFFICIAL APPLICATION LINK]
This makes the information easy to read and compare.
5. Direct Application Links
Students can click Apply to visit the official scholarship website for accurate and updated application details.
6. Loading Animation
A loader appears while search results are being processed, improving user experience and feedback.
7. Clean and User-Friendly Interface
The system uses: [ICONS FOR CLARITY, SIMPLE LAYOUT,  RESPONSIVE DESIGN]
This ensures the website is easy to use even for first-time users.
8. Tools & AI Integration Setup
The system’s Tools section launches the ACADLINKS Intelligence utility, which currently allows users to search, compare, and get recommendations for scholarships based on keywords, strand, and location. It also serves as a foundation for future AI-powered features, making scholarship selection faster and more personalized.
9. Open/Closed Status and Deadline Date
The system clearly shows whether each scholarship is OPEN or CLOSED and displays the application deadline.
This helps students quickly identify which scholarships are still available and plan their applications accordingly, avoiding expired or unavailable opportunities.


About? TOOLS PAGE – ACADLINKS INTELLIGENCE
The Tools section provides access to additional utilities that extend the system beyond scholarship searching.
When the Tools button is clicked, it launches an ACADLINKS Intelligence tool, which is designed to prepare and connect the system to real AI services. 
- DeepSeek
- OpenAI
- Ollama / xAI
- Grok
- Ollama / Local
PURPOSE OF THE TOOL
This tool demonstrates how ACADLINK can be expanded to include AI-powered features, such as intelligent search, recommendations, or future chatbot assistance. It serves as a foundation for integrating real AI APIs into the system.

Note! 
( (The start.bat file serves as a launcher and instruction guide for using AI-related tools.) Step By Step View In VsCode)

Start Server Local Llama
ollama run llama3
Configuration
{$env:OLLAMA_ORIGINS="*" }
{ollama serve }
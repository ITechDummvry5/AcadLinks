/*
  Technical Report (Explained Simply):

  This code powers a website that helps students find scholarships easily. 
  - Shows a changing title at the top to keep the page lively.
  - Allows students to search scholarships by keyword, location, or course.
  - Displays results in cards with image, description, location, course, and apply link.
  - Exact course matches appear first, making search more relevant.
  - Loader animation shows while results are loading.
  - Reset button reloads the page to start a new search.
*/

// ====================== HEADER TITLE ROTATION ======================

// Titles to display at the top
const titles = ["ACADLINK", "ScholarshipFinder"];

// Get header element
const header = document.getElementById("header-title");

// Starting index and delay
let index = 0;
const delay = 4000; // 4 seconds

// Function to rotate the header title
function rotateTitle() {
  // Fade out header
  header.style.opacity = 0;

  // Wait before changing text
  setTimeout(() => {
    // Move to next title
    index = (index + 1) % titles.length;

    // Update text
    header.textContent = titles[index];

    // Fade back in
    header.style.opacity = 1;
  }, 700); // fade duration
}

// Start rotation loop
setInterval(rotateTitle, delay);


// ====================== SCHOLARSHIP DATA ======================

// List of all scholarships with details
const scholarships = [
  {
    title: "DOST Scholarship",
    description: "STEM scholarship for science and tech students pursuing senior high or college.",
    location: "Laguna",
    course: "STEM",
    link: "https://sei.dost.gov.ph",
    image: "core/assets/images/DOST.png"
  },
  {
    title: "CHED Scholarship",
    description: "Government-funded scholarship supporting students across all strands.",
    location: "Pampanga",
    course: "ALL STRAND",
    link: "https://ched.gov.ph",
    image: "core/assets/images/CHED.png"
  },
  {
    title: "Megaworld Foundation Scholarship",
    description: "Supports graduating senior high students with financial aid for college.",
    location: "Metro Manila",
    course: "ABM",
    link: "https://www.megaworldfoundation.com",
    image: "core/assets/images/MEGA.png"
  },
  {
    title: "OWWA Scholarship",
    description: "Assistance for dependents of OFWs to pursue senior high or college programs.",
    location: "Cebu",
    course: "TVL",
    link: "https://owwa.gov.ph",
    image: "core/assets/images/OWWA.png"
  },
  {
    title: "DepEd SHS Voucher Program",
    description: "Financial aid for incoming senior high school students across strands.",
    location: "Cagayan",
    course: "ALL STRAND",
    link: "https://www.deped.gov.ph",
    image: "core/assets/images/DEPED.png"
  },
  {
    title: "Tertiary Education Subsidy (TES)",
    description: "Government support for college students from low-income families.",
    location: "Iloilo",
    course: "ALL STRAND",
    link: "https://unifast.gov.ph",
    image: "core/assets/images/UNI.png"
  },
  {
    title: "DSWD Educational Assistance",
    description: "Provides financial aid for students in need to continue their studies.",
    location: "Albay",
    course: "ALL STRAND",
    link: "https://www.dswd.gov.ph",
    image: "core/assets/images/DSWD.png"
  },
  {
    title: "AFP Educational Benefit System",
    description: "Scholarship program for dependents of AFP personnel in the Philippines.",
    location: "Davao del Sur",
    course: "ALL STRAND",
    link: "https://www.afp.mil.ph",
    image: "core/assets/images/AFP.png"
  },
  {
    title: "PNP Educational Assistance Program",
    description: "Support for children of PNP members to pursue senior high or college education.",
    location: "Misamis Oriental",
    course: "ALL STRAND",
    link: "https://www.pnp.gov.ph",
    image: "core/assets/images/PNP.png"
  },
  {
    title: "CHED Merit Scholarship",
    description: "Merit-based scholarship for top-performing students across all strands.",
    location: "Ilocos Norte",
    course: "ALL STRAND",
    link: "https://ched.gov.ph",
    image: "core/assets/images/CHED.png"
  },
  {
    title: "DILG Scholarship Program",
    description: "For students interested in public service careers, especially HUMSS strand.",
    location: "Leyte",
    course: "HUMSS",
    link: "https://www.dilg.gov.ph",
    image: "core/assets/images/DILG.png"
  },
  {
    title: "DOST-SEI JL Science Scholarship",
    description: "Science-focused scholarship supporting senior high students in STEM.",
    location: "Zamboanga del Sur",
    course: "STEM",
    link: "https://sei.dost.gov.ph",
    image: "core/assets/images/DOST.png"
  },
  {
    title: "BFAR Scholarship",
    description: "For students pursuing fisheries, aquatic sciences, and marine studies.",
    location: "Palawan",
    course: "STEM",
    link: "https://www.bfar.da.gov.ph",
    image: "core/assets/images/BFAR.png"
  },
  {
    title: "TESDA Scholarship Program",
    description: "Technical-vocational training for students and out-of-school youth.",
    location: "South Cotabato",
    course: "TVL",
    link: "https://www.tesda.gov.ph",
    image: "core/assets/images/TESDA.png"
  },
  {
    title: "SM Foundation Scholarship",
    description: "Financial assistance for college students with academic merit and need.",
    location: "Metro Manila",
    course: "ABM",
    link: "https://www.sm-foundation.org",
    image: "core/assets/images/SM.png"
  },
  {
    title: "Philippine National Oil Company (PNOC) Scholarship",
    description: "Provides financial assistance to students pursuing STEM or Engineering courses.",
    location: "Quezon",
    course: "STEM",
    link: "https://www.pnoc.com.ph",
    image: "core/assets/images/PNOC.png"
},
{
    title: "Philippine Red Cross Scholarship",
    description: "Support for students taking Health Science and related courses.",
    location: "Manila",
    course: "STEM",
    link: "https://www.redcross.org.ph",
    image: "core/assets/images/RED.png"
},
{
    title: "San Miguel Foundation Scholarship",
    description: "Scholarship for senior high and college students in Business and ABM strand.",
    location: "Cebu",
    course: "ABM",
    link: "https://www.sanmiguelfoundation.org",
    image: "core/assets/images/SAN.png"
}
];

// ====================== SEARCH FUNCTION ======================

function searchScholarships() {
  const loader = document.getElementById("loader");      // Loading animation
  const resultsDiv = document.getElementById("results"); // Where results appear

  // Show loader
  loader.classList.add("active");

  // Delay to simulate loading
  setTimeout(() => {
    // Get user inputs
    const keyword = document.getElementById("search").value.toLowerCase().trim();
    const selectedLocation = document.getElementById("location").value.toLowerCase().trim();
    const selectedCourse = document.getElementById("course").value;

    // Clear previous results
    resultsDiv.innerHTML = "";

    // Filter scholarships
    const filtered = scholarships
      .filter(item => {
        const matchKeyword =
          keyword === "" ||
          item.title.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword);

        const matchLocation =
          selectedLocation === "" ||
          item.location.toLowerCase().includes(selectedLocation);

        const matchCourse =
          selectedCourse === "" ||
          item.course === selectedCourse ||
          item.course === "ALL STRAND";

        // Only include scholarships that match all criteria
        return matchKeyword && matchCourse && matchLocation;
      })
      // Sort exact course matches first
      .sort((a, b) => {
        if (selectedCourse === "") return 0;
        const aMatch = a.course === selectedCourse ? 1 : 0;
        const bMatch = b.course === selectedCourse ? 1 : 0;
        return bMatch - aMatch;
      });

    // Show message if no results
    if (filtered.length === 0) {
      resultsDiv.innerHTML = `<h1 class="no-results">NO SCHOLARSHIPS FOUND</h1>`;
    } else {
      // Create and display cards for each scholarship
      filtered.forEach(item => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <img src="${item.image}" alt="${item.title}" class="card-image">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="badges">
            <span class="badge"><i class="fa-solid fa-location-dot"></i> ${item.location}</span>
            <span class="badge"><i class="fa-solid fa-graduation-cap"></i> ${item.course}</span>
          </div>
          <a href="${item.link}" target="_blank">Apply</a>
        `;
        resultsDiv.appendChild(div);
      });
    }

    // Hide loader
    loader.classList.remove("active");
  }, 2100); // Delay before showing results
}


// ====================== RESET FUNCTION ======================

function resetSearch() {
  location.reload(); // Reload page to start fresh
}

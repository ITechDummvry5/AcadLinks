const titles = ["ACADLINK", "ScholarshipFinder"];
const header = document.getElementById("header-title");
let index = 0;
let delay = 4000; // 2 seconds per title

function rotateTitle() {
  // Fade out
  header.style.opacity = 0;

  setTimeout(() => {
    // Change text
    index = (index + 1) % titles.length;
    header.textContent = titles[index];

    // Fade in
    header.style.opacity = 1;
  }, 700); // fade duration
}

// Loop every 2 seconds + fade
setInterval(rotateTitle, delay);


const scholarships = [
  {
    title: "DOST Scholarship",
    description: "STEM scholarship for science and tech students pursuing senior high or college.",
    location: "Philippines",
    course: "STEM",
    link: "https://sei.dost.gov.ph",
    image: "core/assets/images/DOST.png"
  },
  {
    title: "CHED Scholarship",
    description: "Government-funded scholarship supporting students across all strands.",
    location: "Philippines",
    course: "ALL STRAND",
    link: "https://ched.gov.ph",
    image: "core/assets/images/CHED.png"
  },
  {
    title: "Megaworld Foundation Scholarship",
    description: "Supports graduating senior high students with financial aid for college.",
    location: "Philippines",
    course: "ABM",
    link: "https://www.megaworldfoundation.com",
    image: "core/assets/images/MEGA.png"
  },
  {
    title: "OWWA Scholarship",
    description: "Assistance for dependents of OFWs to pursue senior high or college programs.",
    location: "Philippines",
    course: "TVL",
    link: "https://owwa.gov.ph",
    image: "core/assets/images/OWWA.png"
  },
  {
    title: "DepEd SHS Voucher Program",
    description: "Financial aid for incoming senior high school students across strands.",
    location: "Philippines",
    course: "ALL STRAND",
    link: "https://www.deped.gov.ph",
    image: "core/assets/images/DEPED.png"
  },
  {
    title: "Tertiary Education Subsidy (TES)",
    description: "Government support for college students from low-income families.",
    location: "Philippines",
    course: "ALL STRAND",
    link: "https://unifast.gov.ph",
    image: "core/assets/images/UNI.png"
  },
  {
    title: "DSWD Educational Assistance",
    description: "Provides financial aid for students in need to continue their studies.",
    location: "Philippines",
    course: "ALL STRAND",
    link: "https://www.dswd.gov.ph",
    image: "core/assets/images/DSWD.png"
  },
  {
    title: "AFP Educational Benefit System",
    description: "Scholarship program for dependents of AFP personnel in the Philippines.",
    location: "Philippines",
    course: "ALL STRAND",
    link: "https://www.afp.mil.ph",
    image: "core/assets/images/AFP.png"
  },
  {
    title: "PNP Educational Assistance Program",
    description: "Support for children of PNP members to pursue senior high or college education.",
    location: "Philippines",
    course: "ALL STRAND",
    link: "https://www.pnp.gov.ph",
    image: "core/assets/images/PNP.png"
  },
  {
    title: "CHED Merit Scholarship",
    description: "Merit-based scholarship for top-performing students across all strands.",
    location: "Philippines",
    course: "ALL STRAND",
    link: "https://ched.gov.ph",
    image: "core/assets/images/CHED.png"
  },
  {
    title: "DILG Scholarship Program",
    description: "For students interested in public service careers, especially HUMSS strand.",
    location: "Philippines",
    course: "HUMSS",
    link: "https://www.dilg.gov.ph",
    image: "core/assets/images/DILG.png"
  },
  {
    title: "DOST-SEI JL Science Scholarship",
    description: "Science-focused scholarship supporting senior high students in STEM.",
    location: "Philippines",
    course: "STEM",
    link: "https://sei.dost.gov.ph",
    image: "core/assets/images/DOST.png"
  },
  {
    title: "BFAR Scholarship",
    description: "For students pursuing fisheries, aquatic sciences, and marine studies.",
    location: "Philippines",
    course: "STEM",
    link: "https://www.bfar.da.gov.ph",
    image: "core/assets/images/BFAR.png"
  },
  {
    title: "TESDA Scholarship Program",
    description: "Technical-vocational training for students and out-of-school youth.",
    location: "Philippines",
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
];

function searchScholarships() {
  const loader = document.getElementById("loader");
  const resultsDiv = document.getElementById("results");

  // Show loader
  loader.classList.add("active");

  setTimeout(() => {
    const keyword = document.getElementById("search").value.toLowerCase().trim();
    const selectedCourse = document.getElementById("course").value;

    resultsDiv.innerHTML = ""; // clear previous results

    const filtered = scholarships.filter(item => {
      const matchKeyword =
        keyword === "" ||
        item.title.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword);

      const matchCourse =
        selectedCourse === "" ||
        item.course === selectedCourse ||
        item.course === "ALL STRAND";

      return matchKeyword && matchCourse;
    });

    if (filtered.length === 0) {
      resultsDiv.innerHTML = `<h1 class="no-results">NO SCHOLARSHIPS FOUND</h1>`;
    } else {
      filtered.forEach(item => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <img src="${item.image}" alt="${item.title}" class="card-image">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="badges">
            <span class="badge"><i class="fa-solid fa-location-dot"></i>  ${item.location}</span>
            <span class="badge"><i class="fa-solid fa-graduation-cap"></i> ${item.course}</span>
          </div>
          <a href="${item.link}" target="_blank">Apply</a>
        `;
        resultsDiv.appendChild(div);
      });
    }

    loader.classList.remove("active");
  }, 800);
}
function resetSearch() {
  location.reload();  // Reloads the current page
}




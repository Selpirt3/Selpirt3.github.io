const canvas = document.querySelector(".starfield");
const ctx = canvas?.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let stars = [];
let dust = [];
let animationFrame;
let currentLanguage = getSavedLanguage();

const translations = {
  en: {
    navResearch: "Research",
    navPublications: "Publications",
    navAchievements: "Achievements",
    navExperience: "Experience",
    navPresentations: "Presentations",
    navContact: "Contact",

    heroEyebrow: "Space Science · Astrophysics",
    heroLede:
      "Ph.D. candidate at Peking University in China and visiting student at the Leibniz Institute for Astrophysics Potsdam (AIP) in Germany, studying solar-stellar magnetic eruptions, and space weather environments around exoplanets.",
    email: "Email",

    rolePhd: "Ph.D. Candidate, Peking University",
    rolePhdMeta: "Space Physics<br>Sep 2022 -- Now",
    roleAip: "Visiting Student, AIP",
    roleAipMeta: "Stellar Physics and Exoplanets<br>Nov 2024 -- Now",

    metricFirstAuthor: "first-author papers",
    metricPublications: "publications",
    metricTalks: "conference talks",
    metricFunding: "funding",

    researchEyebrow: "Research",
    researchTitle: "Connecting solar eruptions to exoplanetary space weather",
    researchCard1Title: "Mechanism of Solar Eruptions",
    researchCard1Text:
      "Solar eruptions, including flares and coronal mass ejections (CMEs), are the primary drivers of space weather. We investigate their properties and underlying mechanisms.",
    researchCard2Title: "Solar-Stellar Connection",
    researchCard2Text:
      "Using the Sun as a benchmark, we explore how CMEs occur on other stars, how their properties vary across different stellar types, and how they can be identified through observations.",
    researchCard3Title: "Exoplanetary Space Weather",
    researchCard3Text:
      "Through numerical simulations, we investigate how stellar CMEs shape exoplanetary space-weather environments and assess their impact on the habitability.",

    publicationsEyebrow: "Publications",
    publicationsTitle: "Selected works",
    pubSelected1: "Current Helicity in Response to Coronal Mass Ejections",
    pubSelected2:
      "Magnetic Helicity Evolution during Active Region Emergence and Subsequent Flare Productivity",
    pubSelected3:
      "Cross-loop Propagation of a Quasiperiodic Extreme-Ultraviolet Wave Train",
    firstAuthorPublications: "First-author publications",
    coauthoredPublications: "Co-authored publications",

    achievementsEyebrow: "Achievements",
    achievementsTitle: "Funding and honors",
    fundingLabel: "Funding",
    fundingTitle: "NSFC Basic Research Scheme for PhD Students",
    fundingRole: "Principal Investigator (PI)",
    fundingMeta: "2025–2027 | ¥300,000 (~US$42,000)",
    fundingDesc:
      "Awarded by the National Natural Science Foundation of China (NSFC) to support the project “Numerical Simulations of Stellar Coronal Mass Ejections”.",

    award1: "National Scholarship<br>¥30,000 (~US$4,200)",
    award2: "National Scholarship<br>¥30,000 (~US$4,200)",
    award3: "Ubiquant Scholarship<br>¥10,000 (~US$1,400)",
    award4: "Greenview Scholarship<br>¥5,000 (~US$700)",
    award5: "Silvercorp Scholarship<br>¥12,000 (~US$1,700)",
    award6: "China National Petroleum Corporation Scholarship<br>¥6,000 (~US$850)",

    experienceEyebrow: "Experience",
    experienceTitle: "Observations",
    experience1Title: "Solar Flare Observations with Vacuum Tower Telescope (VTT)",
    experience1Text: "Observer · Teide Observatory, Tenerife, Spain",
    experience2Title: "Stellar Spectropolarimetric Observations with HARPSpol",
    experience2Text: "Observer · La Silla Observatory, Chile",

    talksEyebrow: "Presentations",
    talksTitle: "Recent conference talks",
    talk1Title: "Space Weather around M dwarfs: Role of Coronal Mass Ejections",
    talk1Text: "EAS 2026 · Lausanne, Switzerland",
    talk2Title: "Current Helicity Reversal during Coronal Mass Ejections",
    talk2Text: "EGU General Assembly · Vienna, Austria",
    talk3Title:
      "Space Weather around Moderately-rotating Fully Convective M dwarfs",
    talk3Text: "IAU Symposium 400 · Medellin, Colombia",
    contributedTalks: "Contributed talks",
    posters: "Posters",

    contactEyebrow: "Contact",
    contactTitle:
      "Open to collaborations on solar-stellar eruptions and exoplanetary space weather.",
    seeMore: "See more >>",
    showLess: "Show less",
  },

  zh: {
    navResearch: "研究",
    navPublications: "论文",
    navAchievements: "成就",
    navExperience: "经历",
    navPresentations: "报告",
    navContact: "联系",

    heroEyebrow: "空间物理学 · 天体物理学",
    heroLede:
      "北京大学空间物理学博士研究生，现为德国莱布尼茨天体物理研究所（AIP）访问学生。研究方向包括太阳与恒星爆发，以及系外行星周围的空间天气环境。",
    email: "邮件",

    rolePhd: "博士研究生，北京大学",
    rolePhdMeta: "空间物理学<br>2022 年 9 月至今",
    roleAip: "访问学生，AIP",
    roleAipMeta: "恒星物理与系外行星<br>2024 年 11 月至今",

    metricFirstAuthor: "第一作者论文",
    metricPublications: "发表论文",
    metricTalks: "会议报告",
    metricFunding: "科研资助",

    researchEyebrow: "研究",
    researchTitle: "从太阳爆发到系外空间天气",
    researchCard1Title: "太阳爆发的机制与性质",
    researchCard1Text:
      "太阳爆发包括耀斑和日冕物质抛射（CME），是驱动空间天气的关键过程。我们研究这些爆发的物理性质及其背后的物理机制。",
    researchCard2Title: "太阳-恒星联系",
    researchCard2Text:
      "以太阳为基准，我们探索其他恒星上的 CME 可能如何发生、其性质如何随恒星类型变化，以及如何通过观测探测这些爆发现象。",
    researchCard3Title: "系外空间天气",
    researchCard3Text:
      "通过数值模拟，我们研究恒星 CME 如何塑造系外行星周围的空间天气环境，并评估其对系外行星宜居性的影响。",

    publicationsEyebrow: "论文",
    publicationsTitle: "代表性工作",
    pubSelected1: "日冕物质抛射过程中的电流螺度响应",
    pubSelected2: "活动区浮现及后续耀斑产出过程中的磁螺度演化",
    pubSelected3: "准周期极紫外波列的跨环传播",
    firstAuthorPublications: "第一作者论文",
    coauthoredPublications: "合作论文",

    achievementsEyebrow: "成就",
    achievementsTitle: "科研资助与荣誉",
    fundingLabel: "科研资助",
    fundingTitle: "国自然青年学生基础研究项目（博士研究生）",
    fundingRole: "项目负责人（PI）",
    fundingMeta: "2025–2027 | 30 万元人民币（约 4.2 万美元）",
    fundingDesc:
      "由国家自然科学基金委员会（NSFC）资助，研究课题为“恒星星冕物质抛射的数值模拟”。",

    award1: "国家奖学金<br>3万元",
    award2: "国家奖学金<br>3万元",
    award3: "九坤奖学金<br>1万元",
    award4: "劳雷奖学金<br>5000元",
    award5: "希尔威矿业奖学金<br>1.2万元",
    award6: "中国石油奖学金<br>6000元",

    experienceEyebrow: "经历",
    experienceTitle: "观测经历",
    experience1Title: "使用真空塔太阳望远镜（VTT）开展太阳耀斑观测",
    experience1Text: "观测员 · 西班牙特内里费岛泰德天文台",
    experience2Title: "使用 HARPSpol 开展恒星光谱偏振观测",
    experience2Text: "观测员 · 智利拉西亚天文台",

    talksEyebrow: "报告",
    talksTitle: "近期会议报告",
    talk1Title: "M 矮星周围的空间天气：日冕物质抛射的作用",
    talk1Text: "EAS 2026 · 瑞士洛桑",
    talk2Title: "日冕物质抛射过程中的电流螺度反转",
    talk2Text: "EGU General Assembly · 奥地利维也纳",
    talk3Title: "中等自转全对流 M 矮星周围的空间天气",
    talk3Text: "IAU Symposium 400 · 哥伦比亚麦德林",
    contributedTalks: "会议报告",
    posters: "墙报展示",

    contactEyebrow: "联系",
    contactTitle: "欢迎就太阳-恒星爆发和系外空间天气开展合作。",
    seeMore: "查看更多 >>",
    showLess: "收起",
  },
};

const staticTextTranslations = {
  zh: [
    ["The Astrophysical Journal Letters", "天体物理学报快报"],
    ["The Astrophysical Journal", "天体物理学报"],
    ["Astronomy & Astrophysics", "天文学与天体物理学"],
    ["A&A", "天文学与天体物理学"],

    ["January", "一月"],
    ["February", "二月"],
    ["March", "三月"],
    ["April", "四月"],
    ["May", "五月"],
    ["June", "六月"],
    ["July", "七月"],
    ["August", "八月"],
    ["September", "九月"],
    ["October", "十月"],
    ["November", "十一月"],
    ["December", "十二月"],

    ["Jan.", "一月"],
    ["Feb.", "二月"],
    ["Mar.", "三月"],
    ["Apr.", "四月"],
    ["Jun.", "六月"],
    ["Jul.", "七月"],
    ["Aug.", "八月"],
    ["Sep.", "九月"],
    ["Oct.", "十月"],
    ["Nov.", "十一月"],
    ["Dec.", "十二月"],
  ],
  en: [
    ["天体物理学报快报", "The Astrophysical Journal Letters"],
    ["天体物理学报", "The Astrophysical Journal"],
    ["天文学与天体物理学", "Astronomy & Astrophysics"],

    ["一月", "Jan."],
    ["二月", "Feb."],
    ["三月", "Mar."],
    ["四月", "Apr."],
    ["五月", "May"],
    ["六月", "Jun."],
    ["七月", "Jul."],
    ["八月", "Aug."],
    ["九月", "Sep."],
    ["十月", "Oct."],
    ["十一月", "Nov."],
    ["十二月", "Dec."],
  ],
};

function textFor(key) {
  return translations[currentLanguage][key] || translations.en[key] || "";
}

function getSavedLanguage() {
  try {
    return localStorage.getItem("siteLanguage") === "zh" ? "zh" : "en";
  } catch {
    return "en";
  }
}

function updateToggleButton(button) {
  const isExpanded = button.getAttribute("aria-expanded") === "true";
  button.textContent = textFor(isExpanded ? "showLess" : "seeMore");
}

function updateName(language) {
  const displayName = language === "zh" ? "孙争" : "Zheng Sun";

  const heroTitle = document.querySelector("#hero-title");
  if (heroTitle) heroTitle.textContent = displayName;

  const brandName = document.querySelector(".brand span:last-child");
  if (brandName) brandName.textContent = displayName;

  const portrait = document.querySelector(".portrait-frame img");
  if (portrait) {
    portrait.alt =
      language === "zh" ? "孙争的照片" : "Portrait of Zheng Sun";
  }

  const brand = document.querySelector(".brand");
  if (brand) {
    brand.setAttribute(
      "aria-label",
      language === "zh" ? "孙争主页" : "Zheng Sun home"
    );
  }
}

function applyStaticTextTranslations(language) {
  const replacements = staticTextTranslations[language] || [];

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    let text = node.nodeValue;
    replacements.forEach(([from, to]) => {
      text = text.split(from).join(to);
    });
    node.nodeValue = text;
  });
}

function applyLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";

  try {
    localStorage.setItem("siteLanguage", language);
  } catch {
    // Ignore storage failures.
  }

  updateName(language);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    if (element.matches("[data-toggle]")) {
      updateToggleButton(element);
      return;
    }

    const value = textFor(element.dataset.i18n);
    if (value.includes("<")) {
      element.innerHTML = value;
    } else {
      element.textContent = value;
    }
  });

  applyStaticTextTranslations(language);

  const languageToggle = document.querySelector("[data-language-toggle]");
  if (languageToggle) {
    languageToggle.textContent = language === "zh" ? "EN" : "中文";
    languageToggle.setAttribute(
      "aria-label",
      language === "zh" ? "Switch to English" : "切换到中文"
    );
  }
}

function resizeStarfield() {
  if (!canvas || !ctx) return;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const { innerWidth: width, innerHeight: height } = window;

  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const starCount = Math.floor(
    Math.min(360, Math.max(150, (width * height) / 5600))
  );
  const dustCount = Math.floor(
    Math.min(62, Math.max(24, (width * height) / 30000))
  );

  stars = Array.from({ length: starCount }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.25 + 0.28,
    alpha: Math.random() * 0.46 + 0.18,
    twinkle: Math.random() * Math.PI * 2,
    drift: (Math.random() * 0.05 + 0.012) * (index % 2 ? 1 : -1),
    glow: Math.random() > 0.78,
    tint:
      Math.random() > 0.78
        ? "warm"
        : Math.random() > 0.58
          ? "cool"
          : "white",
  }));

  dust = Array.from({ length: dustCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2.2 + 0.8,
    alpha: Math.random() * 0.075 + 0.028,
    speed: Math.random() * 0.045 + 0.012,
  }));
}

function drawStarfield(time = 0) {
  if (!canvas || !ctx) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.clearRect(0, 0, width, height);

  for (const particle of dust) {
    if (!reduceMotion) {
      particle.x += particle.speed;
      particle.y -= particle.speed * 0.22;
      if (particle.x > width + 8) particle.x = -8;
      if (particle.y < -8) particle.y = height + 8;
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(154, 174, 202, ${particle.alpha})`;
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const star of stars) {
    if (!reduceMotion) {
      star.x += star.drift;
      if (star.x < -2) star.x = width + 2;
      if (star.x > width + 2) star.x = -2;
    }

    const pulse = reduceMotion
      ? 0
      : Math.sin(time * 0.0012 + star.twinkle) * 0.08;
    const alpha = Math.max(0.04, star.alpha + pulse);
    const color =
      star.tint === "warm"
        ? `rgba(231, 202, 139, ${alpha})`
        : star.tint === "cool"
          ? `rgba(130, 205, 218, ${alpha})`
          : `rgba(235, 239, 244, ${alpha})`;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();

    if (star.glow) {
      ctx.beginPath();
      ctx.fillStyle = color.replace(
        `${alpha})`,
        `${Math.min(alpha * 0.22, 0.12)})`
      );
      ctx.arc(star.x, star.y, star.radius * 3.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (!reduceMotion) {
    animationFrame = window.requestAnimationFrame(drawStarfield);
  }
}

if (canvas && ctx) {
  resizeStarfield();
  drawStarfield();

  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(animationFrame);
    resizeStarfield();
    drawStarfield();
  });
}

const revealTargets = document.querySelectorAll(
  ".metrics, .research-card, .achievement-card, .award-card, .publication-list li, .timeline article, .talk-grid article, .expand-panel"
);

revealTargets.forEach((target) => target.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
);

revealTargets.forEach((target) => observer.observe(target));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelector("[data-language-toggle]")?.addEventListener("click", () => {
  applyLanguage(currentLanguage === "en" ? "zh" : "en");
});

document.querySelectorAll("[data-toggle]").forEach((button) => {
  const target = document.getElementById(button.dataset.toggle);
  if (!target) return;

  button.addEventListener("click", () => {
    const willOpen = target.hidden;
    target.hidden = !willOpen;
    button.setAttribute("aria-expanded", String(willOpen));
    updateToggleButton(button);

    if (willOpen) {
      target.classList.add("is-visible");
      target
        .querySelectorAll(".reveal")
        .forEach((item) => item.classList.add("is-visible"));
    }
  });
});

applyLanguage(currentLanguage);
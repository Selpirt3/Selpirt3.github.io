const canvas = document.querySelector(".starfield");
const ctx = canvas?.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let stars = [];
let dust = [];
let animationFrame;
let currentLanguage = "en";
let activeResearchPanel = null;
let lastResearchTrigger = null;

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
      "Through observations and simulations, we investigate how stellar CMEs shape exoplanetary space-weather environments and assess their impact on the habitability of exoplanets.",
    researchDetailsCta: "Open details",
    closeResearchModal: "Close research details",

    publicationsEyebrow: "Publications",
    publicationsTitle: "Selected works",
    pubSelected1:
      "How Magnetic Field Strength Affects Stellar Coronal Mass Ejection Dynamics",
    pubSelected2: "Current Helicity in Response to Coronal Mass Ejections",
    pubSelected3:
      "Cross-loop Propagation of a Quasiperiodic Extreme-Ultraviolet Wave Train Triggered by Successive Stretching of Magnetic Field Structures during a Solar Eruption",
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
    talk1Text: "IAU Symposium 408 · Liege, Belgium",
    talk2Title: "Space Weather around M dwarfs: Role of Coronal Mass Ejections",
    talk2Text: "46th COSPAR Scientific Assembly · Florence, Italy",
    talk3Title: "Space Weather around M dwarfs: Role of Coronal Mass Ejections",
    talk3Text:
      "European Astronomical Society Annual Meeting 2026 · Lausanne, Switzerland",
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
      "北京大学空间物理学博士研究生，现为德国莱布尼茨天体物理研究所（AIP）访问学生。研究方向包括太阳与恒星爆发，以及系外行星的空间天气环境。",
    email: "邮件",

    rolePhd: "博士研究生，北京大学",
    rolePhdMeta: "空间物理学<br>2022 年 9 月至今",
    roleAip: "访问学生，AIP",
    roleAipMeta: "恒星物理与系外行星<br>2024 年 11 月至今",

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
      "通过数值模拟，我们研究恒星 CME 如何塑造系外行星的空间天气环境，并评估其对系外行星宜居性的影响。",
    researchDetailsCta: "查看详情",
    closeResearchModal: "关闭研究详情",

    publicationsEyebrow: "论文",
    publicationsTitle: "代表性工作",
    pubSelected1:
      "How Magnetic Field Strength Affects Stellar Coronal Mass Ejection Dynamics",
    pubSelected2: "Current Helicity in Response to Coronal Mass Ejections",
    pubSelected3:
      "Cross-loop Propagation of a Quasiperiodic Extreme-Ultraviolet Wave Train Triggered by Successive Stretching of Magnetic Field Structures during a Solar Eruption",
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
    talk1Text: "IAU Symposium 408 · 比利时列日",
    talk2Title: "M 矮星周围的空间天气：日冕物质抛射的作用",
    talk2Text: "第 46 届 COSPAR Scientific Assembly · 意大利佛罗伦萨",
    talk3Title: "M 矮星周围的空间天气：日冕物质抛射的作用",
    talk3Text: "European Astronomical Society Annual Meeting 2026 · 瑞士洛桑",
    contributedTalks: "会议报告",
    posters: "墙报展示",

    contactEyebrow: "联系",
    contactTitle: "欢迎就太阳-恒星爆发和系外空间天气开展合作。",
    seeMore: "查看更多 >>",
    showLess: "收起",
  },
};

const researchModalContent = {
  en: [
    {
      index: "01",
      title: "Mechanism of Solar Eruptions",
      summary:
        "Solar eruptions, including flares and coronal mass ejections (CMEs), are the primary drivers of space weather. We investigate their properties and underlying mechanisms.",
      works: [
        {
          label: "Work I",
          title: "Fine-Scale Downflows Above Flare Ribbons",
          description:
            "Using high-resolution Solar Orbiter/EUI observations, we detected fine-scale EUV downflows above flare ribbons (~100 km s⁻¹), which we interpret as the ~10⁶ K counterparts of chromospheric “riblets.” This discovery extends flare-ribbon fine structures to coronal temperatures and provides a new observational diagnostic for probing flare energy transport mechanisms.",
          image: "pub/1.1.gif",
          imageAlt: "Fine-scale EUV downflows above flare ribbons observed by Solar Orbiter/EUI",
          url: "https://www.aanda.org/articles/aa/full_html/2026/07/aa59875-26/aa59875-26.html",
        },
        {
          label: "Work II",
          title: "Current Helicity Reversal During CMEs",
          description:
            "Using MHD simulations and observations of 50 eruptive flares, we identified a characteristic reversal in photospheric current helicity associated with CMEs: a decrease before eruption followed by an increase afterward, observed in 58% and 92% of the events, respectively. We attribute this reversal to the redistribution of electric currents during eruption, suggesting that current helicity can trace the buildup and release of magnetic energy and may provide a potential diagnostic for CME prediction.",
          image: "pub/1.2.png",
          imageAlt: "Current helicity reversal associated with coronal mass ejections",
          url: "https://iopscience.iop.org/article/10.3847/1538-4357/adf18b/meta",
        },
        {
          label: "Work III",
          title: "Observational Evidence for the Hybrid EUV-Wave Model",
          description:
            "Using SDO/AIA observations, we detected a quasiperiodic EUV wave train propagating across coronal loops at ~300 km s⁻¹. For the first time, we found observational evidence that the successive stretching of coronal magnetic field lines can generate a train of fast-mode MHD waves, providing strong observational support for the hybrid EUV-wave model.",
          image: "pub/1.3.gif",
          imageAlt: "Quasiperiodic EUV wave train propagating across coronal loops",
          url: "https://iopscience.iop.org/article/10.3847/2041-8213/ac9aff/meta",
        },
      ],
    },
    {
      index: "02",
      title: "Solar-Stellar Connection",
      summary:
        "Using the Sun as a benchmark, we explore how CMEs occur on other stars, how their properties vary across different stellar types, and how they can be identified through observations.",
      works: [
        {
          label: "Work I",
          title: "The Dual Role of Magnetic Fields in CMEs",
          description:
            "Using 3D MHD simulations, we systematically explored a broad parameter space to investigate the competing promoting and suppressing effects of magnetic fields on stellar CMEs. Our results highlight the active-region magnetic field strength as a key factor governing this competition and CME speeds, emphasizing the importance of future measurements of stellar active-region magnetic fields for constraining stellar CME dynamics.",
          image: "pub/2.1.png?v=20260905-1538",
          imageAlt: "3D MHD simulations of magnetic-field effects on stellar CMEs",
          url: "https://iopscience.iop.org/article/10.3847/1538-4357/ae884c",
        },
      ],
    },
    {
      index: "03",
      title: "Exoplanetary Space Weather",
      summary:
        "Through observations and simulations, we investigate how stellar CMEs shape exoplanetary space-weather environments and assess their impact on the habitability of exoplanets.",
      works: [
        {
          label: "Work I",
          title: "Searching for Stellar CMEs with High-Resolution Spectroscopy",
          description:
            "Using six years of archival VLT/ESPRESSO observations, we conducted a systematic high-resolution spectroscopic search for stellar CME signatures among 327 late-type main-sequence stars. On the young solar-type star DS Tuc A, we detected Doppler-shifted Hα signatures potentially associated with prominence eruption, demonstrating the power of high-resolution spectroscopy for probing stellar eruptive phenomena.",
          image: "pub/3.1.png",
          imageAlt: "High-resolution spectroscopic search for stellar CME signatures",
        },
        {
          label: "Work II",
          title: "Magnetic Topology Shapes Exoplanetary Space Weather",
          description:
            "Using 3D MHD simulations, we show that the large-scale magnetic topology of M dwarfs can strongly regulate CME impacts on exoplanets. In a single-hemisphere magnetic configuration, CMEs preferentially originate from high latitudes and propagate away from the equatorial plane, potentially creating a relatively benign CME environment for equatorial exoplanets.",
          image: "pub/3.2.gif",
          imageAlt: "3D MHD simulation showing how magnetic topology shapes exoplanetary space weather",
        },
      ],
    },
  ],
  zh: [
    {
      index: "01",
      title: "太阳爆发的机制与性质",
      summary:
        "太阳爆发包括耀斑和日冕物质抛射（CME），是驱动空间天气的关键过程。我们研究这些爆发的物理性质及其背后的物理机制。",
      works: [
        {
          label: "Work I",
          title: "Fine-Scale Downflows Above Flare Ribbons",
          description:
            "Using high-resolution Solar Orbiter/EUI observations, we detected fine-scale EUV downflows above flare ribbons (~100 km s⁻¹), which we interpret as the ~10⁶ K counterparts of chromospheric “riblets.” This discovery extends flare-ribbon fine structures to coronal temperatures and provides a new observational diagnostic for probing flare energy transport mechanisms.",
          image: "pub/1.1.gif",
          imageAlt: "Fine-scale EUV downflows above flare ribbons observed by Solar Orbiter/EUI",
          url: "https://www.aanda.org/articles/aa/full_html/2026/07/aa59875-26/aa59875-26.html",
        },
        {
          label: "Work II",
          title: "Current Helicity Reversal During CMEs",
          description:
            "Using MHD simulations and observations of 50 eruptive flares, we identified a characteristic reversal in photospheric current helicity associated with CMEs: a decrease before eruption followed by an increase afterward, observed in 58% and 92% of the events, respectively. We attribute this reversal to the redistribution of electric currents during eruption, suggesting that current helicity can trace the buildup and release of magnetic energy and may provide a potential diagnostic for CME prediction.",
          image: "pub/1.2.png",
          imageAlt: "Current helicity reversal associated with coronal mass ejections",
          url: "https://iopscience.iop.org/article/10.3847/1538-4357/adf18b/meta",
        },
        {
          label: "Work III",
          title: "Observational Evidence for the Hybrid EUV-Wave Model",
          description:
            "Using SDO/AIA observations, we detected a quasiperiodic EUV wave train propagating across coronal loops at ~300 km s⁻¹. For the first time, we found observational evidence that the successive stretching of coronal magnetic field lines can generate a train of fast-mode MHD waves, providing strong observational support for the hybrid EUV-wave model.",
          image: "pub/1.3.gif",
          imageAlt: "Quasiperiodic EUV wave train propagating across coronal loops",
          url: "https://iopscience.iop.org/article/10.3847/2041-8213/ac9aff/meta",
        },
      ],
    },
    {
      index: "02",
      title: "太阳-恒星联系",
      summary:
        "这里可以说明你如何把太阳爆发物理推广到恒星环境，包括恒星 CME 的观测识别和物理性质刻画。",
      works: [
        {
          label: "Work I",
          title: "The Dual Role of Magnetic Fields in CMEs",
          description:
            "Using 3D MHD simulations, we systematically explored a broad parameter space to investigate the competing promoting and suppressing effects of magnetic fields on stellar CMEs. Our results highlight the active-region magnetic field strength as a key factor governing this competition and CME speeds, emphasizing the importance of future measurements of stellar active-region magnetic fields for constraining stellar CME dynamics.",
          image: "pub/2.1.png?v=20260905-1538",
          imageAlt: "3D MHD simulations of magnetic-field effects on stellar CMEs",
          url: "https://iopscience.iop.org/article/10.3847/1538-4357/ae884c",
        },
      ],
    },
    {
      index: "03",
      title: "系外空间天气",
      summary:
        "通过数值模拟，我们研究恒星 CME 如何塑造系外行星的空间天气环境，并评估其对系外行星宜居性的影响。",
      works: [
        {
          label: "Work I",
          title: "Searching for Stellar CMEs with High-Resolution Spectroscopy",
          description:
            "Using six years of archival VLT/ESPRESSO observations, we conducted a systematic high-resolution spectroscopic search for stellar CME signatures among 327 late-type main-sequence stars. On the young solar-type star DS Tuc A, we detected Doppler-shifted Hα signatures potentially associated with prominence eruption, demonstrating the power of high-resolution spectroscopy for probing stellar eruptive phenomena.",
          image: "pub/3.1.png",
          imageAlt: "High-resolution spectroscopic search for stellar CME signatures",
        },
        {
          label: "Work II",
          title: "Magnetic Topology Shapes Exoplanetary Space Weather",
          description:
            "Using 3D MHD simulations, we show that the large-scale magnetic topology of M dwarfs can strongly regulate CME impacts on exoplanets. In a single-hemisphere magnetic configuration, CMEs preferentially originate from high latitudes and propagate away from the equatorial plane, potentially creating a relatively benign CME environment for equatorial exoplanets.",
          image: "pub/3.2.gif",
          imageAlt: "3D MHD simulation showing how magnetic topology shapes exoplanetary space weather",
        },
      ],
    },
  ],
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

function appendFormattedText(element, text) {
  text.split(/(\*\*[^*]+\*\*)/g).forEach((part) => {
    if (!part) return;

    if (part.startsWith("**") && part.endsWith("**")) {
      const strong = document.createElement("strong");
      strong.textContent = part.slice(2, -2);
      element.append(strong);
      return;
    }

    element.append(document.createTextNode(part));
  });
}

function createResearchWorkItem(work) {
  const item = document.createElement(work.url ? "a" : "article");
  item.className = "research-work-item";

  if (work.url) {
    item.href = work.url;
    item.target = "_blank";
    item.rel = "noreferrer";
    item.setAttribute("aria-label", `${work.title} - read article`);
  }

  const label = document.createElement("span");
  label.className = "research-work-label";
  label.textContent = work.label;

  const media = document.createElement("figure");
  media.className = "research-work-media";

  if (work.image) {
    const image = document.createElement("img");
    image.src = work.image;
    image.alt = work.imageAlt || work.title;
    image.loading = "lazy";
    image.addEventListener("load", () => {
      if (!image.naturalWidth || !image.naturalHeight) return;
      media.style.setProperty(
        "--media-aspect",
        `${image.naturalWidth} / ${image.naturalHeight}`
      );
      media.classList.add("is-loaded");
    });
    media.append(image);
  } else {
    const placeholder = document.createElement("span");
    placeholder.textContent =
      currentLanguage === "zh" ? "图片占位" : "Image placeholder";
    media.append(placeholder);
  }

  const title = document.createElement("h3");
  title.textContent = work.title;

  const description = document.createElement("p");
  appendFormattedText(description, work.description);

  if (work.url) {
    const linkCue = document.createElement("span");
    linkCue.className = "research-work-link";
    linkCue.textContent = currentLanguage === "zh" ? "Read article ↗" : "Read article ↗";
    item.append(label, media, title, description, linkCue);
  } else {
    item.append(label, media, title, description);
  }

  return item;
}

function renderResearchModal() {
  if (activeResearchPanel === null) return;

  const modal = document.querySelector("[data-research-modal]");
  const title = modal?.querySelector("[data-research-modal-title]");
  const index = modal?.querySelector("[data-research-modal-index]");
  const summary = modal?.querySelector("[data-research-modal-summary]");
  const workList = modal?.querySelector("[data-research-modal-works]");
  const content =
    researchModalContent[currentLanguage]?.[activeResearchPanel] ||
    researchModalContent.en[activeResearchPanel];

  if (!modal || !title || !index || !summary || !workList || !content) return;

  index.textContent = content.index;
  title.textContent = content.title;
  summary.textContent = content.summary;
  workList.replaceChildren(...content.works.map(createResearchWorkItem));
}

function openResearchModal(panelIndex, trigger) {
  const modal = document.querySelector("[data-research-modal]");
  const dialog = modal?.querySelector(".research-dialog");
  if (!modal || !dialog) return;

  activeResearchPanel = panelIndex;
  lastResearchTrigger = trigger;
  renderResearchModal();

  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  dialog.focus();
}

function closeResearchModal() {
  const modal = document.querySelector("[data-research-modal]");
  if (!modal) return;

  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activeResearchPanel = null;

  if (lastResearchTrigger) {
    lastResearchTrigger.focus();
    lastResearchTrigger = null;
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
        if (parent.closest("#publications")) return NodeFilter.FILTER_REJECT;
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

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const value = textFor(element.dataset.i18nAriaLabel);
    if (value) element.setAttribute("aria-label", value);
  });

  applyStaticTextTranslations(language);
  renderResearchModal();
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
  ".research-card, .achievement-card, .award-card, .publication-list li, .timeline article, .talk-grid article, .expand-panel"
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

document.querySelectorAll("[data-research-panel]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openResearchModal(Number(trigger.dataset.researchPanel), trigger);
  });
});

document.querySelectorAll("[data-research-close]").forEach((trigger) => {
  trigger.addEventListener("click", closeResearchModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeResearchPanel !== null) {
    closeResearchModal();
  }
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

applyLanguage("en");

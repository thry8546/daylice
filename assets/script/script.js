const SUPABASE_URL = "https://szeaqmesaiosntxudklr.supabase.co";
const SUPABASE_KEY = "sb_publishable_qLkQu8k7poeFCZdPBS1psQ_3-JxaaeB";
let supabaseClientPromise;

const loadSupabase = () => {
  if (supabaseClientPromise) return supabaseClientPromise;
  supabaseClientPromise = import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm")
    .then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_KEY))
    .catch((error) => {
      console.error("Supabase indisponible", error);
      return null;
    });
  return supabaseClientPromise;
};

const toPriceString = (value) => {
  if (value === null || value === undefined || value === "" || Number.isNaN(value)) {
    return "";
  }
  const num = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  if (Number.isNaN(num)) return "";
  return num.toFixed(2).replace(".", ",");
};

document.addEventListener("DOMContentLoaded", () => {
  const burgerMenu = document.querySelector(".burger-menu");
  const wrapperMenu = document.querySelector(".wrapper-menu-bloc");
  const wrapperLink = document.querySelector(".wrapper-link-bloc");
  const menuLinks = document.querySelectorAll(".wrapper-link, .home-wrapper-link");
  const sliceLinkBlock = document.querySelector(".slice-link-block");
  const sliceLinks = sliceLinkBlock?.querySelectorAll(".slice-link");
  const sliceTitle = document.querySelector(".slice-title-db");
  const sliceText = document.querySelector(".slice-text-db");
  const sliceTextBloc = document.querySelector(".slice-text-bloc");
  const sliceImage = document.querySelector(".slice-image");
  const sliceArea = document.querySelector(".slice-bloc");
  const menuTabs = document.querySelectorAll(".menu-tab");
  const menuList = document.querySelector(".menu-list");
  const menuListViewport = document.querySelector(".menu-list-viewport");
  const menuHead = document.querySelector(".menu-head");
  const navbar = document.querySelector(".navbar-bloc");
  const menuSection = document.querySelector("#section-menu");
  const menuBg = menuSection?.querySelector(".menu-bg");
  const dayPromoSection = document.querySelector("#day-promo");
  const dayPromoSectionTitle = dayPromoSection?.querySelector(".section-title");
  const dayPromoTitle = dayPromoSection?.querySelector(".day-promo-title-db");
  const dayPromoText = dayPromoSection?.querySelector(".day-promo-text-db");
  const dayPromoPrice = dayPromoSection?.querySelector(".price-bloc");
  const dayPromoPizza = dayPromoSection?.querySelector(".pizza-img");
  const monthPromoSection = document.querySelector("#month-promo");
  const monthSectionTitle = monthPromoSection?.querySelector(".section-title");
  const monthTitle = monthPromoSection?.querySelector(".title-month-promo");
  const monthListBloc = monthPromoSection?.querySelector(".month-list-bloc");
  const contactSection = document.querySelector("#contact");
  let slides = [
    {
      title: "Allergie et | ou intolérances alimentaires",
      text: "Chacun est différent, donc n’hésitez pas à vous adresser à notre personnel qui saura vous renseigner avec plaisir.",
      image: "./assets/image/banner-img-1.jpg",
    },
    {
      title: "Qualité des produits",
      text: "Snack ne veut pas dire junk-food, nous mettons tous notre cœur et toute notre énergie pour vous proposer les meilleurs produits, tous en respectant votre porte-monnaie.<br><br>Provenance des viandes, Bœuf : Suisse | Porc : Suisse – Italie | Poulet : Suisse – Allemagne | Saumon : Norvège | Thon : Philippines | Crevettes : USA",
      image: "./assets/image/banner-img-2.jpg",
    },
    {
      title: "Horaires",
      text: "Lundi a Mercredi ......... 7h30 - 19h00<br>Jeudi ........................... 7h30 - 20h00<br>Vendredi ..................... 7h30 - 19h00<br>Samedi ........................7h00 - 18h00<br>Dimanche et jour férié ......... fermé",
      image: "./assets/image/banner-img-3.jpg",
    },
    {
      title: "Convivialité",
      text: "Toute notre équipe cherche à répondre aux attentes de nos hôtes. Autant que possible, nous y répondrons, en prime, nos sourires sont gratuits.",
      image: "./assets/image/banner-img-4.jpg",
    },
    {
      title: "Terrasse 34 places et nouveau nos 4 transats en été uniquement pour un apéro en toute détente",
      text: "Pour des apéros inoubliables, nous disposons, en plus de notre salle plain-pied, d’une terrasse couverte.<br><br>Notre terrasse est self-service durant la période d'hiver du 26 novembre 2025 au 28 février 2026.<br>Nos clients à mobilité réduite font exception et sont servis.",
      image: "./assets/image/banner-img-5.jpg",
    },
    {
      title: "Service take-away et réservation",
      text: "Une envie de grignotage ?. N’hésitez pas à nous appeler avant au 032 852 03 46  et nous vous préparerons votre commande a emporter pour l’heure désirée. Et si vous le souhaitiez, nous vous réservons une table et votre commande, cela vous permet de profitez au maximum de votre pause repas.<br>Chaque mercredi et vendredi, nous vous proposons un menu qui peut être emporté<br>Nos potages et nos salades sont également prévus à l'emporter",
      image: "./assets/image/banner-img-6.jpg",
    },
  ];
  let currentSlideIndex = 0;
  let autoPlayTimer;
  if (!burgerMenu) return;

  let menuData = {
    chaud: [
      {
        category: "Pizzas",
        name: "Formule matin",
        description: "Café ou espresso ou thé, croissant parisien",
        price: 2.0,
        sizes: [
          { label: "moyen", value: 4.0 },
          { label: "grand", value: 6.0 },
        ],
      },
      {
        category: "Burgers",
        name: "Burger bœuf maison",
        description: "Pain brioché, steak suisse, cheddar, oignons confits, sauce maison",
        price: 12.5,
        sizes: [
          { label: "double", value: 15.5 },
          { label: "triple", value: 18.0 },
        ],
      },
      {
        category: "Plats",
        name: "Lasagnes au four",
        description: "Sauce tomate maison, bœuf haché suisse, gratin mozzarella",
        price: 14.0,
        sizes: [
          { label: "moyen", value: 16.0 },
          { label: "grand", value: 18.0 },
        ],
      },
      {
        category: "Tartines",
        name: "Croque poulet",
        description: "Poulet mariné, emmental, crème ciboulette, pain de campagne grillé",
        price: 9.5,
        sizes: [
          { label: "moyen", value: 11.0 },
          { label: "grand", value: 12.5 },
        ],
      },
    ],
    froid: [
      {
        category: "Salades",
        name: "César au poulet",
        description: "Poulet grillé, romaine, croûtons, parmesan, sauce légère",
        price: 11.0,
        sizes: [
          { label: "moyen", value: 13.0 },
          { label: "grand", value: 14.5 },
        ],
      },
      {
        category: "Sandwichs",
        name: "Club saumon fumé",
        description: "Saumon fumé, fromage frais citronné, concombre, roquette",
        price: 9.0,
        sizes: [
          { label: "moyen", value: 10.5 },
          { label: "grand", value: 12.0 },
        ],
      },
      {
        category: "Bowls",
        name: "Veggie bowl",
        description: "Quinoa, avocat, pois chiches rôtis, légumes croquants, sauce tahini",
        price: 12.0,
        sizes: [
          { label: "moyen", value: 13.5 },
          { label: "grand", value: 15.0 },
        ],
      },
      {
        category: "Tartares",
        name: "Tartare de saumon",
        description: "Saumon mariné, câpres, aneth, citron vert, toasts grillés",
        price: 15.5,
        sizes: [
          { label: "moyen", value: 17.5 },
          { label: "grand", value: 19.0 },
        ],
      },
    ],
    boisson: [
      {
        category: "Cafés",
        name: "Espresso",
        description: "Assemblage maison, torréfaction équilibrée",
        price: 2.0,
        sizes: [
          { label: "double", value: 3.5 },
          { label: "allongé", value: 2.5 },
        ],
      },
      {
        category: "Boissons fraîches",
        name: "Thé glacé maison",
        description: "Infusion fruits rouges, pointe de citron vert",
        price: 4.5,
        sizes: [
          { label: "moyen", value: 5.5 },
          { label: "grand", value: 6.5 },
        ],
      },
      {
        category: "Lattes",
        name: "Latte caramel",
        description: "Lait velouté, expresso, caramel maison, mousse légère",
        price: 5.0,
        sizes: [
          { label: "moyen", value: 5.8 },
          { label: "grand", value: 6.6 },
        ],
      },
      {
        category: "Smoothies",
        name: "Green boost",
        description: "Épinard, pomme, kiwi, menthe, pointe de gingembre",
        price: 6.0,
        sizes: [
          { label: "moyen", value: 6.8 },
          { label: "grand", value: 7.6 },
        ],
      },
    ],
  };
  const defaultMenuData = JSON.parse(JSON.stringify(menuData));
  let dayPromoData = null;
  let monthPromoData = [];
  let currentMenuCategory = menuTabs[0]?.dataset.category || "chaud";

  const closeMenu = () => {
    burgerMenu.classList.remove("is-open");
    wrapperMenu.classList.remove("wrapper-menu-bloc-open");
    wrapperLink.classList.remove("wrapper-link-bloc-open");
  };

  burgerMenu.addEventListener("click", () => {
    burgerMenu.classList.toggle("is-open");
    const isOpening = burgerMenu.classList.contains("is-open");
    wrapperMenu.classList.toggle("wrapper-menu-bloc-open");
    wrapperLink.classList.toggle("wrapper-link-bloc-open");
    if (isOpening) {
      wrapperMenu.classList.add("wrapper-menu-animate");
    }
  });

  wrapperMenu.addEventListener("click", closeMenu);
  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const updateActiveSliceLink = (index) => {
    sliceLinks?.forEach((link, idx) => {
      link.classList.toggle("slice-link-active", idx === index);
    });
  };

  const applySlideContent = (index) => {
    const slide = slides[index];
    if (!slide) return;
    if (sliceTitle) sliceTitle.textContent = slide.title;
    if (sliceText) sliceText.innerHTML = slide.text;
    if (sliceImage) {
      sliceImage.src = slide.image;
      sliceImage.alt = slide.title;
    }
  };

  const animateSlide = (callback) => {
    sliceTextBloc?.classList.add("slice-is-fading");
    sliceImage?.classList.add("slice-is-fading");
    setTimeout(() => {
      callback();
      requestAnimationFrame(() => {
        sliceTextBloc?.classList.remove("slice-is-fading");
        sliceImage?.classList.remove("slice-is-fading");
      });
    }, 150);
  };

  const goToSlide = (index) => {
    if (!slides.length) return;
    currentSlideIndex = (index + slides.length) % slides.length;
    animateSlide(() => {
      applySlideContent(currentSlideIndex);
      updateActiveSliceLink(currentSlideIndex);
    });
  };

  const startAutoPlay = () => {
    if (!slides.length) return;
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
      goToSlide(currentSlideIndex + 1);
    }, 5000);
  };

  const setNavHeightVar = () => {
    if (!navbar) return;
    const navHeight = navbar.getBoundingClientRect().height;
    document.documentElement.style.setProperty("--nav-height", `${navHeight}px`);
  };

  const formatPrice = (value) => {
    if (typeof value !== "number") return "";
    return value.toFixed(2);
  };

  const renderMenuCategory = (category) => {
    if (!menuList) return;
    const items = menuData[category] || [];
    menuList.innerHTML = items
      .map((item) => {
        const sizes = item.sizes
          ?.map(
            (size) => `
              <div class="menu-size">
                <span class="menu-size-price">CHF ${formatPrice(size.value)}</span>
                <span class="menu-size-label">${size.label}</span>
              </div>
            `,
          )
          .join("");

        return `
          <article class="menu-item">
            <p class="menu-item-category">${item.category}</p>
            <div class="menu-item-main">
              <div class="menu-item-body">
                <h3 class="menu-item-title">${item.name}</h3>
                <p class="menu-item-desc">${item.description}</p>
              </div>
              <div class="menu-item-price">CHF ${formatPrice(item.price)}</div>
            </div>
            <div class="menu-item-sizes">${sizes ?? ""}</div>
          </article>
        `;
      })
      .join("");
    if (menuListViewport) {
      menuListViewport.scrollTop = 0;
    }
  };

  const renderDayPromo = () => {
    if (!dayPromoTitle || !dayPromoText) return;
    if (!dayPromoData) {
      dayPromoTitle.textContent = "";
      dayPromoText.textContent = "";
      if (dayPromoPrice) {
        const priceNode = dayPromoPrice.querySelector(".price-day-promo-db");
        if (priceNode) priceNode.textContent = "";
      }
      if (dayPromoPizza) dayPromoPizza.style.visibility = "hidden";
      return;
    }
    if (dayPromoTitle) dayPromoTitle.textContent = dayPromoData.titre || "";
    if (dayPromoText) dayPromoText.textContent = dayPromoData.description || "";
    if (dayPromoPrice) {
      const priceNode = dayPromoPrice.querySelector(".price-day-promo-db");
      if (priceNode) priceNode.textContent = toPriceString(dayPromoData.prix) || "";
    }
    if (dayPromoPizza) {
      dayPromoPizza.style.visibility = dayPromoData.image ? "visible" : "hidden";
      if (dayPromoData.image) dayPromoPizza.src = dayPromoData.image;
    }
  };

  const renderMonthPromos = () => {
    if (!monthListBloc) return;
    if (!monthPromoData.length) {
      monthListBloc.innerHTML = "";
      return;
    }
    monthListBloc.innerHTML = monthPromoData
      .map(
        (promo) => `
        <div class="promo-month">
          <p class="product-name-month-db">${promo.titre}</p>
          <div class="line-point"></div>
          <div class="price-month-promo-bloc">
            <p class="devise">CHF</p>
            <p class="price-month-promo-db">${toPriceString(promo.prix_promo)}</p>
          </div>
        </div>
      `,
      )
      .join("");
  };

  const setActiveMenuTab = (category) => {
    menuTabs.forEach((tab) => {
      const isActive = tab.dataset.category === category;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  };

  const showMenuCategory = (category) => {
    currentMenuCategory = category;
    setActiveMenuTab(category);
    renderMenuCategory(category);
  };

  const updateMenuHeadRelease = () => {
    if (!menuListViewport || !menuHead) return;
    const atBottom =
      menuListViewport.scrollTop + menuListViewport.clientHeight >=
      menuListViewport.scrollHeight - 2;
    menuHead.classList.toggle("menu-head-release", atBottom);
  };

  const clamp01 = (value) => Math.max(0, Math.min(1, value));

  const applyParallax = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    if (dayPromoSection) {
      const { top } = dayPromoSection.getBoundingClientRect();
      const progress = clamp01(1 - top / viewportHeight);

      const translate = (element, distance) => {
        if (!element) return;
        element.style.transform = `translateY(${distance * (1 - progress)}px)`;
      };

      const setOpacity = (element, opacity) => {
        if (!element) return;
        element.style.opacity = opacity;
      };

      translate(dayPromoSectionTitle, 54);
      translate(dayPromoTitle, 108);
      translate(dayPromoText, 144);
      translate(dayPromoPrice, 180);
      translate(dayPromoPizza, 270);

      const opacity = 0.3 + progress * 0.7;
      setOpacity(dayPromoSectionTitle, opacity);
      setOpacity(dayPromoTitle, opacity);
      setOpacity(dayPromoText, opacity);
      setOpacity(dayPromoPrice, opacity);
      setOpacity(dayPromoPizza, opacity);
    }

    if (menuSection && menuBg) {
      const { top: menuTop } = menuSection.getBoundingClientRect();
      const menuProgress = clamp01(1 - menuTop / viewportHeight);
      const offset = menuProgress * 60; // parallax léger vers le bas pour éviter les zones vides
      menuBg.style.transform = `translateY(${offset}px) scale(1.08)`;
    }

    if (monthPromoSection) {
      const { top: monthTop } = monthPromoSection.getBoundingClientRect();
      const monthProgress = clamp01(1 - monthTop / viewportHeight);
      const translateMonth = (element, distance) => {
        if (!element) return;
        element.style.transform = `translateY(${distance * (1 - monthProgress)}px)`;
      };
      translateMonth(monthSectionTitle, 40);
      translateMonth(monthTitle, 60);
      const monthItems = monthListBloc?.querySelectorAll(".promo-month");
      monthItems?.forEach((item, idx) => {
        const distance = 30 + idx * 6;
        item.style.transform = `translateY(${distance * (1 - monthProgress)}px)`;
      });
    }
  };

  let dayPromoRaf = null;
  const scheduleParallax = () => {
    if (dayPromoRaf) return;
    dayPromoRaf = requestAnimationFrame(() => {
      dayPromoRaf = null;
      applyParallax();
    });
  };

  const updateContactSection = (contacts, params) => {
    const contactCards = contactSection?.querySelectorAll(".contact-card");
    const addressCard = contactCards?.[0];
    const phoneCard = contactCards?.[1];
    const mailCard = contactCards?.[2];
    const socialsCard = contactCards?.[3];

    const findValue = (type) => contacts?.find((c) => c.type === type)?.valeur;

    const adresse = findValue("adresse") || params?.adresse || "";
    const telephone = findValue("telephone") || "";
    const email = findValue("email") || "";
    const facebook = findValue("facebook") || "";
    const telegram = findValue("telegram") || "";

    if (addressCard) {
      const addressMain = addressCard.querySelector(".contact-main");
      if (addressMain) addressMain.textContent = adresse;
    }

    if (phoneCard) {
      const phoneLink = phoneCard.querySelector("a.contact-link");
      if (phoneLink) {
        phoneLink.textContent = telephone;
        phoneLink.href = telephone ? `tel:${telephone.replace(/\s+/g, "")}` : "#";
      }
    }

    if (mailCard) {
      const mailLink = mailCard.querySelector("a.contact-link");
      if (mailLink) {
        mailLink.textContent = email;
        mailLink.href = email ? `mailto:${email}` : "#";
      }
    }

    if (socialsCard) {
      const pills = socialsCard.querySelectorAll(".contact-pill");
      if (pills[0] && facebook) {
        pills[0].textContent = "Facebook";
        pills[0].href = facebook;
      }
      if (pills[1]) {
        pills[1].textContent = telegram ? "Telegram" : pills[1].textContent;
        if (telegram) pills[1].href = telegram;
      }
    }
  };

  const hydrateFromSupabase = async () => {
    const supabase = await loadSupabase();
    if (!supabase) return;

    const bannersQuery = supabase
      .from("bannieres")
      .select("titre, description, image_url, ordre, actif")
      .eq("actif", true)
      .order("ordre", { ascending: true });
    const chaudQuery = supabase
      .from("plats_chauds")
      .select("*")
      .eq("archived", false)
      .order("ordre", { ascending: true });
    const froidQuery = supabase
      .from("plats_froids")
      .select("*")
      .eq("archived", false)
      .order("ordre", { ascending: true });
    const boissonQuery = supabase
      .from("boissons")
      .select("*")
      .eq("archived", false)
      .order("ordre", { ascending: true });
    const platJourQuery = supabase
      .from("plat_du_jour")
      .select("*")
      .eq("actif", true)
      .limit(1);
    const promosQuery = supabase
      .from("promos")
      .select("*")
      .eq("actif", true)
      .order("ordre", { ascending: true });
    const contactsQuery = supabase.from("contacts").select("*").eq("afficher", true).order("ordre");
    const paramsQuery = supabase.from("parametres").select("cle, valeur");

    const [
      bannersRes,
      chaudRes,
      froidRes,
      boissonRes,
      platRes,
      promosRes,
      contactsRes,
      paramsRes,
    ] = await Promise.all([
      bannersQuery,
      chaudQuery,
      froidQuery,
      boissonQuery,
      platJourQuery,
      promosQuery,
      contactsQuery,
      paramsQuery,
    ]);

    if (!bannersRes.error && bannersRes.data?.length) {
      slides = bannersRes.data.map((b) => ({
        title: b.titre,
        text: b.description || "",
        image: b.image_url || "./assets/image/banner-img-1.jpg",
      }));
      currentSlideIndex = 0;
      applySlideContent(currentSlideIndex);
      updateActiveSliceLink(currentSlideIndex);
      startAutoPlay();
    }

    const mapMenu = (rows, isBoisson = false) =>
      (rows || []).map((row) => {
        const basePrice = isBoisson ? row.prix_petite : row.prix_petit;
        const medium = isBoisson ? row.prix_moyenne : row.prix_moyen;
        const large = isBoisson ? row.prix_grande : row.prix_grand;
        const sizes = [
          medium != null && !Number.isNaN(medium) ? { label: "moyen", value: Number(medium) } : null,
          large != null && !Number.isNaN(large) ? { label: "grand", value: Number(large) } : null,
        ].filter(Boolean);
        return {
          category: row.categorie || (isBoisson ? "Boisson" : "Plat"),
          name: row.name,
          description: row.informations || "",
          price: basePrice != null ? Number(basePrice) : null,
          sizes,
        };
      });

    if (!chaudRes.error || !froidRes.error || !boissonRes.error) {
      menuData = {
        chaud: !chaudRes.error && chaudRes.data ? mapMenu(chaudRes.data, false) : defaultMenuData.chaud,
        froid: !froidRes.error && froidRes.data ? mapMenu(froidRes.data, false) : defaultMenuData.froid,
        boisson:
          !boissonRes.error && boissonRes.data ? mapMenu(boissonRes.data, true) : defaultMenuData.boisson,
      };
      showMenuCategory(currentMenuCategory);
    }

    if (!platRes.error && platRes.data?.length) {
      dayPromoData = platRes.data[0];
    } else {
      dayPromoData = null;
    }
    renderDayPromo();

    if (!promosRes.error && promosRes.data?.length) {
      monthPromoData = promosRes.data;
    } else {
      monthPromoData = [];
    }
    renderMonthPromos();

    if (!contactsRes.error) {
      const paramsMap = {};
      if (!paramsRes.error && paramsRes.data) {
        paramsRes.data.forEach((p) => (paramsMap[p.cle] = p.valeur));
      }
      updateContactSection(contactsRes.data, paramsMap);
      const footer = document.querySelector(".site-footer p");
      const copyright = paramsMap["copyright"];
      if (footer && copyright) footer.textContent = copyright;
    }
  };

  if (sliceArea) {
    let touchStartX = 0;
    const swipeThreshold = 40;

    sliceArea.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.touches[0].clientX;
      },
      { passive: true },
    );

    sliceArea.addEventListener(
      "touchend",
      (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;
        if (Math.abs(deltaX) < swipeThreshold) return;
        if (deltaX < 0) {
          goToSlide(currentSlideIndex + 1);
        } else {
          goToSlide(currentSlideIndex - 1);
        }
        startAutoPlay();
      },
      { passive: true },
    );
  }

  if (menuTabs.length) {
    menuTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const { category } = tab.dataset;
        if (!category) return;
        showMenuCategory(category);
        updateMenuHeadRelease();
      });
    });
    showMenuCategory(menuTabs[0].dataset.category || "chaud");
  }

  setNavHeightVar();
  updateMenuHeadRelease();

  if (sliceLinks?.length) {
    sliceLinks.forEach((link, index) => {
      link.addEventListener("click", () => {
        goToSlide(index);
        startAutoPlay();
      });
    });
  }

  if (slides.length) {
    applySlideContent(currentSlideIndex);
    updateActiveSliceLink(currentSlideIndex);
    startAutoPlay();
  }

  // Vider les zones Plat du jour et Promos tant que Supabase ne renvoie rien
  renderDayPromo();
  renderMonthPromos();
  hydrateFromSupabase();

  window.addEventListener("scroll", scheduleParallax, { passive: true });
  window.addEventListener("resize", scheduleParallax);
  window.addEventListener("resize", setNavHeightVar);
  menuListViewport?.addEventListener("scroll", updateMenuHeadRelease, { passive: true });
  scheduleParallax();
});

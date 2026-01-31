const SUPABASE_URL = "https://szeaqmesaiosntxudklr.supabase.co";
const SUPABASE_KEY = "sb_publishable_qLkQu8k7poeFCZdPBS1psQ_3-JxaaeB";

let supabaseClientPromise;

const loadSupabase = () => {
  if (supabaseClientPromise) return supabaseClientPromise;
  supabaseClientPromise = import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm")
    .then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_KEY))
    .catch((error) => {
      console.error("Chargement Supabase échoué", error);
      return null;
    });
  return supabaseClientPromise;
};

const toPrice = (value) => {
  if (value === null || value === undefined || value === "" || Number.isNaN(value)) {
    return "—";
  }
  const num = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  if (Number.isNaN(num)) return "—";
  return num.toFixed(2).replace(".", ",");
};

const parsePrice = (value) => {
  if (!value) return null;
  const normalized = String(value).replace(",", ".").trim();
  const n = Number(normalized);
  return Number.isNaN(n) ? null : n;
};

const sectionConfig = {
  "plats-chauds": {
    table: "plats_chauds",
    orderBy: { column: "ordre", ascending: true },
    mapFromDb: (row) => ({
      id: row.id,
      name: row.name,
      category: row.categorie || "Plats chauds",
      details: row.informations || "",
      priceP: toPrice(row.prix_petit),
      priceM: toPrice(row.prix_moyen),
      priceG: toPrice(row.prix_grand),
    }),
    mapToDb: (formData) => ({
      name: formData.name,
      categorie: formData.category || null,
      informations: formData.details || null,
      prix_petit: parsePrice(formData.priceP),
      prix_moyen: parsePrice(formData.priceM),
      prix_grand: parsePrice(formData.priceG),
      ordre: formData.order ?? 0,
    }),
  },
  "plats-froids": {
    table: "plats_froids",
    orderBy: { column: "ordre", ascending: true },
    mapFromDb: (row) => ({
      id: row.id,
      name: row.name,
      category: row.categorie || "Plats froids",
      details: row.informations || "",
      priceP: toPrice(row.prix_petit),
      priceM: toPrice(row.prix_moyen),
      priceG: toPrice(row.prix_grand),
    }),
    mapToDb: (formData) => ({
      name: formData.name,
      categorie: formData.category || null,
      informations: formData.details || null,
      prix_petit: parsePrice(formData.priceP),
      prix_moyen: parsePrice(formData.priceM),
      prix_grand: parsePrice(formData.priceG),
      ordre: formData.order ?? 0,
    }),
  },
  boissons: {
    table: "boissons",
    orderBy: { column: "ordre", ascending: true },
    mapFromDb: (row) => ({
      id: row.id,
      name: row.name,
      category: row.categorie || "Boissons",
      details: row.informations || "",
      priceP: toPrice(row.prix_petite),
      priceM: toPrice(row.prix_moyenne),
      priceG: toPrice(row.prix_grande),
    }),
    mapToDb: (formData) => ({
      name: formData.name,
      categorie: formData.category || null,
      informations: formData.details || null,
      prix_petite: parsePrice(formData.priceP),
      prix_moyenne: parsePrice(formData.priceM),
      prix_grande: parsePrice(formData.priceG),
      ordre: formData.order ?? 0,
    }),
  },
  promos: {
    table: "promos",
    orderBy: { column: "ordre", ascending: true },
    mapFromDb: (row) => ({
      id: row.id,
      name: row.titre,
      category: "Promo",
      details: row.description || "",
      priceP: toPrice(row.prix_promo),
      priceM: "—",
      priceG: "—",
    }),
    mapToDb: (formData) => ({
      titre: formData.name,
      description: formData.details || null,
      prix_promo: parsePrice(formData.priceSingle),
      ordre: formData.order ?? 0,
      actif: true,
    }),
  },
  "plat-jour": {
    table: "plat_du_jour",
    orderBy: { column: "updated_at", ascending: false },
    single: true,
    mapFromDb: (row) => ({
      id: row.id,
      name: row.titre,
      category: "Plat du jour",
      details: row.description || "",
      priceP: toPrice(row.prix),
      priceM: "—",
      priceG: "—",
    }),
    mapToDb: (formData) => ({
      titre: formData.name,
      description: formData.details || null,
      prix: parsePrice(formData.priceSingle),
      actif: true,
    }),
  },
  bannieres: {
    table: "bannieres",
    orderBy: { column: "ordre", ascending: true },
    mapFromDb: (row) => ({
      id: row.id,
      name: row.titre,
      category: "Bannière",
      details: row.description || "",
      priceP: "—",
      priceM: "—",
      priceG: "—",
      image: row.image_url || "",
    }),
    mapToDb: (formData) => ({
      titre: formData.name,
      description: formData.details || null,
      image_url: formData.bannerImage || null,
      ordre: formData.order ?? 0,
      actif: true,
    }),
  },
  contacts: {
    table: "contacts",
    orderBy: { column: "ordre", ascending: true },
    mapFromDb: (row) => ({
      id: row.id,
      name: row.type,
      category: "Contact",
      details: row.valeur,
      priceP: "—",
      priceM: "—",
      priceG: "—",
    }),
    mapToDb: (formData) => ({
      type: formData.name,
      valeur: formData.details || "",
      ordre: formData.order ?? 0,
      afficher: true,
    }),
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("login-screen");
  const dashboard = document.getElementById("dashboard");
  const loginForm = document.getElementById("login-form");
  const logoutBtn = document.getElementById("logout-btn");
  const nav = document.getElementById("sidebar-nav");
  const tableBody = document.getElementById("table-body");
  const tableAddBtn = document.getElementById("table-add-btn");
  const categoryAddBtn = document.getElementById("category-add-btn");
  const categorySelect = document.getElementById("category-select");
  const formTitle = document.getElementById("form-title");
  const productForm = document.getElementById("product-form");
  const priceGrid = document.getElementById("price-grid");
  const singlePriceField = document.getElementById("single-price-field");
  const categoryRow = document.getElementById("category-row");
  const detailsField = document.getElementById("details-field");
  const bannerImageField = document.getElementById("banner-image-field");
  const bannerPreview = document.getElementById("banner-preview");
  const bannerPreviewImg = bannerPreview?.querySelector("img");
  const saveBtn = productForm?.querySelector(".btn-primary");
  const deleteBtn = document.getElementById("delete-btn");
  const nameInput = productForm?.elements.productName;

  const sectionsWithListAdd = ["boissons", "plats-chauds", "plats-froids", "promos"];
  const sectionsWithCategoryAdd = ["boissons", "plats-chauds", "plats-froids"];
  let currentSection = "plats-chauds";
  let activeRowId = null;
  let itemsBySection = {};
  let supabaseInstance = null;
  let suggestionPool = [];
  const toggleDeleteButton = () => {
    deleteBtn?.classList.toggle("is-hidden", !activeRowId);
  };

  const setHidden = (el, hidden) => {
    if (!el) return;
    el.hidden = hidden;
  };

  const applyFieldVisibility = (section) => {
    const showPriceGrid = ["boissons", "plats-chauds", "plats-froids"].includes(section);
    const showSinglePrice = ["promos", "plat-jour"].includes(section);
    const showCategory = ["boissons", "plats-chauds", "plats-froids"].includes(section);
    const showDetails = section === "promos" ? false : true;
    const showBanner = section === "bannieres";

    setHidden(priceGrid, !showPriceGrid);
    setHidden(singlePriceField, !showSinglePrice);
    setHidden(categoryRow, !showCategory);
    setHidden(detailsField, !showDetails);
    setHidden(bannerImageField, !showBanner);
    setHidden(bannerPreview, !showBanner);

    categoryAddBtn?.classList.toggle("is-hidden", !showCategory);

    const singlePriceLabel = singlePriceField?.querySelector("span");
    if (singlePriceLabel) {
      singlePriceLabel.textContent = section === "promos" ? "Prix promo" : "Prix";
    }

    const nameLabel = productForm?.querySelector('label.input-group span');
    if (nameLabel) {
      if (section === "bannieres") nameLabel.textContent = "Titre";
      else if (section === "contacts") nameLabel.textContent = "Type";
      else if (section === "promos") nameLabel.textContent = "Nom de la promo";
      else if (section === "plat-jour") nameLabel.textContent = "Nom du plat du jour";
      else nameLabel.textContent = "Nom du produit";
    }

    if (autosuggestBox) {
      const shouldSuggest = ["promos", "plat-jour"].includes(section);
      autosuggestBox.classList.toggle("is-hidden", !shouldSuggest);
    }
  };

  const setBannerPreview = (src) => {
    if (!bannerPreviewImg) return;
    bannerPreviewImg.src = src || "";
    bannerPreviewImg.style.visibility = src ? "visible" : "hidden";
  };

  // -------- Suggestions auto-complétion (Promos, Plat du jour) ----------
  const autosuggestBox = document.createElement("div");
  autosuggestBox.className = "autosuggest is-hidden";
  nameInput?.parentElement?.appendChild(autosuggestBox);

  const suggestionSections = ["boissons", "plats-chauds", "plats-froids"];

  const rebuildSuggestions = () => {
    suggestionPool = suggestionSections.flatMap((sec) =>
      (itemsBySection[sec] || []).map((item) => ({
        name: item.name,
        price: item.priceP || "",
        details: item.details || "",
      })),
    );
  };

  const ensureSuggestions = async () => {
    const missing = suggestionSections.filter((sec) => !itemsBySection[sec]);
    if (missing.length && supabaseInstance) {
      const results = await Promise.all(missing.map((sec) => fetchSectionData(sec)));
      missing.forEach((sec, idx) => {
        itemsBySection[sec] = results[idx] || [];
      });
    }
    rebuildSuggestions();
  };

  const applySuggestion = (suggestion) => {
    if (!productForm) return;
    if (nameInput) nameInput.value = suggestion.name;
    if (productForm.elements.priceSingle) productForm.elements.priceSingle.value = suggestion.price;
    if (currentSection === "plat-jour" && productForm.elements.details) {
      productForm.elements.details.value = suggestion.details || "";
    }
    autosuggestBox.classList.add("is-hidden");
  };

  const renderSuggestions = (query) => {
    if (!autosuggestBox || !query || query.length < 2 || autosuggestBox.classList.contains("is-hidden"))
      return;
    const lower = query.toLowerCase();
    const matches = suggestionPool
      .filter((s) => s.name.toLowerCase().startsWith(lower))
      .slice(0, 6);
    if (!matches.length) {
      autosuggestBox.classList.add("is-hidden");
      autosuggestBox.innerHTML = "";
      return;
    }
    autosuggestBox.innerHTML = matches
      .map(
        (m) => `
          <button type="button" class="autosuggest-item" data-name="${m.name}" data-price="${m.price}" data-details="${m.details}">
            <span>${m.name}</span>
            <strong>${m.price}</strong>
          </button>
        `,
      )
      .join("");
  };

  autosuggestBox.addEventListener("click", (e) => {
    const target = e.target.closest(".autosuggest-item");
    if (!target) return;
    applySuggestion({
      name: target.dataset.name || "",
      price: target.dataset.price || "",
      details: target.dataset.details || "",
    });
  });

  nameInput?.addEventListener("input", async (e) => {
    const enabled = ["promos", "plat-jour"].includes(currentSection);
    if (!enabled) return;
    await ensureSuggestions();
    autosuggestBox.classList.remove("is-hidden");
    renderSuggestions(e.target.value.trim());
  });

  nameInput?.addEventListener("focus", async (e) => {
    const enabled = ["promos", "plat-jour"].includes(currentSection);
    if (!enabled) return;
    await ensureSuggestions();
    autosuggestBox.classList.remove("is-hidden");
    renderSuggestions(e.target.value.trim());
  });

  nameInput?.addEventListener("blur", () => {
    setTimeout(() => autosuggestBox.classList.add("is-hidden"), 150);
  });

  const showDashboard = () => {
    loginScreen?.classList.add("hidden");
    dashboard?.classList.add("is-visible");
  };

  const showLogin = () => {
    dashboard?.classList.remove("is-visible");
    loginScreen?.classList.remove("hidden");
  };

  const updateAddButtons = () => {
    const showListBtn = sectionsWithListAdd.includes(currentSection);
    const showCategoryBtn = sectionsWithCategoryAdd.includes(currentSection);
    tableAddBtn?.classList.toggle("is-hidden", !showListBtn);
    categoryAddBtn?.classList.toggle("is-hidden", !showCategoryBtn);
  };

  const setActiveNav = (section) => {
    const links = nav?.querySelectorAll(".nav-link") || [];
    links.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.section === section);
    });
    applyFieldVisibility(section);
  };

  const ensureCategoryOption = (value) => {
    if (!value) return;
    const exists = Array.from(categorySelect?.options || []).some((opt) => opt.value === value);
    if (!exists && categorySelect) {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = value;
      categorySelect.appendChild(opt);
    }
  };

  const updateForm = (item) => {
    if (!item || !productForm) return;
    formTitle.textContent = item.name || "Élément";
    productForm.elements.productName.value = item.name || "";
    if (productForm.elements.priceP) productForm.elements.priceP.value = item.priceP || "";
    if (productForm.elements.priceM) productForm.elements.priceM.value = item.priceM || "";
    if (productForm.elements.priceG) productForm.elements.priceG.value = item.priceG || "";
    if (productForm.elements.priceSingle) {
      const singleValue = item.priceP && item.priceP !== "—" ? item.priceP : "";
      productForm.elements.priceSingle.value = singleValue;
    }

    ensureCategoryOption(item.category);
    if (categorySelect && categorySelect.options.length) categorySelect.value = item.category || "";
    if (productForm.elements.details) productForm.elements.details.value = item.details || "";
    if (productForm.elements.bannerImage) productForm.elements.bannerImage.value = item.image || "";
    setBannerPreview(item.image || "");
  };

  const renderRows = (section) => {
    const items = itemsBySection[section] || [];
    tableBody.innerHTML = "";

    if (!items.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 7;
      td.textContent = "Aucune donnée pour cette section";
      tr.appendChild(td);
      tableBody.appendChild(tr);
      formTitle.textContent = "Aucune donnée";
      activeRowId = null;
      updateAddButtons();
      toggleDeleteButton();
      return;
    }

    items.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.dataset.id = item.id ?? `row-${index}`;

      const cells = [
        index + 1,
        item.name,
        item.category,
        item.details || "—",
        item.priceP ?? "—",
        item.priceM ?? "—",
        item.priceG ?? "—",
      ];

      cells.forEach((value, cellIndex) => {
        const td = document.createElement("td");
        td.textContent = value ?? "—";
        if (cellIndex >= 4) td.classList.add("price-cell");
        tr.appendChild(td);
      });

      tr.addEventListener("click", () => {
        activeRowId = item.id;
        renderActiveRowHighlight();
        updateForm(item);
        toggleDeleteButton();
      });
      tableBody.appendChild(tr);
    });

    activeRowId = items[0]?.id ?? null;
    renderActiveRowHighlight();
    updateForm(items[0]);
    toggleDeleteButton();
  };

  const renderActiveRowHighlight = () => {
    const rows = Array.from(tableBody?.querySelectorAll("tr[data-id]") || []);
    rows.forEach((row) => {
      row.classList.toggle("active", String(row.dataset.id) === String(activeRowId));
    });
  };

  const fetchSectionData = async (section) => {
    const cfg = sectionConfig[section];
    if (!cfg || !supabaseInstance) return [];
    const query = supabaseInstance.from(cfg.table).select("*");
    if (cfg.orderBy) query.order(cfg.orderBy.column, { ascending: cfg.orderBy.ascending });
    const { data, error } = await query;
    if (error) {
      console.error(`Erreur de chargement ${section}`, error);
      return [];
    }
    return (data || []).map(cfg.mapFromDb);
  };

  const loadSection = async (section) => {
    const data = await fetchSectionData(section);
    itemsBySection[section] = data;
    renderRows(section);
    updateAddButtons();
    if (["boissons", "plats-chauds", "plats-froids"].includes(section)) rebuildSuggestions();
  };

  const startNewItem = () => {
    activeRowId = null;
    renderActiveRowHighlight();
    updateForm({
      name: "",
      category: "",
      details: "",
      priceP: "",
      priceM: "",
      priceG: "",
      image: "",
    });
    toggleDeleteButton();
  };

  const saveItem = async () => {
    const cfg = sectionConfig[currentSection];
    if (!cfg || !supabaseInstance || !productForm) return;

    const formData = {
      name: productForm.elements.productName.value.trim(),
      priceP: productForm.elements.priceP.value.trim(),
      priceM: productForm.elements.priceM.value.trim(),
      priceG: productForm.elements.priceG.value.trim(),
      priceSingle: productForm.elements.priceSingle?.value.trim() || "",
      bannerImage: productForm.elements.bannerImage?.value.trim() || "",
      category: categorySelect?.value || "",
      details: productForm.elements.details.value.trim(),
      order: itemsBySection[currentSection]?.length || 0,
    };

    const payload = cfg.mapToDb(formData);

    let response;
    if (cfg.single) {
      const targetId = activeRowId || itemsBySection[currentSection]?.[0]?.id;
      if (targetId) {
        response = await supabaseInstance
          .from(cfg.table)
          .update(payload)
          .eq("id", targetId)
          .select()
          .single();
      } else {
        response = await supabaseInstance.from(cfg.table).insert(payload).select().single();
      }
    } else if (activeRowId) {
      response = await supabaseInstance
        .from(cfg.table)
        .update(payload)
        .eq("id", activeRowId)
        .select()
        .single();
    } else {
      response = await supabaseInstance.from(cfg.table).insert(payload).select().single();
    }

    if (response?.error) {
      console.error("Sauvegarde impossible", response.error);
      if (saveBtn) {
        saveBtn.textContent = "Erreur";
        setTimeout(() => (saveBtn.textContent = "Enregistrer"), 1200);
      }
      return;
    }

    await loadSection(currentSection);
    if (saveBtn) {
      saveBtn.textContent = "Enregistré";
      saveBtn.disabled = true;
      setTimeout(() => {
        saveBtn.textContent = "Enregistrer";
        saveBtn.disabled = false;
      }, 1200);
    }
  };

  const initSupabaseAndAuth = async () => {
    supabaseInstance = await loadSupabase();
    if (!supabaseInstance) return;

    const { data: sessionData } = await supabaseInstance.auth.getSession();
    if (sessionData?.session) {
      showDashboard();
      await loadSection(currentSection);
    } else {
      showLogin();
    }

    supabaseInstance.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        showDashboard();
        await loadSection(currentSection);
      } else {
        showLogin();
      }
    });
  };

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = loginForm.elements.email.value.trim();
    const password = loginForm.elements.password.value.trim();
    const supabase = await loadSupabase();
    if (!supabase) return;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Connexion échouée", error);
      loginForm.classList.add("shake");
      setTimeout(() => loginForm.classList.remove("shake"), 700);
      return;
    }
  });

  logoutBtn?.addEventListener("click", async () => {
    const supabase = await loadSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
  });

  nav?.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.dataset.section) return;
    currentSection = target.dataset.section;
    setActiveNav(currentSection);
    await loadSection(currentSection);
    updateAddButtons();
  });

  tableAddBtn?.addEventListener("click", startNewItem);

  categoryAddBtn?.addEventListener("click", () => {
    const newLabel = prompt("Nom de la nouvelle catégorie :");
    if (newLabel) {
      ensureCategoryOption(newLabel);
      categorySelect.value = newLabel;
    }
  });

  productForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveItem();
  });

  const bannerImageInput = productForm?.elements.bannerImage;
  bannerImageInput?.addEventListener("input", (e) => {
    setBannerPreview(e.target.value.trim());
  });

  const deleteItem = async () => {
    const cfg = sectionConfig[currentSection];
    if (!cfg || !supabaseInstance || !activeRowId) return;
    const { error } = await supabaseInstance.from(cfg.table).delete().eq("id", activeRowId);
    if (error) {
      console.error("Suppression impossible", error);
      return;
    }
    activeRowId = null;
    await loadSection(currentSection);
    startNewItem();
  };

  deleteBtn?.addEventListener("click", deleteItem);

  // Initial kick-off
  setActiveNav(currentSection);
  updateAddButtons();
  initSupabaseAndAuth();
});

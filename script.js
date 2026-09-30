async function loadLatestProject() {
  const card = document.querySelector("#latest-project");

  try {
    const response = await fetch("https://api.modrinth.com/v2/user/JacobStar_/projects");
    if (!response.ok) throw new Error("Modrinth request failed");
    const projects = await response.json();
    if (!Array.isArray(projects)) throw new Error("Invalid response");
    const latest = projects
      .filter(project =>
        project &&
        typeof project.title === "string" &&
        typeof project.description === "string" &&
        typeof project.slug === "string" &&
        /^[a-z0-9-]{1,64}$/i.test(project.slug) &&
        ["mod", "modpack", "resourcepack", "shader", "datapack", "plugin"].includes(project.project_type) &&
        (project.status === "approved" || project.status === "archived") &&
        !Number.isNaN(Date.parse(project.published))
      )
      .sort((a, b) => new Date(b.published) - new Date(a.published))[0];
    if (!latest) throw new Error("No published project found");
    card.href = `https://modrinth.com/${latest.project_type}/${latest.slug}`;
    document.querySelector("#project-title").textContent = latest.title.slice(0, 80);
    document.querySelector("#project-description").textContent = latest.description.slice(0, 240);
    const safeIcon = typeof latest.icon_url === "string" && /^https:\/\/cdn\.modrinth\.com\//.test(latest.icon_url)
      ? latest.icon_url
      : "profile.png";
    document.querySelector("#project-icon").src = safeIcon;
    document.querySelector("#project-icon").alt = `${latest.title.slice(0, 80)} icon`;
    document.querySelector(".project-loading")?.remove();
    card.classList.remove("is-loading");
    card.removeAttribute("aria-busy");
    card.removeAttribute("aria-disabled");
    card.removeAttribute("tabindex");
  } catch {
    card.hidden = true;
  }
}

loadLatestProject();

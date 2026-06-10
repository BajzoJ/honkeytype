// TÁTO ČASŤ SA SPUSTÍ OKAMŽITE
(function() {
    const savedTheme = localStorage.getItem("theme") || "light";
    const mainStyle = document.getElementById("style");
    const regStyle = document.getElementById("regStyle");
    const profStyle = document.getElementById("profStyle");

    // Ak už v HTML existujú linky (čo v head ešte nemusia byť), aplikujeme hneď
    if (savedTheme === "dark") {
        if (mainStyle) mainStyle.href = "honkeyTypeDark.css";
        if (regStyle) regStyle.href = "registerDark.css";
        if (profStyle) profStyle.href = "profileDark.css";
    }
})();

// Zvyšok logiky (tlačidlá atď.) zostáva v DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    const colorBtn = document.getElementById("colorBtn");
    if (colorBtn) {
        colorBtn.addEventListener("click", function() {
            const currentTheme = localStorage.getItem("theme") || "light";
            const newTheme = (currentTheme === "light") ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            applyTheme(newTheme);
        });
    }
});

function applyTheme(theme) {
    const mainStyle = document.getElementById("style");
    const regStyle = document.getElementById("regStyle");
    const profStyle = document.getElementById("profStyle");
    const colBtn = document.getElementById("colorBtn");

    if (theme === "dark") {
        if (mainStyle) mainStyle.href = "honkeyTypeDark.css";
        if (regStyle) regStyle.href = "registerDark.css";
        if (profStyle) profStyle.href = "profileDark.css";
        if (colBtn) colBtn.innerHTML = "light mode";
    } else {
        if (mainStyle) mainStyle.href = "honkeyType.css";
        if (regStyle) regStyle.href = "register.css";
        if (profStyle) profStyle.href = "profile.css";
        if (colBtn) colBtn.innerHTML = "dark mode";
    }
}
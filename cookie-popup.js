document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("cookiesAccepted")) {
    const popup = document.getElementById("cookieConsent");
    popup.classList.remove("hidden");

    const button = document.getElementById("acceptCookies");
    button.addEventListener("click", function () {
      localStorage.setItem("cookiesAccepted", "true");
      popup.classList.add("hidden");
    });
  }
});

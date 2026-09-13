const formularz = document.querySelector("#formularz-aplikacji");
const poleFirma = document.querySelector("#firma");
const poleStanowisko = document.querySelector("#stanowisko");
const poleStatus = document.querySelector("#status");
const poleData = document.querySelector("#data");
const listaAplikacji = document.querySelector("#lista-aplikacji");
const komunikatBraku = document.querySelector("#brak-aplikacji");
const liczbaWszystkich = document.querySelector("#liczba-wszystkich");
const liczbaRozmow = document.querySelector("#liczba-rozmow");

let aplikacje = JSON.parse(localStorage.getItem("aplikacje")) || [];

function zapiszAplikacje() {
  localStorage.setItem("aplikacje", JSON.stringify(aplikacje));
}

function aktualizujStatystyki() {
  liczbaWszystkich.textContent = aplikacje.length;

  const rozmowy = aplikacje.filter(
    (aplikacja) => aplikacja.status === "Rozmowa rekrutacyjna",
  );

  liczbaRozmow.textContent = rozmowy.length;
}

function wyswietlAplikacje() {
  listaAplikacji.replaceChildren();
  komunikatBraku.hidden = aplikacje.length > 0;

  aplikacje.forEach((aplikacja) => {
    const karta = document.createElement("article");
    karta.classList.add("karta-aplikacji");

    const naglowek = document.createElement("h3");
    naglowek.textContent = aplikacja.stanowisko;

    const opisFirmy = document.createElement("p");
    opisFirmy.textContent = `Firma: ${aplikacja.firma}`;

    const etykietaStatusu = document.createElement("label");
    etykietaStatusu.textContent = "Status:";
    etykietaStatusu.htmlFor = `status-${aplikacja.id}`;

    const wyborStatusu = document.createElement("select");
    wyborStatusu.id = `status-${aplikacja.id}`;

    const dostepneStatusy = [
      "Do wysłania",
      "Wysłana",
      "Rozmowa rekrutacyjna",
      "Zakończona",
    ];

    dostepneStatusy.forEach((status) => {
      const opcja = document.createElement("option");
      opcja.value = status;
      opcja.textContent = status;
      wyborStatusu.append(opcja);
    });

    wyborStatusu.value = aplikacja.status;

    wyborStatusu.addEventListener("change", () => {
      aplikacja.status = wyborStatusu.value;
      zapiszAplikacje();
    });

    wyborStatusu.addEventListener("change", () => {
      aplikacja.status = wyborStatusu.value;
      zapiszAplikacje();
      aktualizujStatystyki();
    });

    const opisStatusu = document.createElement("p");
    opisStatusu.textContent = `Status: ${aplikacja.status}`;

    const opisDaty = document.createElement("p");
    const data = new Date(`${aplikacja.data}T00:00:00`);
    opisDaty.textContent = `Data aplikacji: ${data.toLocaleDateString("pl-PL")}`;

    const przyciskUsun = document.createElement("button");
    przyciskUsun.type = "button";
    przyciskUsun.textContent = "Usuń";
    przyciskUsun.classList.add("przycisk-usun");

    przyciskUsun.addEventListener("click", () => {
      aplikacje = aplikacje.filter((element) => element.id !== aplikacja.id);

      zapiszAplikacje();
      wyswietlAplikacje();
    });

    karta.append(
      naglowek,
      opisFirmy,
      etykietaStatusu,
      wyborStatusu,
      opisDaty,
      przyciskUsun,
    );

    listaAplikacji.append(karta);
  });

  aktualizujStatystyki();
}

formularz.addEventListener("submit", (zdarzenie) => {
  zdarzenie.preventDefault();

  const nowaAplikacja = {
    id: Date.now(),
    firma: poleFirma.value.trim(),
    stanowisko: poleStanowisko.value.trim(),
    status: poleStatus.options[poleStatus.selectedIndex].textContent,
    data: poleData.value,
  };

  aplikacje.push(nowaAplikacja);
  zapiszAplikacje();
  wyswietlAplikacje();
  formularz.reset();
});

wyswietlAplikacje();

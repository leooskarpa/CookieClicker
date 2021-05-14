function getFromLS() {
    let data = localStorage.getItem("user");

    if (data === null) {
        return {};
    } else {
        return JSON.parse(data);
    }
}

function setToLS(data, upgradeId) {
    if (!(upgradeId in data)) {
        data[upgradeId] = 0;
    }
    data[upgradeId] = Number(data[upgradeId]) + 1;

    localStorage.setItem("user", JSON.stringify(data));
}

function increaseCookies() {
    let cookies = document.querySelector(".cookie-container .number-of-cookies .number");
    cookies.textContent = Number(cookies.textContent) + 1;
    setToLS(getFromLS(), "cookies");
}

function increaseAutoCookies() {
    let data = getFromLS();
    let cookies = document.querySelector(".cookie-container .number-of-cookies .number");
    let numberOfCursors = data["cursor"];
    let numberOfKicas = data["kica"];
    let numberOfStores = data["store"];
    let numberOfFactories = data["factory"];

    cookies.textContent = Math.round((Number(cookies.textContent) +
        (numberOfCursors == null ? 0 : numberOfCursors * 0.1) +
        (numberOfKicas == null ? 0 : numberOfKicas * 1) +
        (numberOfStores == null ? 0 : numberOfStores * 10) +
        (numberOfFactories == null ? 0 : numberOfFactories * 100)) * 10) / 10;

    if (!("cookies" in data)) {
        data["cookies"] = 0;
    }
    data["cookies"] = Number(cookies.textContent);

    localStorage.setItem("user", JSON.stringify(data));
}

function buyUpgrade(event) {
    let localData = getFromLS();
    let upgradeId = event.target.dataset.id;
    let upgradeAmount = event.target.parentElement.querySelector(".upgrade-item-amount .amount");
    let upgradeCost = Number(event.target.dataset.startCost) + upgradeAmount.textContent * 0.05 * Number(event.target.dataset.startCost);
    let numberOfCookies = document.querySelector(".cookie-container .number-of-cookies .number");

    if (Number(numberOfCookies.textContent) >= Number(upgradeCost)) {
        upgradeAmount.textContent = Number(upgradeAmount.textContent) + 1;
        setToLS(localData, upgradeId);

        let upgradeNewCost = event.target.parentElement.querySelector(".upgrade-item-cost .cost");
        upgradeNewCost.textContent = upgradeCost + 0.05 * Number(event.target.dataset.startCost);
        numberOfCookies.textContent = Math.round((Number(numberOfCookies.textContent) - Number(upgradeCost)) * 10) / 10;

        localData["cookies"] = numberOfCookies.textContent;
        localStorage.setItem("user", JSON.stringify(localData));
    }
}

async function loadUpgradeItems() {
    let upgrades = await getUpgrades();
    let data = getFromLS();

    let element = document.querySelector(".upgrades-container")
    let upgradeTemplate = document.querySelector("#upgrade-item-template")

    for (let i = 0; i < upgrades.length; i++) {
        let upgrade = upgradeTemplate.content.cloneNode(true)

        let upgradeTitle = upgrade.querySelector(".upgrade-item-title");
        upgradeTitle.textContent = upgrades[i].title;

        let upgradeCost = upgrade.querySelector(".upgrade-item-cost .cost");
        if (data[upgrades[i].id] == null)
            upgradeCost.textContent = Number(upgrades[i].cost);
        else
            upgradeCost.textContent = Number(upgrades[i].cost) + data[upgrades[i].id] * 0.05 * Number(upgrades[i].cost);

        let upgradeAmount = upgrade.querySelector(".upgrade-item-amount .amount");
        if (data[upgrades[i].id] == null)
            upgradeAmount.textContent = 0;
        else
            upgradeAmount.textContent = data[upgrades[i].id];

        let upgradeId = upgrade.querySelector("#buy-upgrade-button");
        upgradeId.dataset.id = upgrades[i].id;
        upgradeId.dataset.startCost = upgrades[i].cost;

        let upgradeImage = upgrade.querySelector(".upgrade-image");
        upgradeImage.src = upgrades[i].image_url;

        element.appendChild(upgrade);
    }
}

async function getUpgrades() {
    let upgrades = await fetch("./upgrades.json");

    if (upgrades === null) {
        return {};
    } else {
        return await upgrades.json();
    }
}

function setUpgrades(upgrades) {
    localStorage.setItem("upgrades", JSON.stringify(upgrades));
}
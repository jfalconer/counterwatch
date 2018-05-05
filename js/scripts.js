'use strict';

const dqs = (query) => document.querySelector(query);
const dqsa = (query) => document.querySelectorAll(query);

document.addEventListener('DOMContentLoaded', function () {
  dqsa('.left-heroes .hero-item').forEach(clickLeftHero => clickLeftHero.addEventListener('click', setLeftHero));
});
document.addEventListener('DOMContentLoaded', function () {
  dqsa('.right-heroes .hero-item').forEach(clickRightHero => clickRightHero.addEventListener('click', setRightHero));
});
document.addEventListener('DOMContentLoaded', function () {
  dqsa('#matchem-button').forEach(clickMatchem => clickMatchem.addEventListener('click', getBattletagData));
});

let leftHero = null;
let rightHero = null;
let selectedLeftHero = null;
let selectedRightHero = null;

function setLeftHero (e) {
  let currentHero = e.target.dataset.hero;
  if (leftHero === currentHero) {
    leftHero = null;
    e.target.classList.toggle('selected-hero');
    console.log("leftHero cleared");
    buildContent();
    return;
  }
  if (selectedLeftHero) {
    selectedLeftHero.classList.remove('selected-hero');
  }
  e.target.classList.toggle('selected-hero');
  leftHero = e.target.dataset.hero;
  console.log(`${leftHero} selected`);
  selectedLeftHero = e.target;
  buildContent();
};

function setRightHero (e) {
  let currentHero = e.target.dataset.hero;
  if (rightHero === currentHero) {
    rightHero = null;
    e.target.classList.toggle('selected-hero');
    console.log("rightHero cleared");
    buildContent();
    return;
  }
  if (selectedRightHero) {
    selectedRightHero.classList.remove('selected-hero');
  }
  e.target.classList.toggle('selected-hero');
  rightHero = e.target.dataset.hero;
  console.log(`${rightHero} selected`);
  selectedRightHero = e.target;
  buildContent();
};

function buildContent () {
  if (leftHero && rightHero) {
    printMatchupData();
  } else if (leftHero || rightHero) {
    printHeroData();
  } else {
    dqs('#info-pane').innerHTML = `Select one hero for hero advice, or two for matchup advice. Battletags are optional.`;
  }
};

function printMatchupData() {
  dqs('#info-pane').innerHTML = `<p>Two heroes, ${leftHero} and ${rightHero}, have been set</p>` +
                                `${heroMatchupInfo[leftHero][rightHero]}`;
};
function printHeroData() {
  dqs('#info-pane').innerHTML = `${heroMatchupInfo[leftHero || rightHero].self}
                                <strong>Select another hero for matchup advice.</strong>`;
};

let leftBattletagData = {};
let rightBattletagData = {};
let leftBattletag = "";
let rightBattletag = "";

async function getBattletagData(e) {
  leftBattletag = document.getElementById('left-battletag').value.replace("#", "-");
  rightBattletag = document.getElementById('right-battletag').value.replace("#", "-");
  console.log(`${leftBattletag} + ${rightBattletag}`);

  if (leftBattletag && rightBattletag) {
    leftBattletagData = await loadBattletag(leftBattletag); console.log(leftBattletagData);
    rightBattletagData = await loadBattletag(rightBattletag); console.log(rightBattletagData);
  } else if (leftBattletag && !rightBattletag) {
    leftBattletagData = await loadBattletag(leftBattletag); console.log(leftBattletagData);
  } else if (!leftBattletag && rightBattletag) {
    rightBattletagData = await loadBattletag(rightBattletag); console.log(rightBattletagData);
  }
  compareBattletags();
}

function loadBattletag(battletag) {
  return axios.get(`http://localhost:4444/api/v3/u/${battletag}/blob`)
  .then(function (response) {
    console.log(response);
    return response.data;
  })
  .catch(function (error) {
    console.log(error);
    dqs('#info-pane').innerHTML = `Your request for the battletag ${battletag.replace("-", "#")} failed. Make sure the battletag is correct or clear the field.`;
  });
}

function compareBattletags () {
  if (!leftHero || !rightHero) {
    return false;
  }
  let leftWinrate = leftBattletagData.us.heroes.stats.competitive[leftHero].general_stats.win_percentage;
  let rightWinrate = rightBattletagData.us.heroes.stats.competitive[rightHero].general_stats.win_percentage;
  if (leftWinrate > rightWinrate) {
    dqs('#info-pane').innerHTML = `${leftBattletag} wins!`;
    dqs('#info-pane').innerHTML += `${leftWinrate} vs ${rightWinrate}`;
  }
  else if (rightWinrate > leftWinrate) {
    dqs('#info-pane').innerHTML = `${rightBattletag} wins!`;
    dqs('#info-pane').innerHTML += `${leftWinrate} vs ${rightWinrate}`;
  }
}

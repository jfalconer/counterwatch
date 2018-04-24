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

let leftHero = "";
let rightHero = "";
dqs('#info-pane').innerHTML = `Select one hero for hero advice, or two for matchup advice. Battletags are optional.`;

function setLeftHero (e) {
  let currentHero = e.target.dataset.hero
  if (leftHero === currentHero) {
    leftHero = "";
    console.log("leftHero cleared");
  }
  else {
    leftHero = e.target.dataset.hero;
    console.log(leftHero);
  }
  buildContent();
};

function setRightHero (e) {
  let currentHero = e.target.dataset.hero
  if (rightHero === currentHero) {
    rightHero = "";
    console.log("rightHero cleared");
  }
  else {
    rightHero = e.target.dataset.hero;
    console.log(rightHero);
  }
  buildContent();
};

function buildContent () {
  if (leftHero && rightHero) {
    getMatchupData();
  } else if (leftHero || rightHero) {
    getHeroData();
  } else {
    dqs('#info-pane').innerHTML = `Select one hero for hero advice, or two for matchup advice. Battletags are optional.`;
  }
};

function getMatchupData() {
  dqs('#info-pane').innerHTML = `<p>Two heroes, ${leftHero} and ${rightHero}, have been set</p>` +
                                `${heroMatchupInfo[leftHero][rightHero]}`;
};
function getHeroData() {
  dqs('#info-pane').innerHTML = `Only one hero, ${leftHero || rightHero}, set\n` +
                                `${heroMatchupInfo[leftHero || rightHero].self}`;
};

let leftBattletagData = {};
let rightBattletagData = {};

async function getBattletagData(e) {
  let leftBattletag = document.getElementById('left-battletag').value.replace("#", "-");
  let rightBattletag = document.getElementById('right-battletag').value.replace("#", "-");
  console.log(`${leftBattletag} + ${rightBattletag}`);

  if (leftBattletag && rightBattletag) {
    leftBattletagData = await loadBattletag(leftBattletag); console.log(leftBattletagData);
    rightBattletagData = await loadBattletag(rightBattletag); console.log(rightBattletagData);
  } else if (leftBattletag && !rightBattletag) {
    leftBattletagData = await loadBattletag(leftBattletag); console.log(leftBattletagData);
  } else if (!leftBattletag && rightBattletag) {
    rightBattletagData = await loadBattletag(rightBattletag); console.log(rightBattletagData);
  }
}

function loadBattletag(battletag) {
  return axios.get(`https://owapi.net/api/v3/u/${battletag}/blob`)
  .then(function (response) {
    console.log(response);
    return response.data;
  })
  .catch(function (error) {
    console.log(error);
    dqs('#info-pane').innerHTML = `Your request for the battletag ${battletag.replace("-", "#")} failed. Make sure the battletag is correct or clear the field.`;
  });
}

let heroMatchupInfo = {
  doomfist: {
    self: "<p>Info about Doomfist</p>",
    doomfist: "<p>Stay out of your way</p>",
    bastion: "<p>Doomfist vs Bastion</p>" }
};

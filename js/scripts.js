'use strict';

const dqs = (query) => document.querySelector(query);
const dqsa = (query) => document.querySelectorAll(query);

  document.addEventListener('DOMContentLoaded', function () {
    dqsa('.left-heroes .hero-item').forEach(clickLeftHero => clickLeftHero.addEventListener('click', setLeftHero));
  });

  document.addEventListener('DOMContentLoaded', function () {
    dqsa('.right-heroes .hero-item').forEach(clickRightHero => clickRightHero.addEventListener('click', setRightHero));
  });

let leftHero = "";
let rightHero = "";
dqs('#info-pane').innerHTML = `Select one hero for hero advice, or two for matchup advice.`;

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
          dqs('#info-pane').innerHTML = `Select one hero for hero advice, or two for matchup advice.`;
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

let heroMatchupInfo = {
  doomfist: {
    self: "<p>Info about Doomfist</p>",
    doomfist: "<p>Stay out of your way</p>",
    bastion: "<p>Doomfist vs Bastion</p>" }
};

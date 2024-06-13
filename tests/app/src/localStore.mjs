export let articleDelay =
  localStorage.articleDelay === undefined
    ? 800
    : parseInt(localStorage.articleDelay);
export let categoryDelay =
  localStorage.categoryDelay === undefined
    ? 600
    : parseInt(localStorage.categoryDelay);
export let showState =
  localStorage.showState === undefined ? false : localStorage.showState;

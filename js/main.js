/* Свійські птахи Вінниччини - інтерактивність усіх сторінок (без бібліотек) */
'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- банер: стала швидкість ходи птахів на будь-якій ширині екрана ---------- */
const flock = $('.flock');
if (flock) {
  const SPEED = 60; // пікселів за секунду
  const setSpeed = () => {
    const dist = flock.parentElement.clientWidth + flock.clientWidth;
    flock.style.setProperty('--walk', (dist / SPEED).toFixed(1) + 's');
  };
  setSpeed();
  window.addEventListener('resize', setSpeed);
}

/* ---------- птахи: картки, що перевертаються ---------- */
$$('.flip').forEach(card => {
  const [front, back] = $$('.flip-face', card);
  back.inert = true;
  card.addEventListener('click', e => {
    if (e.target.closest('a')) return; // посилання на статтю не перевертає картку
    const flipped = card.classList.toggle('is-flipped');
    front.inert = flipped;
    back.inert = !flipped;
    $('.hint', flipped ? back : front).focus({ preventScroll: true });
  });
});

/* ---------- вікторина ---------- */
const QUIZ = [
  { img: 'goose', q: 'Чий це силует?', a: ['Гуска', 'Качка', 'Голуб', 'Індик'], r: 0,
    e: 'Довга шия і масивний тулуб – це гуска.' },
  { q: 'Скільки днів курка насиджує яйця?', a: ['18', '21', '28', '35'], r: 1,
    e: 'Курчата вилуплюються на 21-й день.' },
  { img: 'turkey', q: 'Чий це силует?', a: ['Курка', 'Гуска', 'Індик', 'Качка'], r: 2,
    e: 'Хвіст віялом – візитівка індика.' },
  { q: 'Хто здавна вважається «сторожем» подвір\'я?', a: ['Голуб', 'Гуска', 'Курка', 'Качка'], r: 1,
    e: 'Гуси гучно ґелґочуть, щойно побачать чужих.' },
  { img: 'duck', q: 'Чий це силует?', a: ['Голуб', 'Курка', 'Індик', 'Качка'], r: 3,
    e: 'Плаский широкий дзьоб видає качку.' },
  { q: 'Чиїх пташенят батьки вигодовують зобним «молочком»?', a: ['Голуба', 'Індика', 'Гуски', 'Курки'], r: 0,
    e: 'Зобне «молочко» виробляють і голуб, і голубка.' },
  { img: 'hen', q: 'Чий це силует?', a: ['Індик', 'Курка', 'Гуска', 'Голуб'], r: 1,
    e: 'Гребінець і хвіст, піднятий догори, – це курка.' },
  { q: 'Яка птиця може знести 250–300 яєць на рік?', a: ['Гуска', 'Індик', 'Курка', 'Голуб'], r: 2,
    e: 'Найкращі несучки серед курей дають до 300 яєць на рік.' },
  { img: 'guinea', q: 'Чий це силует?', a: ['Перепілка', 'Індик', 'Цесарка', 'Курка'], r: 2,
    e: 'Округлий тулуб, маленька голова з «шоломом» – це цесарка.' },
  { q: 'Яка птиця починає нестися вже у 6–7 тижнів?', a: ['Цесарка', 'Гуска', 'Курка', 'Перепілка'], r: 3,
    e: 'Перепілки дорослішають швидше за всіх свійських птахів.' },
];
const qBody = $('#q-body');
if (qBody) {
  let n = 0, score = 0;
  const show = () => {
    $('#q-num').textContent = `Запитання ${n + 1} з ${QUIZ.length}`;
    $('#q-score').textContent = `Бали: ${score}`;
    const item = QUIZ[n];
    qBody.innerHTML =
      (item.img ? `<img class="silhouette" src="images/${item.img}.svg" width="180" height="180" alt="Силует птаха">` : '') +
      `<h2>${item.q}</h2><div class="options">` +
      item.a.map((t, i) => `<button class="btn" type="button" data-i="${i}">${t}</button>`).join('') +
      `</div><p class="feedback" aria-live="polite"></p>`;
    $$('.options .btn', qBody).forEach(btn => btn.addEventListener('click', () => answer(+btn.dataset.i)));
  };
  const answer = i => {
    const item = QUIZ[n];
    const btns = $$('.options .btn', qBody);
    btns.forEach(b => { b.disabled = true; });
    btns[item.r].classList.add('right');
    if (i === item.r) score++; else btns[i].classList.add('wrong');
    $('#q-score').textContent = `Бали: ${score}`;
    $('.silhouette', qBody)?.style.setProperty('filter', 'none'); // показуємо птаха в кольорі
    $('.feedback', qBody).textContent = (i === item.r ? 'Правильно! ' : 'Не зовсім. ') + item.e;
    const next = document.createElement('button');
    next.className = 'btn btn-primary';
    next.type = 'button';
    next.textContent = n + 1 < QUIZ.length ? 'Далі' : 'Результат';
    next.addEventListener('click', () => { n++; n < QUIZ.length ? show() : finish(); });
    qBody.append(next);
    next.focus();
  };
  const finish = () => {
    $('#q-num').textContent = 'Вікторину завершено';
    const msg = score === QUIZ.length ? 'Справжній знавець подвір\'я!'
      : score >= QUIZ.length / 2 ? 'Гарний результат! Птахи вами пишаються.'
      : 'Варто ще раз зазирнути на сторінку «Птахи».';
    qBody.innerHTML = `<h2>${score} з ${QUIZ.length}</h2><p>${msg}</p>` +
      '<div class="btn-row"><button class="btn btn-primary" type="button" id="q-again">Спробувати ще раз</button>' +
      '<a class="btn" href="birds.html">До карток птахів</a></div>';
    $('#q-again').addEventListener('click', () => { n = 0; score = 0; show(); });
  };
  show();
}

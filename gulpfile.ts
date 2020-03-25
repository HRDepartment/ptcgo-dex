import gulp from 'gulp';
import consola from 'consola';

consola.wrapConsole();

for (const task of ['translation-strings', 'families', 'expansions', 'items', 'decode']) {
  gulp.task(task, require(`./tasks/${task}`).default);
}

gulp.task('dex', gulp.series('translation-strings', 'families', 'expansions', 'items'));

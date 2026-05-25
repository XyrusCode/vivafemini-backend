/**
 * lint-staged config using functions so that tsc is called WITHOUT staged
 * filenames appended — when tsc receives file arguments it ignores tsconfig.json,
 * causing path-alias and decorator resolution to fail.
 */
export default {
  '*.ts': (filenames) => [
    `eslint --fix ${filenames.join(' ')}`,
    'tsc -p tsconfig.json --noEmit --skipLibCheck',
  ],
};

<a name="0.5.5"></a>
## [0.5.5](https://github.com/ulivz/vuepress-plugin-yuque/compare/v0.5.4...v0.5.5) (2019-04-05)


### Bug Fixes

* typo ([2a0b86b](https://github.com/ulivz/vuepress-plugin-yuque/commit/2a0b86b))



<a name="0.5.4"></a>
## [0.5.4](https://github.com/ulivz/vuepress-plugin-yuque/compare/v0.5.3...v0.5.4) (2019-04-05)


### Bug Fixes

* ## ... shouldn't be considered as title ([f30c893](https://github.com/ulivz/vuepress-plugin-yuque/commit/f30c893))



<a name="0.5.3"></a>
## [0.5.3](https://github.com/ulivz/vuepress-plugin-yuque/compare/v0.5.2...v0.5.3) (2019-04-05)


### Bug Fixes

* **html:** table's styles cannot be removed ([1035eb3](https://github.com/ulivz/vuepress-plugin-yuque/commit/1035eb3))



<a name="0.5.2"></a>
## [0.5.2](https://github.com/ulivz/vuepress-plugin-yuque/compare/v0.5.1...v0.5.2) (2019-04-05)


### Bug Fixes

* **html:** need to escape twice ([923b31a](https://github.com/ulivz/vuepress-plugin-yuque/commit/923b31a))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/ulivz/vuepress-plugin-yuque/compare/v0.5.0...v0.5.1) (2019-04-05)


### Bug Fixes

* **html:** regression of escape html in code ([8f638e3](https://github.com/ulivz/vuepress-plugin-yuque/commit/8f638e3))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/ulivz/vuepress-plugin-yuque/compare/v0.4.0...v0.5.0) (2019-04-05)


### Features

* **$core:** bump vuepress-plugin-medium ([cce0e73](https://github.com/ulivz/vuepress-plugin-yuque/commit/cce0e73))
* **html:** remove html tags in code and remove table styles ([fe75e46](https://github.com/ulivz/vuepress-plugin-yuque/commit/fe75e46))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/ulivz/vuepress-plugin-yuque/compare/v0.3.1...v0.4.0) (2019-04-05)


### Features

* **$core:** functional source option (using markdown when return 'markdown') ([5ef63cd](https://github.com/ulivz/vuepress-plugin-yuque/commit/5ef63cd))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/ulivz/vuepress-plugin-yuque/compare/v0.3.0...v0.3.1) (2019-02-14)


### Bug Fixes

* **$core:** cannot use correct api base url for custom yuque domain ([818343e](https://github.com/ulivz/vuepress-plugin-yuque/commit/818343e))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/ulivz/vuepress-plugin-yuque/compare/v0.2.1...v0.3.0) (2019-02-11)


### Bug Fixes

* **$core:** throw error when toc's length is 1 ([df4e48c](https://github.com/ulivz/vuepress-plugin-yuque/commit/df4e48c))


### Features

* **$toc:** always set top-level node to branch node instead of leaf node ([44216dd](https://github.com/ulivz/vuepress-plugin-yuque/commit/44216dd))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/ulivz/vuepress-plugin-yuque/compare/v0.2.0...v0.2.1) (2019-02-11)


### Bug Fixes

* **$core:** cannot fetch data from private repo (close: [#2](https://github.com/ulivz/vuepress-plugin-yuque/issues/2)) ([a59c420](https://github.com/ulivz/vuepress-plugin-yuque/commit/a59c420))
* **$core:** throw error since "prettify" doesn't check null (close: [#1](https://github.com/ulivz/vuepress-plugin-yuque/issues/1)) ([1110274](https://github.com/ulivz/vuepress-plugin-yuque/commit/1110274))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/ulivz/vuepress-plugin-yuque/compare/v0.1.0...v0.2.0) (2019-02-08)


### Bug Fixes

* **$core:** changing repoUrl under dev doesn't take effect ([93e0c06](https://github.com/ulivz/vuepress-plugin-yuque/commit/93e0c06))
* **$core:** empty node: Cannot read property 'format' of undefined ([3c0c3bc](https://github.com/ulivz/vuepress-plugin-yuque/commit/3c0c3bc))
* **$toc:** using safe pop to avoid empty stack ([6eb19b4](https://github.com/ulivz/vuepress-plugin-yuque/commit/6eb19b4))


### Features

* **$core:** enable .html suffix by default ([9a5167f](https://github.com/ulivz/vuepress-plugin-yuque/commit/9a5167f))



<a name="0.1.0"></a>
# 0.1.0 (2019-02-08)


### Bug Fixes

* **$fetch:** cannot save cache properly ([4b21277](https://github.com/ulivz/vuepress-plugin-yuque/commit/4b21277))


### Features

* **$core:** `authToken` option ([e953197](https://github.com/ulivz/vuepress-plugin-yuque/commit/e953197))
* **$core:** `html` option ([185fcab](https://github.com/ulivz/vuepress-plugin-yuque/commit/185fcab))
* **$core:** `home` option and default title and description ([7b2505d](https://github.com/ulivz/vuepress-plugin-yuque/commit/7b2505d))
* **$core:** enable `medium-zoom` by default ([3538cc8](https://github.com/ulivz/vuepress-plugin-yuque/commit/3538cc8))
* **$core:** handle uncreated page ([5665483](https://github.com/ulivz/vuepress-plugin-yuque/commit/5665483))
* **$fetch:** env: `SKIP_CACHE` and `AUTH_TOKEN` ([c0530d9](https://github.com/ulivz/vuepress-plugin-yuque/commit/c0530d9))
* **$toc:** push branch node when the depth of last node is 1 ([8809986](https://github.com/ulivz/vuepress-plugin-yuque/commit/8809986))
* **$html:** extract headers from yuque's HTML markups ([88900ae](https://github.com/ulivz/vuepress-plugin-yuque/commit/88900ae))
* **$html:** highlight code fence block at build time ([475448b](https://github.com/ulivz/vuepress-plugin-yuque/commit/475448b))
* **$core:** leverage "html content" by default for now ([85801e7](https://github.com/ulivz/vuepress-plugin-yuque/commit/85801e7))
* **$fetch:** only enable cache under dev mode ([98cc5d1](https://github.com/ulivz/vuepress-plugin-yuque/commit/98cc5d1))
* **$core:** `repoUrl` option ([81d07dd](https://github.com/ulivz/vuepress-plugin-yuque/commit/81d07dd))
* **$core:** use page's default format ([7b41867](https://github.com/ulivz/vuepress-plugin-yuque/commit/7b41867))




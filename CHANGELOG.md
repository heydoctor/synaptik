# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 2.1.2 (2020-10-09)

### [2.1.1](https://github.com/heydoctor/synaptik/compare/v2.1.0...v2.1.1) (2020-05-29)


### Bug Fixes

* Remove optional annotation for store and state fields ([#26](https://github.com/heydoctor/synaptik/issues/26)) ([fa9f298](https://github.com/heydoctor/synaptik/commit/fa9f298a184fd5e339402574f6b27adc8fdcd1ac))

## [2.1.0](https://github.com/heydoctor/synaptik/compare/v2.0.1...v2.1.0) (2020-05-29)


### Features

* Move Synapse into createSynaptik to reduce typing noise ([#25](https://github.com/heydoctor/synaptik/issues/25)) ([c33af9e](https://github.com/heydoctor/synaptik/commit/c33af9e95f33e4cc7783994cb64053dfc4aff0b8))

### [2.0.1](https://github.com/heydoctor/synaptik/compare/v2.0.0...v2.0.1) (2020-05-27)


### Bug Fixes

* Fix setState race condition ([#24](https://github.com/heydoctor/synaptik/issues/24)) ([8cde514](https://github.com/heydoctor/synaptik/commit/8cde51477d5d24c95a129005c8764a621ead5e87))

## [2.0.0](https://github.com/heydoctor/synaptik/compare/v1.3.2...v2.0.0) (2020-05-22)


### ⚠ BREAKING CHANGES

* removes `<Connect />` component 
* changes how the store provider and hooks are created

### Features

* Add Typescript support to Synaptik ([#22](https://github.com/heydoctor/synaptik/issues/22)) ([51c17c2](https://github.com/heydoctor/synaptik/commit/51c17c2acb699f69f4d293d395d6161f059d458d))

<a name="1.3.2"></a>
## [1.3.2](https://github.com/sappira-inc/synaptik/compare/v1.3.0...v1.3.2) (2020-04-21)


### Bug Fixes

* Forward ref in [@connect](https://github.com/connect) ([c199974](https://github.com/sappira-inc/synaptik/commit/c199974))



<a name="1.3.1"></a>
## [1.3.1](https://github.com/sappira-inc/synaptik/compare/v1.3.0...v1.3.1) (2020-02-07)


### Bug Fixes

* Forward ref in [@connect](https://github.com/connect) ([c199974](https://github.com/sappira-inc/synaptik/commit/c199974))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/sappira-inc/synaptik/compare/v1.1.0...v1.3.0) (2020-01-11)


### Bug Fixes

* **useSynapse:** Fix infinite loop when selector returns impure object ([#13](https://github.com/sappira-inc/synaptik/issues/13)) ([ab7c850](https://github.com/sappira-inc/synaptik/commit/ab7c850))
* **useSynapse:** Run useEffect on every render ([#10](https://github.com/sappira-inc/synaptik/issues/10)) ([9ad6cdb](https://github.com/sappira-inc/synaptik/commit/9ad6cdb))
* **useSynapse:** Update to latest state before re-subscribing ([#12](https://github.com/sappira-inc/synaptik/issues/12)) ([48df6cd](https://github.com/sappira-inc/synaptik/commit/48df6cd))
* Move logger into src/ for proper bundling ([#18](https://github.com/sappira-inc/synaptik/issues/18)) ([5706404](https://github.com/sappira-inc/synaptik/commit/5706404))


### Features

* hook support via useSynapse ([#7](https://github.com/sappira-inc/synaptik/issues/7)) ([3dcb379](https://github.com/sappira-inc/synaptik/commit/3dcb379))



<a name="1.2.3"></a>
## [1.2.3](https://github.com/sappira-inc/synaptik/compare/v1.2.2...v1.2.3) (2019-03-19)


### Bug Fixes

* **useSynapse:** Fix infinite loop when selector returns impure object ([#13](https://github.com/sappira-inc/synaptik/issues/13)) ([ab7c850](https://github.com/sappira-inc/synaptik/commit/ab7c850))



<a name="1.2.2"></a>
## [1.2.2](https://github.com/sappira-inc/synaptik/compare/v1.2.1...v1.2.2) (2019-03-18)


### Bug Fixes

* **useSynapse:** Update to latest state before re-subscribing ([#12](https://github.com/sappira-inc/synaptik/issues/12)) ([48df6cd](https://github.com/sappira-inc/synaptik/commit/48df6cd))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/sappira-inc/synaptik/compare/v1.2.0...v1.2.1) (2019-03-04)


### Bug Fixes

* **useSynapse:** Run useEffect on every render ([#10](https://github.com/sappira-inc/synaptik/issues/10)) ([9ad6cdb](https://github.com/sappira-inc/synaptik/commit/9ad6cdb))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/sappira-inc/synaptik/compare/v1.1.0...v1.2.0) (2019-02-27)


### Features

* hook support via useSynapse ([#7](https://github.com/sappira-inc/synaptik/issues/7)) ([3dcb379](https://github.com/sappira-inc/synaptik/commit/3dcb379))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/sappira-inc/synaptik/compare/v1.0.1...v1.1.0) (2019-01-08)


### Features

* **Connect:** Convert back to PureComponent ([ec5466d](https://github.com/sappira-inc/synaptik/commit/ec5466d))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/sappira-inc/synaptik/compare/v0.5.1...v0.6.0) (2018-10-13)


### Bug Fixes

* **Store:** Set state to empty object on construction ([5a7c5a5](https://github.com/sappira-inc/synaptik/commit/5a7c5a5))


### Features

* **Connect:** Access props as second argument in HOC select method ([#5](https://github.com/sappira-inc/synaptik/issues/5)) ([850d325](https://github.com/sappira-inc/synaptik/commit/850d325))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/sappira-inc/synaptik/compare/v0.5.0...v0.5.1) (2018-09-10)


### Bug Fixes

* **Connect:** Pass props to all methods ([587356a](https://github.com/sappira-inc/synaptik/commit/587356a))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/sappira-inc/synaptik/compare/v0.4.3...v0.5.0) (2018-09-10)


### Bug Fixes

* add tests for Vault and Store ([4b8b502](https://github.com/sappira-inc/synaptik/commit/4b8b502))


### Features

* New connect hoc ([4f264f4](https://github.com/sappira-inc/synaptik/commit/4f264f4))



<a name="0.4.3"></a>
## [0.4.3](https://github.com/sappira-inc/synaptik/compare/v0.4.2...v0.4.3) (2018-06-04)


### Bug Fixes

* Skip logging state change in initial Store construction ([f46abc1](https://github.com/sappira-inc/synaptik/commit/f46abc1))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/sappira-inc/synaptik/compare/v0.4.1...v0.4.2) (2018-04-30)


### Bug Fixes

* **logger:** collapse log groups ([6058750](https://github.com/sappira-inc/synaptik/commit/6058750))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/sappira-inc/synaptik/compare/v0.4.0...v0.4.1) (2018-04-30)


### Bug Fixes

* **logger:** use cjs ([fa04097](https://github.com/sappira-inc/synaptik/commit/fa04097))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/sappira-inc/synaptik/compare/v0.3.0...v0.4.0) (2018-04-30)


### Bug Fixes

* **Connect:** remove unneceessary call to getObservedState ([b76a692](https://github.com/sappira-inc/synaptik/commit/b76a692))
* **Vault:** respect log flag ([988c107](https://github.com/sappira-inc/synaptik/commit/988c107))


### Features

* **Provider:** pass in a logger function instead of monkey patching Vault and Store prototypes ([6f267be](https://github.com/sappira-inc/synaptik/commit/6f267be))
* **Store:** return a promise from setState ([a49d451](https://github.com/sappira-inc/synaptik/commit/a49d451))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/sappira-inc/synaptik/compare/v0.2.6...v0.3.0) (2018-04-28)


### Features

* **Connect:** Connect extends from PureComponent ([6e5678b](https://github.com/sappira-inc/synaptik/commit/6e5678b))



<a name="0.2.6"></a>
## [0.2.6](https://github.com/sappira-inc/synaptik/compare/v0.2.5...v0.2.6) (2018-04-28)


### Bug Fixes

* undo that ([8fa2789](https://github.com/sappira-inc/synaptik/commit/8fa2789))



<a name="0.2.5"></a>
## [0.2.5](https://github.com/sappira-inc/synaptik/compare/v0.2.4...v0.2.5) (2018-04-28)



<a name="0.2.4"></a>
## [0.2.4](https://github.com/sappira-inc/synaptik/compare/v0.2.3...v0.2.4) (2018-04-28)


### Bug Fixes

* Connect should update when props change ([ec0c009](https://github.com/sappira-inc/synaptik/commit/ec0c009))



<a name="0.2.3"></a>
## [0.2.3](https://github.com/sappira-inc/synaptik/compare/v0.2.2...v0.2.3) (2018-04-28)


### Bug Fixes

* export Vault ([7e6c7e5](https://github.com/sappira-inc/synaptik/commit/7e6c7e5))



<a name="0.2.2"></a>

## [0.2.2](https://github.com/sappira-inc/synaptik/compare/v0.2.1...v0.2.2) (2018-04-28)

### Bug Fixes

* add debug module ([da3e7b8](https://github.com/sappira-inc/synaptik/commit/da3e7b8))

<a name="0.2.1"></a>

## [0.2.1](https://github.com/sappira-inc/synaptik/compare/v0.2.0...v0.2.1) (2018-04-28)

<a name="0.2.0"></a>

# [0.2.0](https://github.com/sappira-inc/synaptik/compare/v0.1.1...v0.2.0) (2018-04-28)

### Features

* consolidate into one file ([c999364](https://github.com/sappira-inc/synaptik/commit/c999364))
* **Store:** make setState run async ([5a876ba](https://github.com/sappira-inc/synaptik/commit/5a876ba))

<a name="0.1.1"></a>

## 0.1.1 (2018-04-28)

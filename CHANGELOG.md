# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.6.1](https://github.com/Zooz/predator-runner/compare/v1.6.0...v1.6.1) (2021-02-22)


### Bug Fixes

* improve log when bad predator-runner version ([44864f8](https://github.com/Zooz/predator-runner/commit/44864f8eb085e858362d5c29bc79fa802c6e8070))

## [1.6.0](https://github.com/Zooz/predator-runner/compare/v1.5.3...v1.6.0) (2021-02-15)


### Bug Fixes

* remove ENVIRONMENT from mandatory variables ([ae1a387](https://github.com/Zooz/predator-runner/commit/ae1a387c97f2cf418c0db748c55779e5c843f16b))
* rename bucket_sizes to buckets_sizes ([e16a596](https://github.com/Zooz/predator-runner/commit/e16a596ad87f65681643212233ebd12b978251a2))
* **runner:** stop runner if test time exceeds the duration given ([#53](https://github.com/Zooz/predator-runner/issues/53)) ([387b552](https://github.com/Zooz/predator-runner/commit/387b5524095254efd215a662f0e98c63a5eeaee4))
* **scenario:** allow 0 weights - build with new artilliery ([b25efbe](https://github.com/Zooz/predator-runner/commit/b25efbefbf571ee154ab52e18831e93573ed49a5))
* vulnerabilities ([#55](https://github.com/Zooz/predator-runner/issues/55)) ([f66b592](https://github.com/Zooz/predator-runner/commit/f66b5924c12e8d3b9770566e3fb65587c6b7a44e))

### [1.5.3](https://github.com/Zooz/predator-runner/compare/v1.5.2...v1.5.3) (2020-09-25)

### [1.5.2](https://github.com/Zooz/predator-runner/compare/v1.5.0...v1.5.2) (2020-09-23)

## [1.5.0](https://github.com/Zooz/predator-runner/compare/v1.4.1...v1.5.0) (2020-09-20)


### Features

* **assertions:** Support assertion using artillery ([#44](https://github.com/Zooz/predator-runner/issues/44)) ([9371968](https://github.com/Zooz/predator-runner/commit/93719684492b32beb8c71e6416d3a89cce01f882))
* **captures:** support xpath captures ([fef6e54](https://github.com/Zooz/predator-runner/commit/fef6e541220c00f2c2c10c51c8db7ba518df0bc3))
* **functional-test:** add functional-test support ([#34](https://github.com/Zooz/predator-runner/issues/34)) ([7dab8a1](https://github.com/Zooz/predator-runner/commit/7dab8a1736bb1e803fe29d9227b5e23555f78b5b))
* **metrics:** support metrics of reuqest phase duration ([#41](https://github.com/Zooz/predator-runner/issues/41)) ([1fcb7b7](https://github.com/Zooz/predator-runner/commit/1fcb7b7d1cf3826c6f97137a7bdd492cb76d59a5))
* **metrics:** support request name on stats ([292e456](https://github.com/Zooz/predator-runner/commit/292e4569f8d93ea8aba8a2679382e38a1c0dbb8e))


### Bug Fixes

* job config ([#43](https://github.com/Zooz/predator-runner/issues/43)) ([0649271](https://github.com/Zooz/predator-runner/commit/0649271082af2a681e7a6acb2bf0ea54dcbf55b3))
* **assertions:** User expect plugin only when assertions exist in test ([#45](https://github.com/Zooz/predator-runner/issues/45)) ([c67710a](https://github.com/Zooz/predator-runner/commit/c67710a90aa6277a368954b41288b6c45c100b83))
* **metrics:** Add missing influx plugin ([#47](https://github.com/Zooz/predator-runner/issues/47)) ([8ebc248](https://github.com/Zooz/predator-runner/commit/8ebc248a0ed6c5e840ead330c8b08ab915ae3bad))

### [1.4.1](https://github.com/Zooz/predator-runner/compare/v1.4.0...v1.4.1) (2020-08-13)


### Bug Fixes

* **dockerfile:** remove user nobody to allow download files ([32f1488](https://github.com/Zooz/predator-runner/commit/32f1488436b0162a922e7b30d1b28a470755b8c8))
* **dockerfile:** remove user nobody to allow download files ([be5c7b1](https://github.com/Zooz/predator-runner/commit/be5c7b137490d49319b572692c6d43c0a6b676e5))
* **dockerfile:** remove user nobody to allow download files ([a676d3d](https://github.com/Zooz/predator-runner/commit/a676d3d198f7d7373260bbd6b3372d1102bbae66))

## [1.4.0](https://github.com/Zooz/predator-runner/compare/v1.3.1...v1.4.0) (2020-07-23)


### Bug Fixes

* **dockerfile:** add user nobody to dockerfile ([#37](https://github.com/Zooz/predator-runner/issues/37)) ([0d9e577](https://github.com/Zooz/predator-runner/commit/0d9e577c01569645109ee89ab73142789922d1ac))
* package.json & package-lock.json to reduce vulnerabilities ([#40](https://github.com/Zooz/predator-runner/issues/40)) ([e1a00eb](https://github.com/Zooz/predator-runner/commit/e1a00eb15f2c7381b3a16006d5f6adace2da11a4))

### [1.3.1](https://github.com/Zooz/predator-runner/compare/v1.3.0...v1.3.1) (2020-04-16)


### Features

* **metrics:** support custom prometheus labels ([#30](https://github.com/Zooz/predator-runner/issues/30)) ([9f2565b](https://github.com/Zooz/predator-runner/commit/9f2565b))



## [1.3.0](https://github.com/Zooz/predator-runner/compare/v1.2.0...v1.3.0) (2020-04-01)


### Bug Fixes

* **http:** setting backoffBase to 1000ms ([#28](https://github.com/Zooz/predator-runner/issues/28)) ([7fce6e4](https://github.com/Zooz/predator-runner/commit/7fce6e4))


### Features

* **processor:** in memory processor file ([#29](https://github.com/Zooz/predator-runner/issues/29)) ([2c44767](https://github.com/Zooz/predator-runner/commit/2c44767))



## [1.2.0](https://github.com/Zooz/predator-runner/compare/v1.1.7...v1.2.0) (2020-01-06)


### Bug Fixes

* **vulnerabilities:** update hapi to v18.4.0 ([#23](https://github.com/Zooz/predator-runner/issues/23)) ([4fd7a59](https://github.com/Zooz/predator-runner/commit/4fd7a59))



### [1.1.7](https://github.com/Zooz/predator-runner/compare/v1.1.6...v1.1.7) (2019-08-27)


### Bug Fixes

* **influx:** fix influx plugin name ([#22](https://github.com/Zooz/predator-runner/issues/22)) ([1f74783](https://github.com/Zooz/predator-runner/commit/1f74783))



### [1.1.6](https://github.com/Zooz/predator-runner/compare/v1.1.5...v1.1.6) (2019-07-21)



### [1.1.5](https://github.com/Zooz/predator-runner/compare/v1.1.4...v1.1.5) (2019-06-27)



### [1.1.4](https://github.com/Zooz/predator-runner/compare/v1.1.3...v1.1.4) (2019-06-27)



### [1.1.3](https://github.com/Zooz/predator-runner/compare/v1.1.2...v1.1.3) (2019-06-27)



### [1.1.2](https://github.com/Zooz/predator-runner/compare/v1.1.1...v1.1.2) (2019-05-26)



### [1.1.1](https://github.com/Zooz/predator-runner/compare/v1.1.0...v1.1.1) (2019-05-16)



<a name="1.1.0"></a>
## [1.1.0](https://github.com/Zooz/predator-runner/compare/v1.0.7...v1.1.0) (2019-05-16)
### Features

* **processor:** support custom-js files ([#14](https://github.com/Zooz/predator-runner/pull/14)) ([b6a7b029b984ade31ff0b9bf5575cd986157fc55](https://github.com/Zooz/predator-runner/commit/b6a7b029b984ade31ff0b9bf5575cd986157fc55))


### [1.0.7](https://github.com/Zooz/predator-runner/compare/v1.0.6...v1.0.7) (2019-05-06)



<a name="1.0.6"></a>
## [1.0.6](https://github.com/Zooz/predator-runner/compare/v1.0.5...v1.0.6) (2019-04-18)


### Features

* **general:** remove final report ([#15](https://github.com/Zooz/predator-runner/issues/15)) ([3bac573](https://github.com/Zooz/predator-runner/commit/3bac573))



<a name="1.0.5"></a>
## [1.0.5](https://github.com/Zooz/predator-runner/compare/v1.0.4...v1.0.5) (2019-03-21)


### Bug Fixes

* **dockerfile:** fixing max_old_space_size to 1536mb ([dba8674](https://github.com/Zooz/predator-runner/commit/dba8674))
* **dockerfile:** fixing max_old_space_size to 1536mb ([6511368](https://github.com/Zooz/predator-runner/commit/6511368))


### Features

* **runner:** first_intermediate will be the phase_status of the first intermediate report ([32179ff](https://github.com/Zooz/predator-runner/commit/32179ff))



<a name="1.0.4"></a>
## [1.0.4](https://github.com/Zooz/predator-runner/compare/v1.0.3...v1.0.4) (2019-03-06)


### Bug Fixes

* **reports:** send runner_id when creating report ([#13](https://github.com/Zooz/predator-runner/issues/13)) ([04da97e](https://github.com/Zooz/predator-runner/commit/04da97e))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/Zooz/predator-runner/compare/v1.0.2...v1.0.3) (2019-02-26)


### Bug Fixes

* **jobConfig:** change max-virtual-users env name ([#11](https://github.com/Zooz/predator-runner/issues/11)) ([1a0c39a](https://github.com/Zooz/predator-runner/commit/1a0c39a))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/Zooz/predator-runner/compare/v1.0.1...v1.0.2) (2019-02-19)


### Bug Fixes

* **api-calls:** removing v1 from predator api calls ([91f51ba](https://github.com/Zooz/predator-runner/commit/91f51ba))
* **package.lock:** update prometheus plugin version ([ec3c786](https://github.com/Zooz/predator-runner/commit/ec3c786))
* **package.lock:** update prometheus plugin version ([c14b79f](https://github.com/Zooz/predator-runner/commit/c14b79f))



<a name="1.0.1"></a>
## 1.0.1 (2019-02-18)


### Bug Fixes

* change all service urls to predator_url ([#2](https://github.com/Zooz/predator-runner/issues/2)) ([5172c25](https://github.com/Zooz/predator-runner/commit/5172c25))
* **metrics:** METRICS_EXPORT_CONFIG expcted to be in base64 ([089102d](https://github.com/Zooz/predator-runner/commit/089102d))
* **runner:** phaes in config is not mandatory anymore ([c3ba037](https://github.com/Zooz/predator-runner/commit/c3ba037))


### Features

* **jobs:** added specificPlatformRunId param ([#4](https://github.com/Zooz/predator-runner/issues/4)) ([4548626](https://github.com/Zooz/predator-runner/commit/4548626))
* **runner:** adding runner for running Predator tests ([dfd785f](https://github.com/Zooz/predator-runner/commit/dfd785f))

import { TRS } from './TRS.js'

export class TRSUIHelper {
  #trs = new TRS()

  constructor() {}

  setTRS(trs: TRS) {
    this.#trs = trs
  }

  get translationX() {
    return this.#trs.translation[0]
  }

  set translationX(x) {
    this.#trs.translation[0] = x
  }

  get translationY() {
    return this.#trs.translation[1]
  }

  set translationY(x) {
    this.#trs.translation[1] = x
  }

  get translationZ() {
    return this.#trs.translation[2]
  }

  set translationZ(x) {
    this.#trs.translation[2] = x
  }

  get rotationX() {
    return this.#trs.rotation[0]
  }

  set rotationX(x) {
    this.#trs.rotation[0] = x
  }

  get rotationY() {
    return this.#trs.rotation[1]
  }

  set rotationY(x) {
    this.#trs.rotation[1] = x
  }

  get rotationZ() {
    return this.#trs.rotation[2]
  }

  set rotationZ(x) {
    this.#trs.rotation[2] = x
  }

  get scaleX() {
    return this.#trs.scale[0]
  }

  set scaleX(x) {
    this.#trs.scale[0] = x
  }

  get scaleY() {
    return this.#trs.scale[1]
  }

  set scaleY(x) {
    this.#trs.scale[1] = x
  }

  get scaleZ() {
    return this.#trs.scale[2]
  }

  set scaleZ(x) {
    this.#trs.scale[2] = x
  }
}

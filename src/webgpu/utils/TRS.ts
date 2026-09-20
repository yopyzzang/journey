import { mat4 } from './matrix.js'

export interface TRSParams {
  translation?: number[] | Float32Array
  rotation?: number[] | Float32Array
  scale?: number[] | Float32Array
}

export class TRS {
  translation: number[] | Float32Array<ArrayBuffer>
  rotation: number[] | Float32Array<ArrayBuffer>
  scale: number[] | Float32Array<ArrayBuffer>

  constructor({
    translation = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
  }: TRSParams = {}) {
    this.translation = new Float32Array(translation)
    this.rotation = new Float32Array(rotation)
    this.scale = new Float32Array(scale)
  }

  getMatrix(dst: Float32Array<ArrayBuffer>) {
    mat4.translation(this.translation, dst)
    mat4.rotateX(dst, this.rotation[0], dst)
    mat4.rotateY(dst, this.rotation[1], dst)
    mat4.rotateZ(dst, this.rotation[2], dst)
    mat4.scale(dst, this.scale, dst)

    return dst
  }
}

import { mat4 } from './matrix.js'

interface MatrixSource {
  getMatrix(dst: Float32Array<ArrayBuffer>): Float32Array<ArrayBuffer>
}

export class SceneGraphNode {
  name: string
  children: SceneGraphNode[] = []
  parent: SceneGraphNode | null = null
  localMatrix: Float32Array<ArrayBuffer>
  worldMatrix: Float32Array<ArrayBuffer>
  source: MatrixSource | null

  constructor(name: string, source: MatrixSource | null) {
    this.name = name
    this.children = []
    this.localMatrix = mat4.identity()
    this.worldMatrix = mat4.identity()
    this.source = source
  }

  find(name: string): SceneGraphNode | undefined {
    if (this.name === name) {
      return this
    }
    for (const child of this.children) {
      const found = child.find(name)
      if (found) {
        return found
      }
    }
    return undefined
  }

  addChild(child: SceneGraphNode) {
    child.setParent(this)
  }

  removeChild(child: SceneGraphNode) {
    child.setParent(null)
  }

  setParent(parent: SceneGraphNode | null) {
    if (this.parent) {
      const ndx = this.parent.children.indexOf(this)
      if (ndx >= 0) {
        this.parent.children.splice(ndx, 1)
      }
    }

    if (parent) {
      parent.children.push(this)
    }
    this.parent = parent
  }

  updateWorldMatrix() {
    this.source?.getMatrix(this.localMatrix)

    if (this.parent) {
      mat4.multiply(this.parent.worldMatrix, this.localMatrix, this.worldMatrix)
    } else {
      mat4.copy(this.localMatrix, this.worldMatrix)
    }

    this.children.forEach((child) => {
      child.updateWorldMatrix()
    })
  }
}

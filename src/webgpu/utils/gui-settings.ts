import GUI from './muigui.js'
import { TRS } from './TRS.js'
import { TRSUIHelper } from './TRS-UI-helper.js'
import { SceneGraphNode } from './scene-graph.js'

const radToDegOptions = {
  min: -360,
  max: 360,
  step: 1,
  converters: GUI.converters.radToDeg,
}

const cameraRadToDegOptions = {
  min: -360,
  max: 360,
  step: 1,
  converters: GUI.converters.radToDeg,
}

const threeSpaces = '\u00a0\u00a0\u00a0'
const barTwoSpaces = '\u00a0|\u00a0'
const plusDash = '\u00a0+-'
const kUnelected = '\u3000'
const kSelected = '➡️'
const prefixRE = new RegExp(`^(?:${kUnelected}|${kSelected})`)

const trsUIHelper = new TRSUIHelper()
const alwaysShow = new Set([0, 1, 2])

export function initGUI(
  root: SceneGraphNode,
  requestRender: Function,
  settings,
) {
  const gui = new GUI()
  gui.onChange(requestRender)
  gui.add(settings, 'cameraRotation', cameraRadToDegOptions)
  gui.add(settings, 'cameraTranslationX', -200, 200, 1)
  gui.add(settings, 'cameraTranslationY', -200, 200, 1)
  gui.add(settings, 'cameraTranslationZ', 1, 200, 1)
  gui.add(settings, 'showMeshNodes').onChange(showMeshNodes)
  gui.add(settings, 'showAllTRS').onChange(showTRS)
  gui.add(settings, 'animate').onChange((v: boolean) => {
    trsFolder.enable(!v)
  })

  const trsFolder = gui.addFolder('orientation')
  const trsControls = [
    trsFolder.add(trsUIHelper, 'rotationX', radToDegOptions),
    trsFolder.add(trsUIHelper, 'rotationY', radToDegOptions),
    trsFolder.add(trsUIHelper, 'rotationZ', radToDegOptions),
    trsFolder.add(trsUIHelper, 'translationX', -200, 200, 1),
    trsFolder.add(trsUIHelper, 'translationY', -200, 200, 1),
    trsFolder.add(trsUIHelper, 'translationZ', -200, 200, 1),
    trsFolder.add(trsUIHelper, 'scaleX', 0.1, 100),
    trsFolder.add(trsUIHelper, 'scaleY', 0.1, 100),
    trsFolder.add(trsUIHelper, 'scaleZ', 0.1, 100),
  ]
  const nodeFolder = gui.addFolder('nodes')
  const nodeButtons = addSceneGraphNodeToGUI(nodeFolder, root)

  // const animationFolder = gui.addFolder('animation')
  // const animationControls = [
  //   animationFolder.add(settings, 'animations', radToDegOptions),
  //   animationFolder.add(settings, 'animations', radToDegOptions),
  //   animationFolder.add(settings, 'animations', radToDegOptions),
  // ]

  function showTRS(show: boolean) {
    trsControls.forEach((trs, i) => {
      trs.show(show || alwaysShow.has(i))
    })
  }

  function showMeshNodes(show: boolean) {
    for (const { node, button } of nodeButtons) {
      if (node.name.includes('mesh')) {
        button.show(show)
      }
    }
  }

  function addButtonLeftJustified(gui: GUI, name: string, fn: Function) {
    const button = gui.addButton(name, fn)
    Object.assign(button.domElement.querySelector('button').style, {
      textAlign: 'left',
      fontFamily: 'monospace',
      whiteSpace: 'pre',
    })
    return button
  }

  function addSceneGraphNodeToGUI(
    gui: GUI,
    node: SceneGraphNode,
    last?: boolean,
    prefix?: string,
  ): FlatArray<any[], 1>[] {
    const nodes = []
    if (node.source instanceof TRS) {
      const label = `${prefix === undefined ? '' : `${prefix}${plusDash}`}${node.name}`
      nodes.push({
        button: addButtonLeftJustified(gui, label, () =>
          setCurrentSceneGraphNode(node),
        ),
        node,
      })
    }
    const childPrefix =
      prefix === undefined
        ? ''
        : `${prefix}${last ? threeSpaces : barTwoSpaces}`
    nodes.push(
      ...node.children.map((child, i) => {
        const childLast = i === node.children.length - 1
        return addSceneGraphNodeToGUI(gui, child, childLast, childPrefix)
      }),
    )
    return nodes.flat()
  }

  function setCurrentSceneGraphNode(node: SceneGraphNode) {
    if (node.source instanceof TRS) {
      trsUIHelper.setTRS(node.source)
    }
    trsFolder.name(`orientation: ${node.name}`)
    trsFolder.updateDisplay()

    for (const b of nodeButtons) {
      const name = b.button.getName().replace(prefixRE, '')
      b.button.name(`${b.node === node ? kSelected : kUnelected}${name}`)
    }
  }

  showMeshNodes(false)
  showTRS(false)
  setCurrentSceneGraphNode(root.children[0])
}

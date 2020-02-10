vtk Manual
===
\# 常用对象方法
```js
// actor
newInstance()
actor.setMapper(mapper)
actor.getProperty().setEdgeVisibility(true);
actor.getProperty().setEdgeColor(0, 1, 0);
actor.getProperty().setRepresentationToSurface();

//mapper
newInstance()
mapper.setInputConnection(arrowSource.getOutputPort());

//renderer
renderer.addActor(actor)
renderer.resetCamera()
renderer.resetCameraClippingRange();

//renderWindow
renderWindow.render()

//fullScreenRenderWindow
fullScreenRenderWindow.getRenderer()
fullScreenRenderWindow.getRenderWindow()
```
## vtk basic sources
官网文档中包含了11中基本的model，分别是：
* arrowSource
* ConcentricCylinderSource
* cone
* coneSource
* cubesource
* cylindersour
* celinesource
* linesource
* planesource
* pointsource
* SLICsource
* spheresource
除此之外，vtk也允许create class，自定义的constructor，class方法和默认参数。

### 基本的vtk实例
```js
import React, { Component } from 'react'

import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper'
import ConeSource from 'vtk.js/Sources/Filters/Sources/ConeSource'
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor'
import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';

class DOM extends Component{

  componentDidMount(){
    const cone = ConeSource.newInstance({ height: 2, radius: 1, resolution: 8, capping: false, direction: [0,1,0]})
    const mapper = vtkMapper.newInstance()
    const actor = vtkActor.newInstance()

    mapper.setInputConnection(cone.getOutputPort())
    actor.setMapper(mapper)

    const fullRenderer = vtkFullScreenRenderWindow.newInstance()
    const renderer = fullRenderer.getRenderer()
    renderer.addActor(actor)
    renderer.resetCamera()

    const rendererWindow = fullRenderer.getRenderWindow()
    rendererWindow.render()

    global.cone = cone
    global.ConeSource = ConeSource
  }

  render(){
    return null
  }
}

export default DOM
```
*#fullScreen模式*
这是一个创建在react组件化之上的coneSource实例，as a result，一个最基本的vtk视图从创建到渲染成功，分成下面几步：
* 通过`const cone = vtkConeSource.newInstance()`创建coneSource实例
* 通过`const mapper = vtkMapper.newInstance()`和`const actor = vtkActor.newInstance()`实例化mapper和actor
* 实例化一个`fullScreenRenderer`
* 通过fullScreenRenderer的两个方法，返回两个对象`renderer`和`renderWindow`
* 创建simple source pipeline
  * `mapper.setInputConnection(cone.getOutputPort())`
  * `actor.setMapper(mapper)`
  * `renderer.addActor(actor)`
  * `renderer.resetCamera()`
* 调用`renderWindow.render()`方法，启动webgl渲染器，开始渲染

## 通过chrome的console查看对象的属性和方法
```js
//console controls
      global.mapper = mapper;
      global.actor = actor;
      global.renderer = renderer;
      global.renderWindow = renderWindow;
      global.filter = filter
```
向全局注入变量，以便在console中查看方法名

## Calculator module

体现Calculator的实例，官方给出的example比较晦涩，建议用如下的例子来理解Calculator
```js
const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance();
      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();


      const coneSource = vtkConeSource.newInstance({ height: 1.0 });
      const filter = vtkCalculator.newInstance();

      filter.setInputConnection(coneSource.getOutputPort());
      filter.setFormula({
        getArrays: inputDataSets => ({
          input: [],
          output: [
            { location: FieldDataTypes.CELL, name: 'Random', dataType: 'Float32Array', attribute: AttributeTypes.SCALARS },
          ],
        }),
        evaluate: (arraysIn, arraysOut) => {
          const [scalars] = arraysOut.map(d => d.getData());
          for (let i = 0; i < scalars.length; i++) {
            scalars[i] = Math.random();
          }
        },
      });

      const mapper = vtkMapper.newInstance();
      mapper.setInputConnection(filter.getOutputPort());

      // ----------------------------------------------------------------------------
      // Console Zone
    //   console.log('filter', filter);
      // ----------------------------------------------------------------------------

      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);

      renderer.addActor(actor);
      renderer.resetCamera();
      // renderWindow.setContainer(querySelector('.container'))
      renderWindow.render();

      
      //console controls
      global.mapper = mapper;
      global.actor = actor;
      global.renderer = renderer;
      global.renderWindow = renderWindow;
      global.filter = filter

      // -----------------------------------------------------------
      // UI control handling
      // -----------------------------------------------------------

      fullScreenRenderer.addController(controlPanel);
      const representationSelector = document.querySelector('.representations');
      const resolutionChange = document.querySelector('.resolution');

      representationSelector.addEventListener('change', (e) => {
        const newRepValue = Number(e.target.value);
        actor.getProperty().setRepresentation(newRepValue);
        renderWindow.render();
      });

      resolutionChange.addEventListener('input', (e) => {
        const resolution = Number(e.target.value);
        coneSource.setResolution(resolution);
        renderWindow.render();

        const {dispatch} = this.props
        dispatch({
          type: 'submit',
          value: resolution
        })
        console.log(this.props.value);
      });
```
说白了，Calculator就是一个可以改变原class的对象，通过对原对象的定制可以返回一个新的对象，常用的方法有`setFormula`,`getFormula`和`setFormulaSimple`

calculator.getFormula().getArrays()在调用setFormula()之前是一个包含两个数组的对象(input和output)，其中output是一个空数组[].在调用set之后，output就变成了一个类似`{location: 3, name: "Random", dataType: "Float32Array", attribute: 0}`的数组。

而calculator在set后，就会return一个新的对象来替换之前的对象object，在后续操作中，只用output的calculator来操作即可，比如用`calculator.getOutputPort`来注入mapper。



## vtk中实例化的对象
vtk中,实例化的对象都是非常规的对象，没有包含的value，每一个key的type都是一个函数。这就要引出下面所讲的API文档中每一个方法的set/get

## set/get
这是一个缩写，意思是将某个属性的读写 。可以理解为write/read。
在vtk原文档中，由于上面所说的所有实例化的对象都没有属性值，全是方法。所以在方法中，以set开头的都是以写入新的属性值为主，return值为false或true。
以get开头的方法都是返回一个value，即可被变量获取到

## 为什么vtk中的对象的方法都有很多共有的方法？
在vtk的class的creation中，存在一个macro的class， 该类是所有actor等子类的基类，在macro.js文件中，定义了很多对macro类的操作的方法，比如`getOutputData`,`getOutputPort`等，其派生出的子类都拥有这些方法。

关于实例化对象的类型
---
一般实例化一个source，返回的对象的类型是object，但是是object下的vtkConeSource
而通过`coneSource.getOutputPort()()`返回的对象是object下定义的vtkPolyData。
查看一个变量的类型用`Object.getClassName()`来获取
验证一个变量的类型用`Obejct.isA()`来验证

`vtkConeSource`中的方法是官网构造函数中的参数
`vtkPolyData`中的方法是 set/get一些几何变量，比如：vertices,lines,polys

Calculator中evaluate的参数
---
在调用Calculator时，第二个参数有一些变量的约定，比如：`FieldDataTypes`,`AttributeTypes`,在源代码中是这样描述的：
```js
//node_modules\_vtk.js@13.5.0@vtk.js\Sources\Filters\General\Calculator\index.js
import { FieldDataTypes } from 'vtk.js/Sources/Common/DataModel/DataSet/Constants';
import { AttributeTypes } from 'vtk.js/Sources/Common/DataModel/DataSetAttributes/Constants';

```

```js
//vtk.js/Sources/Common/DataModel/DataSetAttributes/Constants
export const AttributeTypes = {
  SCALARS: 0,
  VECTORS: 1,
  NORMALS: 2,
  TCOORDS: 3,
  TENSORS: 4,
  GLOBALIDS: 5,
  PEDIGREEIDS: 6,
  EDGEFLAG: 7,
  NUM_ATTRIBUTES: 8,
};

export const AttributeLimitTypes = {
  MAX: 0,
  EXACT: 1,
  NOLIMIT: 2,
};

export const CellGhostTypes = {
  DUPLICATECELL: 1, // the cell is present on multiple processors
  HIGHCONNECTIVITYCELL: 2, // the cell has more neighbors than in a regular mesh
  LOWCONNECTIVITYCELL: 4, // the cell has less neighbors than in a regular mesh
  REFINEDCELL: 8, // other cells are present that refines it.
  EXTERIORCELL: 16, // the cell is on the exterior of the data set
  HIDDENCELL: 32, // the cell is needed to maintain connectivity, but the data values should be ignored.
};

export const PointGhostTypes = {
  DUPLICATEPOINT: 1, // the cell is present on multiple processors
  HIDDENPOINT: 2, // the point is needed to maintain connectivity, but the data values should be ignored.
};

export default {
  AttributeCopyOperations,
  AttributeLimitTypes,
  AttributeTypes,
  CellGhostTypes,
  DesiredOutputPrecision,
  PointGhostTypes,
  ghostArrayName,
};

```

在引入 `Calculator` 时引用，即可在组件中直接调用其属性值。

cutter
---
`Cutter`是一个展示一个plane在一个物体中的截面的切割对象。
使用时，需要在cutter中注入两个实例化的对象，来计算重合部分：
`cutter.setCutFunction(plane);`
`cutter.setInputConnection(cube.getOutputPort());`
plane需要的时model对象
cube需要的时data对象
结合的新对象cutter作为重合部分的model的数据源注入mapper
但这只是第一步，还需要把外部的cube也渲染进去
所以在加一层cube的pipeline
例子如下：
```js
const plane = vtkPlane.newInstance();
const cube = vtkCubeSource.newInstance();

const cutter = vtkCutter.newInstance();
cutter.setCutFunction(plane);
cutter.setInputConnection(cube.getOutputPort());

const cutMapper = vtkMapper.newInstance();
cutMapper.setInputConnection(cutter.getOutputPort());
const cutActor = vtkActor.newInstance();
cutActor.setMapper(cutMapper);
const cutProperty = cutActor.getProperty();
cutProperty.setRepresentation(vtkProperty.Representation.WIREFRAME);
cutProperty.setLighting(false);
cutProperty.setColor(0, 1, 0);
renderer.addActor(cutActor);

const cubeMapper = vtkMapper.newInstance();
cubeMapper.setInputConnection(cube.getOutputPort());
const cubeActor = vtkActor.newInstance();
cubeActor.setMapper(cubeMapper);
const cubeProperty = cubeActor.getProperty();
cubeProperty.setRepresentation(vtkProperty.Representation.WIREFRAME);
cubeProperty.setLighting(false);
renderer.addActor(cubeActor);

renderer.resetCamera();
```

imageMarchingCubes
---
作用在官方的Example中被很好的诠释，即计算一个volume的等值线值iso contour和contour轮廓值。并且通过ComputeNormals和mergePoints来处理边缘地带使得渲染结果更加细腻。可以通过Examples来观察其和原来的区别。

sampleFunction
---
`sampleFunction`是被用来获取volume边界和尺寸的采样函数
经常有两个方法：`sampleDimensions`和`modelBounds`分别获取volume的尺寸和边界，都具有set和get的方法。
比如一个包在cube中的Sphere，不断放大sphere的半径，重合部分的Volume不断缩小的过程。调用的过程如下：
```js
const sample = vtkSampleFunction.newInstance({
  implicitFunction: sphere,
  sampleDimensions: [50, 50, 50],
  modelBounds: [-0.5, 0.5, -0.5, 0.5, -0.5, 0.5],
});
```
调用在顶部引用vtkSampleFuntion方法，在实例化的过程中，要传入一个对象，该对象中包含有三个键值对，第一个`implicitFunction`是指定要被采样的volume对象，二三分别是指定volume的尺寸和在空间中的区域。  

但是该方法在单独使用调试的过程中没有work，如果需要用到的话，暂时需要加入上面提到的imageMarchingCubes的方法。

vtk的Shallow copy和deep copy
---
* js基本数据类型
在JavaScript中基本数据类型有String,Number,Undefined,Null,Boolean，在ES6中，又定义了一种新的基本数据类型Symbol,所以一共有6种

基本类型是按值访问的，从一个变量复制基本类型的值到另一个变量后这2个变量的值是完全独立的，即使一个变量改变了也不会影响到第二个变量

```js
var str1 = 'a';
var str2 = str1;
str2 = 'b';
console.log(str2); //'b'
console.log(str1); //'a'
```

* js引用数据类型

引用类型值是引用类型的实例，它是保存在堆内存中的一个对象，引用类型是一种数据结构，最常用的是Object,Array,Function类型，另外还有Date,RegExp,Error等，ES6同样也提供了Set,Map2种新的数据结构
JavaScript是如何复制引用类型的
JavaScript对于基本类型和引用类型的赋值是不一样的


当变量复制引用类型值的时候，同样和基本类型值一样会将变量的值复制到新变量上，不同的是对于变量的值，它是一个指针，指向存储在堆内存中的对象（JS规定放在堆内存中的对象无法直接访问，必须要访问这个对象在堆内存中的地址，然后再按照这个地址去获得这个对象中的值，所以引用类型的值是按引用访问）
```js

var obj1 = {a:1};
var ob2 = obj1;
obj2.a = 2;
console.log(obj1); //{a:2}
console.log(obj2); //{a:2}
在这里只修改了obj1中的a属性，却同时改变了ob1和obj2中的a属性
```
变量的值也就是这个指针是存储在栈上的，当变量obj1复制变量的值给变量obj2时，obj1,obj2只是一个保存在栈中的指针,指向同一个存储在堆内存中的对象，所以当通过变量obj1操作堆内存的对象时，obj2也会一起改变

* 浅拷贝
  >创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。
  * Object.assign({}, {}, {})
```js
  var target = {};
var source = {a:1};
Object.assign(target ,source);
console.log(target); //{a:1}
source.a = 2;
console.log(source); //{a:2}
console.log(target); //{a:1}
```
Object.assign是一个浅拷贝,它只是在根属性(对象的第一层级)创建了一个新的对象，但是对于属性的值是仍是对象的话依然是浅拷贝，

  * let a = [...b]
```js
var obj = {a:1,b:{c:1}}
var obj2 = {...obj};
obj.a=2;
console.log(obj); //{a:2,b:{c:1}}
console.log(obj2); //{a:1,b:{c:1}}

obj.b.c = 2;
console.log(obj); //{a:2,b:{c:2}}
console.log(obj2); //{a:1,b:{c:2}}
```

* 深拷贝
>将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且修改新对象不会影响原对象

  * Json.stringify()
```js
var obj1 = {
    a:1,
    b:[1,2,3]
}
var str = JSON.stringify(obj1)
var obj2 = JSON.parse(str)
console.log(obj2); //{a:1,b:[1,2,3]}
obj1.a=2
obj1.b.push(4);
console.log(obj1); //{a:2,b:[1,2,3,4]}
console.log(obj2); //{a:1,b:[1,2,3]}
```

vtk源码解读
---

### /vtk.js

vtk.js是根目录下的js文件，主要定义并暴露了一个vtk函数，该函数内包含几个方法来检查传入的vtk对象的合法性。并且浅拷贝了一个model对象。

### /macro.js
macro.js是的重要程度在vtk的官方手册中也有提到，它是一切vtk model的父类，所有的actor和source都是继承于macro的属性和方法。
macro.js主要定义了一些console.log和macro的方法.//L175

在obj类中，作为所有子类的共有方法，主要方法如下：
* isDeleted()
* modified()
* onModified()
* getMTime()
* isA()
* getClassName()
* set()
* get()
* getReferenceByName()
* deleted()
* getState()// Add serialization support
* shallowCopy()//Add shallowCopy(otherInstance) support

在get中类中，定义了get方法//L356
在set类中，定义了set方法//L436

在vtkAlgorithm类的定义中，定义了 `setInputData()`, `setInputConnection()`, `getOutputData()`, `getOutputPort()` 四种重要的函数

* `setInputData`
```js
  function setInputData(dataset, port = 0) {
    if (model.inputData[port] !== dataset || model.inputConnection[port]) {
          model.inputData[port] = dataset;
          model.inputConnection[port] = null;
          if (publicAPI.modified) {
            publicAPI.modified();
          }
        }
  }
```
在model内部设置了一个inputData的数组，用来将data放置在对应的[port]中(默认是0)

* `getInputData`
```js
 function getInputData(port = 0) {
    if (model.inputConnection[port]) {
      model.inputData[port] = model.inputConnection[port]();
    }
    return model.inputData[port];
  }
```
不用传入任何的参数，直接return一个model.inputData

* `setInputConnection`
```js
  model.inputConnection[port] = outputPort;
```

在model内部又创建了一个inputConenction属性，默认的[port]还是0

* `getInputConnection`
```js
  return model.inputConnection[port]
```

* `addInputConnection`
```js
model.numberOfInputs++;
    setInputConnection(outputPort, model.numberOfInputs - 1);
```
该方法是在setIpt的基础上，再在inputConnection数组内增加一个port并add新的Connection

* `addInputData`
  同上

ok，以上就是对于Inputdata的一些方法。但是vtk的developer，除了data的set和get，还提供了若干种data的相关方法：

* `getOutputPort`
return的结果是调用getOutputData函数 内部返回的结果，函数是一个嵌套函数

另外，macro还设置了一些全局的方法：
* update()
* getNumberOfInputPorts()
* getNumberOfOutputPorts()
* getInputArrayToProcess()

除了algo，还有一种叫做event的类，包含多种处理事件的方法及其回调函数，下面将列举一些event class中包含的方法：

* off()
* on()
* invoke()

除此之外，还有一种全局的方法，`newInstance`
```js
export function newInstance(extend, className) {
  const constructor = (initialValues = {}) => {
    const model = {};
    const publicAPI = {};
    extend(publicAPI, model, initialValues);

    return Object.freeze(publicAPI);
  };

  // Register constructor to factory
  if (className) {
    vtk.register(className, constructor);
  }

  return constructor;
}
```

macro.js后面包含的就是关于路由proxy的一些算法，
最后在文档的末尾暴露了一些在文档中定义的算法：
```js
export default {
  algo,
  capitalize,
  chain,
  debounce,
  enumToString,
  event,
  EVENT_ABORT,
  formatBytesToProperUnit,
  formatNumbersWithThousandSeparator,
  get,
  getArray,
  getCurrentGlobalMTime,
  getStateArrayMapFunc,
  isVtkObject,
  keystore,
  newInstance,
  normalizeWheel,
  obj,
  proxy,
  proxyPropertyMapping,
  proxyPropertyState,
  safeArrays,
  set,
  setArray,
  setGet,
  setGetArray,
  setImmediate: setImmediateVTK,
  setLoggerFunction,
  throttle,
  traverseInstanceTree,
  TYPED_ARRAYS,
  uncapitalize,
  VOID,
  vtkDebugMacro,
  vtkErrorMacro,
  vtkInfoMacro,
  vtkLogMacro,
  vtkOnceErrorMacro,
  vtkWarningMacro,
};

```